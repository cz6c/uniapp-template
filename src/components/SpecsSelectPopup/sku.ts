export type SpecsType = {
  title: string
  list: Array<string>
}

export type SkuType = {
  specs: Array<string>
  specsPrimes?: number
}

// 根据邻接矩阵的概念，实现规格选择
// 利用质数只被自己和1整除的特性，实现sku筛选
export class SpecAdjoinMatrix<T extends SkuType> {
  private vertex: Array<string> // 顶点数组（包含所有规格）
  private quantity: number // 矩阵长度
  private adjoinArray: Array<number> // 矩阵数组
  private specList: Array<SpecsType> // 规格列表
  private specCombinationList: Array<T> // sku列表 只传有库存的
  private attributeMapPrimes: Record<string, number> // 规格值和质数映射关系

  /**
   * @param {Array} specList 规格列表
   * @param {Array} specCombinationList sku列表 只传有库存的
   */
  constructor(specList: Array<SpecsType>, specCombinationList: Array<T>) {
    // 邻接矩阵初始化
    this.vertex = specList.reduce(
      (total: Array<string>, current: SpecsType) => [...total, ...current.list],
      [],
    )
    this.quantity = this.vertex.length
    this.adjoinArray = Array(this.quantity * this.quantity).fill(0)
    this.specList = specList
    this.attributeMapPrimes = this.getAttributeMapPrimes(specList)
    this.specCombinationList = this.specsToPrimes(specCombinationList)
    // 根据可选规格列表矩阵创建
    this.initSpec()
  }

  /*
   * @param id string
   * 传入顶点的值，获取该顶点的列
   */
  private getVertexCol(id: string) {
    const index = this.vertex.indexOf(id)
    const col: Array<number> = []
    this.vertex.forEach((item, pIndex) => {
      col.push(this.adjoinArray[index + this.quantity * pIndex])
    })
    return col
  }

  /*
   * @param params Array<string>
   * 传入一个顶点数组，求出该数组所有顶点的列的合
   */
  private getColSum(params: Array<string>) {
    // 所有顶点的列，[[], [], ...]
    const paramsVertex = params.map((id) => this.getVertexCol(id))
    const paramsVertexSum: Array<number> = []
    // 下面这个 forEach 和 map 能够取出每个顶点的列的同一个 index 下的值（也就是每个顶点列的同一行数据）
    // 得到顶点列的同一行数据后，通过 reduce 进行相加。数字大于等于总列数，说明是可选的
    this.vertex.forEach((item, index) => {
      const rowtotal = paramsVertex
        .map((value) => value[index])
        .reduce((total, current) => {
          total += current || 0
          return total
        }, 0)
      paramsVertexSum.push(rowtotal)
    })
    return paramsVertexSum
  }

  /*
   *  @param params Array<string>
   * 传入一个顶点数组，求出并集
   */
  private getCollection(params: Array<string>) {
    const paramsColSum = this.getColSum(params)
    const collections: Array<string> = []
    paramsColSum.forEach((item, index) => {
      if (item && this.vertex[index]) {
        collections.push(this.vertex[index])
      }
    })
    return collections
  }

  /*
   *  @param params Array<string>
   * 传入一个顶点数组，求出交集
   */
  private getUnions(params: Array<string>) {
    const paramsColSum = this.getColSum(params)
    const unions: Array<string> = []
    paramsColSum.forEach((item, index) => {
      // 数字大于等于总列数，说明是可选的
      if (item >= params.length && this.vertex[index]) {
        unions.push(this.vertex[index])
      }
    })
    return unions
  }

