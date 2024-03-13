<script setup lang="ts" name="SpecsSelect">
import { computed, ref, reactive } from 'vue'
import { SpecAdjoinMatrix } from './sku'
import type { GoodsResult, SkuItem } from '@/types/goods'

const props = defineProps<{
  modelValue: boolean
  goodsInfo: GoodsResult
  safeAreaInsetBottom: boolean
  borderRadius: string
  mode: 1 | 2 | 3 | 4 //模式 1:都显示  2:只显示购物车 3:只显示立即购买 4:显示缺货按钮 默认 1
}>()

const emit = defineEmits([
  'update:modelValue',
  'input',
  'update-goods',
  'open',
  'close',
  'add-cart',
  'buy-now',
  'cart',
  'buy',
  'num-change',
])

const show = computed({
  get() {
    return props.modelValue
  },
  set(val: boolean) {
    emit('update:modelValue', val)
  },
})

interface State {
  selectSpecs: string[]
  optionSpecs: string[]
  specAdjoinMatrix: SpecAdjoinMatrix<SkuItem> | null
  loading: boolean
  safeBottom: number
  selectShop: SkuItem | null
  themeColor: any
}

const state = reactive<State>({
  selectSpecs: [],
  optionSpecs: [],
  specAdjoinMatrix: null,
  loading: false,
  safeBottom: 0,
  selectShop: null,
  themeColor: {
    priceColor: 'rgb(254, 86, 10)',
    buyNowColor: '#ffffff',
    buyNowBackgroundColor: 'rgb(254, 86, 10)',
    addCartColor: '#ffffff',
    addCartBackgroundColor: 'rgb(255, 148, 2)',
    btnStyle: {
      color: '#333333',
      borderColor: '#f4f4f4',
      backgroundColor: '#ffffff',
    },
    activedStyle: {
      color: 'rgb(254, 86, 10)',
      borderColor: 'rgb(254, 86, 10)',
      backgroundColor: 'rgba(254,86,10,0.1)',
    },
    disableStyle: {
      color: '#c3c3c3',
      borderColor: '#f6f6f6',
      backgroundColor: '#f6f6f6',
    },
  },
})

function initData() {
  const { specs, skus } = props.goodsInfo
  const specList = specs.map((c) => ({ title: c.name, list: c.options }))
  const skuList = skus.map((c) => ({ ...c, specs: c.specVals }))
  state.selectSpecs = Array(specs.length).fill('')
  // 创建一个规格矩阵
  state.specAdjoinMatrix = new SpecAdjoinMatrix(specList, skuList)
  // 获得可选项表
  state.optionSpecs = state.specAdjoinMatrix.getSpecscOptions(state.selectSpecs)
}
initData()

function handleClick(text: string, index: number) {
  // 选中/反选
  state.selectSpecs[index] = state.selectSpecs[index] === text ? '' : text
  // 重新获取可选项表
  state.optionSpecs = state.specAdjoinMatrix!.getSpecscOptions(state.selectSpecs)
  // 获取价格和库存
  getPricesAndStock()
}

const price = ref('')
const stock = ref(0)
function getPricesAndStock() {
  const skus = state.specAdjoinMatrix!.filterSkus(state.selectSpecs)
  console.log(skus)
  if (skus.length === 1) {
    price.value = `￥${skus[0].price}`
    stock.value = skus[0].inventory
  } else {
    const prices = skus.map(({ price }) => price)
    const max = Math.max(...prices)
    const min = Math.min(...prices)
    price.value = `￥${min}-${max}`
    stock.value = skus.reduce((pre, { inventory }) => (pre += inventory), 0)
  }
}
getPricesAndStock()

function init() {
  initData()
  getPricesAndStock()
}

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 底部安全距离
state.safeBottom = safeAreaInsets.bottom

function moveHandle() {
  //禁止父元素滑动
}
function stop() {
  //用于阻止冒泡
}
// 监听 - 弹出层收起
function close() {
  show.value = false
}
// 加入购物车
function addCart() {}
// 立即购买
function buyNow() {}

// 图片预览
function previewImage() {
  let src = state.selectShop?.picture ? state.selectShop?.picture : props.goodsInfo.picture
  if (src) {
    uni.previewImage({
      urls: [src],
    })
  }
}
// 主题颜色
function themeColorFn(name: string) {
  let color = state.themeColor[name]
  return color
}

const priceCom = computed(() => '')
const stockCom = computed(() => '')

defineExpose({
  init,
})
</script>

