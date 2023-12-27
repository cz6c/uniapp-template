<script setup lang="ts">
import { getHomeBannerAPI, getHomeHotAPI } from '@/services/home'
import type { BannerItem, HotItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import RecommendPanel from './components/RecommendPanel.vue'
import PageSkeleton from './components/PageSkeleton.vue'

// 获取猜你喜欢组件实例
const refRecommendPanel = ref()

// 获取轮播图数据
const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

// 获取热门推荐数据
const hotList = ref<HotItem[]>([])
const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
}

// 滚动触底事件
const onScrolltolower = () => {
  refRecommendPanel.value?.getMore()
}

// 是否加载中标记
const isLoading = ref(false)

// 页面加载
onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeBannerData(), getHomeHotData()])
  isLoading.value = false
})

// 当前下拉刷新状态
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 加载数据
  // await getHomeBannerData()
  // await getHomeHotData()
  // 重置猜你喜欢组件数据
  refRecommendPanel.value?.resetData()
  await Promise.all([getHomeBannerData(), getHomeHotData(), refRecommendPanel.value?.getMore()])
  // 关闭动画
  isTriggered.value = false
}
</script>

<template>
  <view class="viewport">
    <!-- 滚动容器 -->
    <scroll-view
      enable-back-to-top
      refresher-enabled
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      @scrolltolower="onScrolltolower"
      class="scroll-view"
      scroll-y
    >
      <PageSkeleton v-if="isLoading" />
      <template v-else>
        <!-- 自定义轮播图 -->
        <XtxSwiper :list="bannerList" />
        <!-- 分类面板 -->
        <view class="wrap">
          <CategoryPanel />
        </view>
        <!-- 主要作品 -->
        <view class="wrap">
          <HotPanel :list="hotList" />
        </view>
        <!-- 文创好物 -->
        <view class="wrap">
          <RecommendPanel ref="refRecommendPanel" />
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
  .wrap {
    padding: 0 24rpx;
    margin-top: 24rpx;
  }
}
</style>
