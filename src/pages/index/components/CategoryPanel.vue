<script setup lang="ts">
const list = [
  {
    icon: 'https://yanxuan-item.nosdn.127.net/e0cea368f41da1587b3b7fc523f169d7.png',
    name: '杂货小物',
    path: '/pages/hot/hot?type=1',
  },
  {
    icon: 'https://yanxuan-item.nosdn.127.net/e0cea368f41da1587b3b7fc523f169d7.png',
    name: '本季新品',
    path: '/pages/hot/hot?type=2',
  },
  {
    icon: 'https://yanxuan-item.nosdn.127.net/e0cea368f41da1587b3b7fc523f169d7.png',
    name: '艺术礼品',
    path: '/pages/hot/hot?type=3',
  },
  {
    icon: 'https://yanxuan-item.nosdn.127.net/e0cea368f41da1587b3b7fc523f169d7.png',
    name: '纸品/文具',
    path: '/pages/hot/hot?type=4',
  },
]
</script>

<template>
  <view class="category">
    <navigator
      class="category-item"
      hover-class="none"
      :url="item.path"
      v-for="item in list"
      :key="item.path"
    >
      <image class="icon" :src="item.icon"></image>
      <text class="text">{{ item.name }}</text>
    </navigator>
  </view>
</template>

<style lang="scss">
.category {
  padding: 32rpx 20rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background-color: #fff;
  border-radius: 16rpx;

  .category-item {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    .icon {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
    }
    .text {
      font-size: 26rpx;
      color: #666;
      margin-top: 8rpx;
    }
  }
}
</style>
