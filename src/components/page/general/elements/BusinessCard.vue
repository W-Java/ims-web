<!--个人信息-->
<template>
  <el-col :span="5" class="businessCard">
<!--    个人照片    -->
    <el-row>
      <img
        :src="photo"
        v-if="photo"
        style="height: 80%; width: 80%; margin-top: 10px; max-width: 280px"
        title="照片"
      />
    </el-row>
<!--    姓名栏     -->
    <el-row :gutter="20" class="businessCard_name">
      <el-col :span="12" style="text-align: right">姓名</el-col>
      <el-col :span="12" style="text-align: left">{{ name }}</el-col>
    </el-row>
<!--    性别栏     -->
    <el-row :gutter="20" class="businessCard_sex">
      <el-col :span="12" style="text-align: right">性别</el-col>
      <el-col :span="12" style="text-align: left">{{ sex }}</el-col>
    </el-row>
<!--    专业班级栏     -->
    <el-row :gutter="20" class="businessCard_majorAndClass">
      <el-col :span="12" style="text-align: right">专业班级</el-col>
      <el-col :span="12" style="text-align: left">{{ majorAndClass }}</el-col>
    </el-row>
<!--    学号栏     -->
    <el-row
      :gutter="20"
      class="businessCard_IDNumber"
      style="margin-bottom: 5px"
    >
      <el-col :span="12" style="text-align: right">学号</el-col>
      <el-col :span="12" style="text-align: left">{{ IDNumber }}</el-col>
    </el-row>
<!--    详细信息的按钮     -->
    <el-row style="margin-top: 60px">
      <el-button
        style="width: 80%; max-width: 280px"
        @click="
          () => {
            this.$emit('info');
          }
        "
        >详细个人信息</el-button
      >
    </el-row>
  </el-col>
</template>
<script>
export default {
  props: ['photo','name','sex','majorAndClass','IDNumber'],
  emits: ["info"],
}
</script>

<style lang="scss" scoped>
.businessCard {
  /*border-color: #c7c7c7;*/
  border-color: #fb7299;
  height: 500px;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  -webkit-transition: 0.2s;
  -moz-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
}

.businessCard:hover {
  -webkit-box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
  -moz-box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
  box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
}

</style>
