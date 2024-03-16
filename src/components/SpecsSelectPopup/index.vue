<script setup lang="ts">
import { computed, ref, reactive, watch } from 'vue'
import { SpecAdjoinMatrix } from './sku'
import type { GoodsResult, SkuItem } from '@/types/goods'
import InputNumberBox from './components/InputNumberBox.vue'
import { SkuMode } from './index.d'

interface Props {
  modelValue: boolean
  goodsInfo: GoodsResult
  mode: SkuMode
  borderRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  borderRadius: 10,
})

const emit = defineEmits(['update:modelValue', 'open', 'add-cart', 'buy-now', 'sure'])

const show = computed({
  get() {
    return props.modelValue
  },
  set(val: boolean) {
    emit('update:modelValue', val)
  },
})

watch(
  () => show.value,
  (val) => {
    console.log(val)
    if (val) {
      initData()
      emit('open')
    }
  },
)

interface State {
  specAdjoinMatrix: SpecAdjoinMatrix<SkuItem> | null
  selectSpecs: string[]
  optionSpecs: string[]
  filterSkus: SkuItem[]
}

const state = reactive<State>({
  specAdjoinMatrix: null,
  selectSpecs: [],
  optionSpecs: [],
  filterSkus: [],
})
const selectShop = ref<SkuItem | null>(null)

function initData() {
  const { specs, skus } = props.goodsInfo
  const specList = specs.map((c) => ({ title: c.name, list: c.options }))
  const skuList = skus.map((c) => ({ ...c, specs: c.specVals })).filter((_) => _.inventory > 1)
  state.selectSpecs = Array(specs.length).fill('')
  // 创建一个规格矩阵
  state.specAdjoinMatrix = new SpecAdjoinMatrix(specList, skuList)
  // 获得可选项表
  state.optionSpecs = state.specAdjoinMatrix.getSpecscOptions(state.selectSpecs)
  // 默认选第一个规格项中的第一个有库存的规格子项
  const specVal = skuList[0].specs[0]
  handleClick(0, specVal)
}

/**
 * @description: 选择规格子项
 * @param {*} index 所选规格项在规格数组中的索引
 * @param {*} text 规格子项名称
 */
function handleClick(index: number, text: string) {
  // 禁用不可选
  if (!state.optionSpecs.includes(text)) return
  // 选中/反选
  state.selectSpecs[index] = state.selectSpecs[index] === text ? '' : text
  // 重新获取可选项表
  state.optionSpecs = state.specAdjoinMatrix!.getSpecscOptions(state.selectSpecs)
  // 筛选符合的sku列表
  state.filterSkus = state.specAdjoinMatrix!.filterSkus(state.selectSpecs)
  if (state.filterSkus.length === 1) selectShop.value = state.filterSkus[0]
  else selectShop.value = null
}

// 计算价格
const priceCom = computed(() => {
  let price = ''
  if (state.filterSkus.length === 1) {
    price = `${state.filterSkus[0].price}`
  } else {
    const prices = state.filterSkus.map(({ price }) => price)
    const max = Math.max(...prices)
    const min = Math.min(...prices)
    price = `${min}-${max}`
  }
  return price
})
// 计算库存
const stockCom = computed(() => {
  let stock = 0
  if (state.filterSkus.length === 1) {
    stock = state.filterSkus[0].inventory
  } else {
    stock = state.filterSkus.reduce((pre, { inventory }) => (pre += inventory), 0)
  }
  return stock
})

// // 获取屏幕边界到安全区域距离
// const { safeAreaInsets } = uni.getSystemInfoSync()
// // 底部安全距离
// state.safeBottom = safeAreaInsets.bottom

