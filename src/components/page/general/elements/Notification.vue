<template>
<!--  通知  -->
  <el-col class="notificationAndStat">
    <el-row style="margin-top: 10px">
      <el-col :span="12" style="font-weight: bolder; text-align: left"
        >&nbsp;&nbsp;通知</el-col
      >
      <el-col :span="12" style="text-align: right">
        <el-button
          icon="el-icon-more"
          style="margin-right: 10px; height: 1.5em; padding-top: 2px"
          @click="(e)=>this.$emit('moreNotifications',e)"
        >
          更多
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <template>
        <el-table
          :data="notificationTableData"
          style="width: 98%; margin-left: auto; margin-right: auto"
          :show-header="false"
          @row-click="(e)=>this.$emit('handleNotificationRowClick',e)"
        >
          <el-table-column width="16" align="center">
            <template slot-scope="scope">
              <div class="circle" v-if="scope.row.unread"></div>
            </template>
          </el-table-column>
          <el-table-column prop="title" min-width="500" align="left">
          </el-table-column>
          <el-table-column prop="createTime" width="200" fixed="right">
          </el-table-column>
        </el-table>
      </template>
    </el-row>
  </el-col>
</template>
<script>
export default {
    props:['notificationTableData'],
    emits:['moreNotifications','handleNotificationRowClick']
}
</script>
<style lang="scss">
.notificationAndStat {
  /*border-color: #c7c7c7;*/
  border-color: #fb7299;
  height: 234px;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
  -webkit-transition: 0.2s;
  -moz-transition: 0.2s;
  -o-transition: 0.2s;
  transition: 0.2s;
}

.notificationAndStat:hover {
  -webkit-box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
  -moz-box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
  box-shadow: 0 0 2em rgba(255, 116, 155, 0.19);
}
</style>
