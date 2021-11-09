<template>
  <el-dialog
    title="加分项管理"
    :visible.sync="editAdd"
    width="80%">
    <el-table :data="addGroup">
      <el-table-column prop="itemType" label="加分类别"></el-table-column>
      <el-table-column prop="itemName" label="加分名称"></el-table-column>
      <el-table-column label="奖励等级">
        <template slot-scope="scope">
          <span v-if="scope.row.itemLevel===null||scope.row.itemLevel==='null'">&nbsp;</span>
          <span v-else>{{scope.row.itemLevel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="获奖级别">
        <template slot-scope="scope">
          <span v-if="scope.row.contestLevel===null||scope.row.contestLevel==='null'">&nbsp;</span>
          <span v-else>{{scope.row.contestLevel}}</span>
        </template>
      </el-table-column>
      <el-table-column label="比赛类别">
        <template slot-scope="scope">
          <span v-if="scope.row.contestKind===null||scope.row.contestKind==='null'">&nbsp;</span>
          <span v-else>{{scope.row.contestKind}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" width="50" label="分值"></el-table-column>
      <el-table-column width="200" label="证明" prop="imgUrl">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <img :src="scope.row.imgUrl" alt="" style="max-width: 600px; max-height: 600px;">
            <img slot="reference" :src="scope.row.imgUrl" alt="" style="width: 50px; height: 50px;">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="deleteOne(scope.row)" type="warning">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  props: [
    'editAdd',
    'addGroup',

  ],
  emits: [
    'deleteOne'
  ]
}
</script>

<style scoped>

</style>