function moveHandle() {
  //禁止父元素滑动
}
function stop() {
  //用于阻止冒泡
}
// 图片预览
function previewImage() {
  let src = selectShop.value?.picture ? selectShop.value?.picture : props.goodsInfo.picture
  if (src) {
    uni.previewImage({
      urls: [src],
    })
  }
}
// 监听 - 弹出层收起
function close() {
  show.value = false
}
const buyNum = ref(1)
// 加入购物车
function addCart() {
  if (selectShop.value) emit('add-cart', { ...selectShop.value, buyNum: buyNum.value })
  else uni.showToast({ title: '请选择商品' })
}
// 立即购买
function buyNow() {
  if (selectShop.value) emit('buy-now', { ...selectShop.value, buyNum: buyNum.value })
  else uni.showToast({ title: '请选择商品' })
}
// 确认
function sure() {
  if (selectShop.value) emit('sure', { ...selectShop.value, buyNum: buyNum.value })
  else uni.showToast({ title: '请选择商品' })
}
defineExpose({ selectShop })
</script>

<template>
  <view
    class="sku-popup"
    catchtouchmove="true"
    :class="show ? 'show' : 'hide'"
    @touchmove.stop.prevent="moveHandle"
    @click.stop="stop"
  >
    <view class="mask" @click="close"></view>
    <view
      class="layer attr-content safe-area-inset-bottom"
      :style="{
        borderRadius: borderRadius + 'rpx ' + borderRadius + 'rpx 0 0',
      }"
    >
      <view class="specification-wrapper">
        <scroll-view class="specification-wrapper-content" :scroll-y="true">
          <view class="specification-header">
            <view class="specification-left">
              <image
                class="product-img"
                :src="selectShop?.picture ? selectShop.picture : goodsInfo.picture"
                mode="aspectFill"
                @click="previewImage"
              ></image>
            </view>
            <view class="specification-right">
              <view class="price-content">
                <text class="sign">¥</text>
                <text class="price" :class="priceCom.length > 16 ? 'price2' : ''">{{
                  priceCom
                }}</text>
              </view>
              <view class="inventory">库存：{{ stockCom }}</view>
              <view class="choose">已选：{{ state.selectSpecs.join(' ') }}</view>
            </view>
          </view>

          <view class="specification-content">
            <view
              class="specification-item"
              v-for="(item, index1) in goodsInfo.specs"
              :key="index1"
            >
              <view class="item-title">{{ item.name }}</view>
              <view class="item-wrapper">
                <view
                  class="item-content"
                  v-for="(item_value, index2) in item.options"
                  :key="index2"
                  :class="{
                    actived: state.selectSpecs.includes(item_value),
                    disabled: !state.optionSpecs.includes(item_value),
                  }"
                  @click="handleClick(index1, item_value)"
                >
                  {{ item_value }}
                </view>
              </view>
            </view>
            <view class="number-box-view">
              <view style="flex: 1">数量</view>
              <view style="flex: 4; text-align: right">
                <InputNumberBox
                  v-model="buyNum"
                  :min="1"
                  :max="stockCom"
                  :step="1"
                  :step-strictly="true"
                ></InputNumberBox>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="btn-wrapper" v-if="mode === SkuMode.CartAndCart">
        <view class="btn add-cart" style="border-radius: 38rpx 0rpx 0rpx 38rpx" @click="addCart">
          加入购物车
        </view>
        <view class="btn" style="border-radius: 0rpx 38rpx 38rpx 0rpx" @click="buyNow">
          立即购买
        </view>
      </view>
      <view class="btn-wrapper" v-else-if="mode === SkuMode.Cart">
        <view class="btn add-cart" @click="addCart"> 加入购物车 </view>
      </view>
      <view class="btn-wrapper" v-else-if="mode === SkuMode.Buy">
        <view class="btn" @click="buyNow"> 立即购买 </view>
      </view>
      <view class="btn-wrapper" v-if="mode === SkuMode.Sure">
        <view class="btn sure" @click="sure" style="">确认</view>
      </view>
      <view class="btn-wrapper" v-else>
        <view class="btn no-stork">缺货</view>
      </view>
    </view>
    <!-- 页面内容结束 -->
  </view>
</template>

