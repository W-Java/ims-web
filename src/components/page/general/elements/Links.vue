<template>
  <el-col :span="5" class="links">
    <el-row style="margin: 10px 0">
      <el-col :span="12" style="font-weight: bolder; text-align: left"
        >常用链接</el-col
      >
    </el-row>
    <div
      v-for="linkItem in friendlyLinkItems"
      class="listDirection"
      style="text-align: left"
      v-bind:key="linkItem.title"
    >
      <a :href="linkItem.link" target="_blank">{{ linkItem.title }}</a>
    </div>
  </el-col>
</template>
<script>
export default {
    props:['friendlyLinkItems']
};
</script>
<style lang="scss">
.links {
  height: 500px;
  /*border-color: #c7c7c7;*/
  border-color: #fb7299;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  -webkit-transition: 0.2s;
  -moz-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
}

.links:hover {
  -webkit-box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
  -moz-box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
  box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
}

.listDirection {
  padding: 10px;
  box-sizing: padding-box;
  -webkit-transition: 0.2s;
  -moz-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
}

.listDirection:hover {
  -moz-box-shadow: 2px 2px 5px #000000;
  -webkit-box-shadow: 2px 2px 5px #000000;
  box-shadow: 2px 2px 5px #000000;
}
</style>