  /*
   * @param id string
   * @param sides Array<string>
   *  传入一个顶点，和当前顶点可达的顶点数组，将对应位置置为1
   */
  private setAdjoinVertexs(id: string, sides: Array<string>) {
    const pIndex = this.vertex.indexOf(id)
    sides.forEach((item) => {
      const index = this.vertex.indexOf(item)
      // 从邻接矩阵上看，
      // pIndex 是传入的顶点 index；
      // quantity 是邻接矩阵中行的 length；
      // index 是传入的顶点下的可组合的顶点元素下标
      // 那么 [pIndex * this.quantity + index] 就是可组合的 sku，置为 1
      this.adjoinArray[pIndex * this.quantity + index] = 1
    })
  }

  /**
   * 根据可选规格组合填写邻接矩阵的值
   */
  private initSpec() {
    this.specCombinationList.forEach((item) => {
      this.fillInSpec(item.specs)
    })
    this.initSameLevel()
  }

  // 填写同级点
  private initSameLevel() {
    // 获得初始所有可选项
    const specsOption = this.getCollection(this.vertex)
    this.specList.forEach((item) => {
      const params: Array<string> = []
      // 获取同级别顶点
      item.list.forEach((value) => {
        if (specsOption.includes(value)) params.push(value)
      })
      // 同级点位创建
      this.fillInSpec(params)
    })
  }

  /*
   * @params
   * 填写邻接矩阵的值
   */
  private fillInSpec(params: Array<string>) {
    params.forEach((param) => {
      this.setAdjoinVertexs(param, params)
    })
  }

  /*
   * @params
   * 传入顶点数组，查询出可选规格
   */
  getSpecscOptions(checkedSpecs: Array<string>) {
    let specOptionCanchoose: Array<string> = []
    if (checkedSpecs.some(Boolean)) {
      // 获取可选项（交集）
      specOptionCanchoose = this.getUnions(checkedSpecs.filter(Boolean))
    } else {
      // 所有可选项
      specOptionCanchoose = this.getCollection(this.vertex)
    }
    return specOptionCanchoose
  }

  /**
   * @description: 获取所有规格属性值和质数的映射关系
   * @param {Array} specList
   */
  private getAttributeMapPrimes(specList: Array<SpecsType>) {
    // 验证一个数是否为质数
    function isPrime(num: number) {
      for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
        if (num % i === 0) {
          return false
        }
      }
      return num !== 1
    }

    // 获取 previousNum 后的质数
    function getPrimeMapping(previousNum: number) {
      let num = previousNum + 1
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (isPrime(num)) {
          return num
        }
        num++
      }
    }
    const attributeMapPrimes: Record<string, number> = {}
    const primeNumbers: number[] = [2] // 已知的质数集合
    specList.map((x) => {
      x.list.map((y: string) => {
        attributeMapPrimes[y] = getPrimeMapping(primeNumbers[primeNumbers.length - 1])
        primeNumbers.push(attributeMapPrimes[y])
      })
    })
    return attributeMapPrimes
  }

  /**
   * @description: 计算 sku 规格属性数组所映射的质数积
   * @param {Array} specCombinationList
   */
  private specsToPrimes(specCombinationList: Array<T>) {
    return specCombinationList.map((x) => ({
      ...x,
      specsPrimes: x.specs.reduce((pre, cur) => (pre *= this.attributeMapPrimes[cur]), 1),
    }))
  }

  /**
   * @description: 根据规格对sku列表进行筛选
   * @param {Array} checkedSpecs
   */
  filterSkus(checkedSpecs: Array<string>) {
    const nums = checkedSpecs
      .filter(Boolean)
      .reduce((pre, cur) => (pre *= this.attributeMapPrimes[cur]), 1)
    return this.specCombinationList.filter(({ specsPrimes }) => specsPrimes! % nums === 0)
  }
}

/**
 * @description: 笛卡尔积生成sku列表
 * @param {SpecsType} specList
 */
export function generateSKUs(specList: SpecsType[]) {
  const arr = specList.map((x) => [x.list.filter(Boolean)])
  return arr.reduce((pre, cur) => pre.flatMap((x) => cur[0].map((y) => [...x, y])), [[]])
}
