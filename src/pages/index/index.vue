<script setup lang="ts">
import { ref } from 'vue'
import CustomNavbar from './components/CustomNavbar.vue'

// 当前下拉刷新状态
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  isTriggered.value = true
  setTimeout(() => {
    isTriggered.value = false
  }, 2000)
}
// 滚动触底事件
const onScrolltolower = () => {}
</script>

<template>
  <view class="index">
    <!-- 自定义导航栏 -->
    <CustomNavbar />
    <!-- 滚动容器 -->
    <scroll-view
      enable-back-to-top
      refresher-enabled
      @scrolltolower="onScrolltolower"
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      refresher-background="#f6f8f9"
      class="scroll-view"
      scroll-y
    >
      <view class="brand-list">
        <view class="brand" v-for="(item, i) in 12" :key="i">
          <view class="logo-info">
            <image
              class="logo"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            ></image>
            <view class="info">
              <view class="logo-text">SKII</view>
              <view class="des">全部88个商品</view>
            </view>
          </view>
          <image class="next" src="@/static/images/next.png"></image>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f6f8f9;
  height: 100%;
  overflow: hidden;
}
.index {
  height: 100%;
  display: flex;
  flex-direction: column;
  .scroll-view {
    flex: 1;
    overflow: hidden;
  }
  .brand-list {
    padding: 0 24rpx;
    padding-top: 24rpx;
    .brand {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 24rpx;
      width: 702rpx;
      height: 300rpx;
      background: #000000;
      margin-bottom: 24rpx;
      border-radius: 20rpx;
      .logo-info {
        display: flex;
        align-items: center;
        .logo {
          width: 100rpx;
          height: 100rpx;
          box-shadow: 0rpx 2rpx 8rpx 0rpx rgba(0, 0, 0, 0.2);
          border-radius: 16rpx;
        }
        .info {
          margin-left: 16rpx;
          font-size: 44rpx;
          font-weight: 500;
          color: #ffffff;
          line-height: 56rpx;
          .des {
            margin-top: 4rpx;
            height: 36rpx;
            font-size: 28rpx;
            font-weight: 400;
            color: #ffffff;
            line-height: 36rpx;
          }
        }
      }
      .next {
        width: 60rpx;
        height: 60rpx;
      }
    }
  }
}
</style>