<style scoped lang="scss">
/*  sku弹出层 */
.sku-popup {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 990;
  overflow: hidden;
  &.show {
    display: block;

    .mask {
      animation: showPopup 0.2s linear both;
    }

    .layer {
      animation: showLayer 0.2s linear both;
      bottom: var(--window-bottom);
    }
  }

  &.hide {
    display: none;

    .mask {
      animation: hidePopup 0.2s linear both;
    }

    .layer {
      animation: hideLayer 0.2s linear both;
    }
  }

  .mask {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .attr-content {
    position: fixed;
    bottom: 0;
    z-index: 99;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;

    &.safe-area-inset-bottom {
      padding-bottom: 0;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
    }

    .specification-wrapper {
      width: 100%;
      padding: 30rpx 25rpx;
      box-sizing: border-box;
      .specification-wrapper-content {
        width: 100%;
        max-height: 900rpx;
        min-height: 300rpx;
        &::-webkit-scrollbar {
          /*隐藏滚轮*/
          display: none;
        }

        .specification-header {
          position: relative;
          margin-bottom: 40rpx;
          display: flex;
          flex-direction: row;
          width: 100%;

          .specification-left {
            width: 180rpx;
            height: 180rpx;
            flex: 0 0 180rpx;

            .product-img {
              width: 180rpx;
              height: 180rpx;
            }
          }

          .specification-right {
            flex: 1;
            box-sizing: border-box;
            padding: 0 35rpx 0 28rpx;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            font-weight: 500;

            .price-content {
              color: #fe560a;
              margin-bottom: 20rpx;

              .sign {
                font-size: 28rpx;
              }

              .price {
                margin-left: 4rpx;
                font-size: 48rpx;
              }
              .price2 {
                margin-left: 4rpx;
                font-size: 36rpx;
              }
            }

            .inventory {
              font-size: 24rpx;
              color: #999999;
              margin-bottom: 14rpx;
            }

            .choose {
              font-size: 28rpx;
              color: #333333;
            }
          }
        }

        .specification-content {
          font-weight: 500;

          .specification-item {
            margin-bottom: 40rpx;

            &:last-child {
              margin-bottom: 0;
            }

            .item-title {
              margin-bottom: 20rpx;
              font-size: 28rpx;
              color: #999999;
            }

            .item-wrapper {
              display: flex;
              flex-direction: row;
              flex-flow: wrap;

              .item-content {
                display: inline-block;
                box-sizing: border-box;
                margin-right: 20rpx;
                margin-bottom: 16rpx;
                padding: 10rpx 35rpx;
                border-radius: 10rpx;
                border: 1px solid #f4f4f4;
                background-color: #ffffff;
                color: #333333;
                font-size: 24rpx;
                &.actived {
                  border-color: #fe560a;
                  color: #fe560a;
                }
                &.disabled {
                  border-color: #f6f6f6;
                  color: #c3c3c3;
                  opacity: 0.8;
                  cursor: not-allowed;
                }
              }
            }
          }
          .number-box-view {
            display: flex;
            padding-top: 30rpx;
          }
        }
      }
    }
    .btn-wrapper {
      box-sizing: border-box;
      padding: 0 26rpx;
      width: 100%;
      height: 120rpx;
      flex: 0 0 120rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .btn {
        width: 698rpx;
        height: 68rpx;
        border-radius: 38rpx;
        color: #fff;
        line-height: 68rpx;
        text-align: center;
        font-weight: 500;
        font-size: 28rpx;
        background: #fe560a;
        &.add-cart {
          background: #ff9402;
        }
        &.sure {
          background-color: #ff9402;
        }
        &.no-stork {
          background-color: #cccccc;
        }
      }
    }
  }

  @keyframes showPopup {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes hidePopup {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes showLayer {
    0% {
      transform: translateY(120%);
    }

    100% {
      transform: translateY(0%);
    }
  }

  @keyframes hideLayer {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(120%);
    }
  }
}
</style>
