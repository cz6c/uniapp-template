<script setup lang="ts">
import { ref } from 'vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const value = ref('')
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets!.top + 8 + 'px' }">
    <!-- logo文字 -->
    <view class="logo">
      <image
        class="logo-image"
        src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
      ></image>
      <text class="logo-text">小张翼德的店铺</text>
    </view>
    <!-- 搜索条 -->
    <view class="search">
      <uni-easyinput
        class="input-search"
        v-model="value"
        prefixIcon="search"
        :inputBorder="false"
        confirm-type="search"
        placeholder="好安森糖尿病治疗仪"
      ></uni-easyinput>
      <text class="text-search">搜索</text>
    </view>
    <image class="info-image" src="@/static/images/navigator_info.png"></image>
  </view>
</template>

<style lang="scss">
/* 自定义导航条 */
.navbar {
  background: no-repeat center;
  background-image: url(@/static/images/navigator_bg.png);
  background-size: 100% 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .logo {
    display: flex;
    align-items: center;
    height: 56rpx;
    padding-left: 24rpx;
    .logo-image {
      width: 56rpx;
      height: 56rpx;
      border-radius: 50%;
    }
    .logo-text {
      width: 224rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
      padding-left: 16rpx;
    }
  }
  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx 0 24rpx;
    margin: 44rpx 24rpx 0;
    height: 60rpx;
    color: #999999;
    font-size: 28rpx;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 200rpx;
    .text-search {
      width: 108rpx;
      height: 52rpx;
      background: linear-gradient(90deg, #ff9f1a 0%, #ff5e00 100%);
      border-radius: 200rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .info-image {
    height: 40rpx;
    width: auto;
    margin: 24rpx 48rpx;
  }
}
</style>