<template>
  <!-- <div class="container">
    <div>价格：{{ price }}</div>
    <div>库存：{{ stock }}</div>
    <div v-for="({ title, list }, index) in props.specList" :key="index">
      <p class="title">{{ title }}</p>
      <div class="spec-box">
        <button
          v-for="(ele, listIndex) in list"
          :key="listIndex"
          :disabled="!state.optionSpecs.includes(ele)"
          :class="{ action: state.selectSpecs.includes(ele) }"
          @click="handleClick(ele, index)"
        >
          {{ ele }}
        </button>
      </div>
    </div>
  </div> -->
  <view
    class="vk-data-goods-sku-popup"
    catchtouchmove="true"
    :class="show ? 'show' : 'none'"
    @touchmove.stop.prevent="moveHandle"
    @click.stop="stop"
  >
    <!-- 页面内容开始 -->
    <view class="mask" @click="close"></view>
    <view
      class="layer attr-content"
      :class="{ 'safe-area-inset-bottom': safeAreaInsetBottom }"
      :style="{
        borderRadius: borderRadius + 'rpx ' + borderRadius + 'rpx 0 0',
        paddingBottom: state.safeBottom + 'px',
      }"
    >
      <view class="specification-wrapper">
        <scroll-view class="specification-wrapper-content" :scroll-y="true">
          <view class="specification-header">
            <view class="specification-left">
              <image
                class="product-img"
                :src="state.selectShop?.picture ? state.selectShop?.picture : goodsInfo.picture"
                mode="aspectFill"
                @click="previewImage"
              ></image>
            </view>
            <view class="specification-right">
              <view class="price-content" :style="{ color: themeColorFn('priceColor') }">
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
                    // item_value.ishow ? '' : 'noactived',
                    // subIndex[index1] == index2 ? 'actived' : '',
                    actived: state.selectSpecs.includes(item_value),
                  }"
                  :style="[
                    // item_value.ishow ? '' : themeColorFn('disableStyle'),
                    // item_value.ishow ? themeColorFn('btnStyle') : '',
                    // subIndex[index1] == index2 ? themeColorFn('activedStyle') : '',
                  ]"
                  @click="handleClick(item_value, index1)"
                >
                  {{ item_value }}
                </view>
              </view>
            </view>
            <view class="number-box-view">
              <view style="flex: 1">数量</view>
              <view style="flex: 4; text-align: right">
                <!-- <vk-data-input-number-box
                  v-model="selectNum"
                  :min="minBuyNum || 1"
                  :max="maxBuyNumCom"
                  :step="stepBuyNum || 1"
                  :step-strictly="stepStrictly"
                  :positive-integer="true"
                  @change="numChange"
                ></vk-data-input-number-box> -->
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- <view class="btn-wrapper" v-if="outFoStock || mode == 4">
        <view class="sure" style="color: #ffffff; background-color: #cccccc">{{
          noStockText
        }}</view>
      </view> -->
      <view class="btn-wrapper" v-if="mode == 1">
        <view
          class="sure add-cart"
          style="border-radius: 38rpx 0rpx 0rpx 38rpx"
          :style="{
            color: themeColorFn('addCartColor'),
            backgroundColor: themeColorFn('addCartBackgroundColor'),
          }"
          @click="addCart"
        >
          加入购物车
        </view>

        <view
          class="sure"
          style="border-radius: 0rpx 38rpx 38rpx 0rpx"
          :style="{
            color: themeColorFn('buyNowColor'),
            backgroundColor: themeColorFn('buyNowBackgroundColor'),
          }"
          @click="buyNow"
        >
          立即购买
        </view>
      </view>
      <view class="btn-wrapper" v-else-if="mode == 2">
        <view
          class="sure add-cart"
          :style="{
            color: themeColorFn('addCartColor'),
            backgroundColor: themeColorFn('addCartBackgroundColor'),
          }"
          @click="addCart"
        >
          加入购物车
        </view>
      </view>
      <view class="btn-wrapper" v-else-if="mode == 3">
        <view
          class="sure"
          :style="{
            color: themeColorFn('buyNowColor'),
            backgroundColor: themeColorFn('buyNowBackgroundColor'),
          }"
          @click="buyNow"
        >
          立即购买
        </view>
      </view>
    </view>
    <!-- 页面内容结束 -->
  </view>
</template>

<style scoped lang="scss">
.action {
  color: blue;
}
/*  sku弹出层 */
.vk-data-goods-sku-popup {
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
    .mask {
      animation: hidePopup 0.2s linear both;
    }

    .layer {
      animation: hideLayer 0.2s linear both;
    }
  }

  &.none {
    display: none;
  }
  .mask {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .layer {
    display: flex;
    width: 100%;
    // height: 1014rpx;
    flex-direction: column;
    // min-height: 40vh;
    // max-height: 1014rpx;
    position: fixed;
    z-index: 99;
    bottom: 0;
    border-radius: 10rpx 10rpx 0 0;
    background-color: #fff;

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
          width: 100%;
          display: flex;
          flex-direction: row;
          position: relative;
          margin-bottom: 40rpx;

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
            padding: 0 35rpx 0 28rpx;
            box-sizing: border-box;
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
                padding: 10rpx 35rpx;
                font-size: 24rpx;
                border-radius: 10rpx;
                background-color: #ffffff;
                color: #333333;
                margin-right: 20rpx;
                margin-bottom: 16rpx;
                border: 1px solid #f4f4f4;
                box-sizing: border-box;
                &.actived {
                  border-color: #fe560a;
                  color: #fe560a;
                }

                &.noactived {
                  background-color: #f6f6f6;
                  border-color: #f6f6f6;
                  color: #c3c3c3;
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
      display: flex;
      width: 100%;
      height: 120rpx;
      flex: 0 0 120rpx;
      align-items: center;
      justify-content: space-between;
      padding: 0 26rpx;
      box-sizing: border-box;
      .layer-btn {
        width: 335rpx;
        height: 76rpx;
        border-radius: 38rpx;
        color: #fff;
        line-height: 76rpx;
        text-align: center;
        font-weight: 500;
        font-size: 28rpx;

        &.add-cart {
          background: #ffbe46;
        }

        &.buy {
          background: #fe560a;
        }
      }
      .sure {
        width: 698rpx;
        height: 68rpx;
        border-radius: 38rpx;
        color: #fff;
        line-height: 68rpx;
        text-align: center;
        font-weight: 500;
        font-size: 28rpx;
        background: #fe560a;
      }
      .sure.add-cart {
        background: #ff9402;
      }
    }
    .btn-wrapper.safe-area-inset-bottom {
      padding-bottom: 0;
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
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
