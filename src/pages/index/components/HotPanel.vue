<script setup lang="ts">
import type { HotItem } from '@/types/home'

// 定义 props 接收数据
defineProps<{
  list: HotItem[]
}>()
</script>

<template>
  <!-- 推荐专区 -->
  <view class="hot-panel">
    <view class="title">
      <text class="title-text">主要作品</text>
      <text class="title-desc">MORE ></text>
    </view>
    <scroll-view scroll-x>
      <view class="list">
        <navigator
          v-for="item in list"
          :key="item.id"
          hover-class="none"
          :url="`/pages/goods/goods?id=${item.id}`"
          class="item"
        >
          <image class="image" mode="scaleToFill" :src="item.pictures[0]"></image>
          <text class="text">{{ item.title }}</text>
        </navigator>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
.hot-panel {
  border-radius: 16rpx;
  background-color: #fff;
  padding: 32rpx;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 24rpx;
    font-size: 32rpx;
    color: #262626;
    position: relative;
    .title-desc {
      font-size: 24rpx;
      color: #7f7f7f;
      margin-left: 18rpx;
    }
  }
  .list {
    display: flex;
    align-items: center;
    .item {
      flex: 0 0 190rpx;
      height: 360rpx;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      .image {
        flex: 1;
        width: 100%;
        border-radius: 16rpx;
      }
      .text {
        font-size: 26rpx;
        color: #666;
        margin-top: 8rpx;
      }
    }
    .item + .item {
      margin-left: 16rpx;
    }
  }
}
</style>
