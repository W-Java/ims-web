<template>
  <div>
    <h2>{{ indexTitle }}</h2>
    <time-line v-for="item in works" :workItem="item" :key="item.id">
      <template slot-scope="{ item }">
        <h3 @click="checkWork(item.id)">{{ item.title }}</h3>
      </template>
    </time-line>
  </div>
</template>
<script>
import { getInstructorWork } from '../../../api/general.index';
export default {
  data() {
    return {
      item: [],
      works: [],
    };
  },
  methods:{
    checkWork(id) {
      this.$router.push({
        name: "onework",
        query: { work: id },
      });
    },
    async getInstructorIndex() {
      this.indexTitle = "我的计划工作";
      const res = await getInstructorWork();
      this.works = res.data.work;
    },
  }
};
</script>
<style lang="scss">
.work {
  h2 {
    font-family: "Microsoft Yahei UI";
    font-weight: normal;
    text-align: center;
  }
}
</style>