<template>
  <el-col class="notificationAndStat">
    <el-row style="margin-top: 10px">
      <el-col :span="12" style="font-weight: bolder; text-align: left"
        >&nbsp;&nbsp;待办事项</el-col
      >
      <el-col :span="12" style="text-align: right">
        <el-button
          icon="el-icon-more"
          style="margin-right: 10px; height: 1.5em; padding-top: 2px"
          @click="(e)=>this.$emit('moreStatList',e)"
        >
          更多
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <template>
        <el-table
          :data="statTableData"
          style="width: 98%; margin-left: auto; margin-right: auto"
          :show-header="false"
          @row-click="(e)=>this.$emit('handleStatListRowClick',e)"
        >
          <el-table-column prop="name" min-width="200" align="left">
          </el-table-column>
          <el-table-column prop="status" min-width="100"> </el-table-column>
          <el-table-column prop="startDate" width="150"> </el-table-column>
          <el-table-column prop="endDate" width="150"> </el-table-column>
        </el-table>
      </template>
    </el-row>
  </el-col>
</template>
<script>
export default {
    props:['statTableData'],
    emits:['moreStatList','handleStatListRowClick']
}
</script>