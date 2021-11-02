<template>
<!--  实现轮播效果  -->
  <el-carousel :interval="4000" type="card" height="240px">
    <el-carousel-item
      v-for="(carouselItem, index) in carouselItems.length"
      :key="index"
    >
      <a
        class="carousel_card"
        :href="carouselItems[index].link"
        target="_blank"
      >
        <img
          :src="carouselItems[index].src"
          style="width: 100%; height: 240px"
        />
      </a>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
export default {
    props:['carouselItems']
}
</script>
<style lang="scss">

.el-carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel_card {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-carousel__item h3 {
  color: #db6386;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #fb7299;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: rgb(255, 203, 220);
}
</style>
