<script setup lang="ts">
import { getHomeGoodsGuessLikeAPI } from '@/services/home'
import type { PageParams } from '@/types/global'
import type { GuessItem } from '@/types/home'
import { onMounted, ref } from 'vue'

// 分页参数
const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
}
// 猜你喜欢的列表
const guessList = ref<GuessItem[]>([])
// 已结束标记
const finish = ref(false)
// 获取猜你喜欢数据
const getHomeGoodsGuessLikeData = async () => {
  // 退出分页判断
  if (finish.value === true) {
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }
  const res = await getHomeGoodsGuessLikeAPI(pageParams)
  // guessList.value = res.result.items
  // 数组追加
  guessList.value.push(...res.result.items)
  // 分页条件
  if (pageParams.page < res.result.pages) {
    // 页码累加
    pageParams.page++
  } else {
    finish.value = true
  }
}
// 重置数据
const resetData = () => {
  pageParams.page = 1
  guessList.value = []
  finish.value = false
}
// 组件挂载完毕
onMounted(() => {
  getHomeGoodsGuessLikeData()
})
// 暴露方法
defineExpose({
  resetData,
  getMore: getHomeGoodsGuessLikeData,
})
</script>

<template>
  <view class="recommend-panel">
    <view class="title">
      <text class="title-text">文创好物</text>
    </view>
    <view class="guess">
      <navigator
        class="guess-item"
        v-for="item in guessList"
        :key="item.id"
        :url="`/pages/goods/goods?id=${item.id}`"
      >
        <image class="image" mode="aspectFill" :src="item.picture"></image>
        <view class="name"> {{ item.name }} </view>
        <view class="price">
          <text class="small">¥</text>
          <text>{{ item.price }}</text>
        </view>
      </navigator>
    </view>
    <view class="loading-text">
      {{ finish ? '没有更多数据~' : '正在加载...' }}
    </view>
  </view>
</template>

<style lang="scss">
.recommend-panel {
  border-radius: 16rpx;
  background-color: #fff;
  padding: 32rpx 24rpx;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 24rpx;
    font-size: 32rpx;
    color: #262626;
    position: relative;
  }
  .guess {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .guess-item {
      width: 320rpx;
      box-sizing: border-box;
      padding: 20rpx;
      margin-bottom: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
    }
    .image {
      width: 280rpx;
      height: 280rpx;
    }
    .name {
      height: 75rpx;
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .price {
      line-height: 1;
      padding-top: 4rpx;
      color: #cf4444;
      font-size: 26rpx;
    }
    .small {
      font-size: 80%;
    }
  }
  // 加载提示文字
  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
