<template>
  <el-row>
    <el-table :data="cadresTableData">
      <el-table-column type="index" label="序号"/>
      <el-table-column label="加分项目" prop="itemName"/>
      <el-table-column label="分值" prop="score"/>
      <el-table-column label="上传证明" prop="imgUrl">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <img
              :src="scope.row.imgUrl"
              alt=""
              style="max-width: 600px; max-height: 600px;"
            >
            <img
              slot="reference"
              :src="scope.row.imgUrl"
              alt=""
              style="width: 50px; height: 50px;"
            >
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="danger"
            @click.native="
              (e1, e2) => {
                this.$emit('deleteItem', e1, e2)
              }
            "
            >删除</el-button
          >
          <!--<el-button size="small" type="info" @click.native="modifyCadres(scope)">修改</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div align="right">
      <el-button
        @click="
          e => {
            this.$emit('addItem', e)
          }
        "
        >添加</el-button
      >
    </div>
  </el-row>
</template>

<script>
export default {
  props: ['cadresTableData'],
  emits: ['addItem', 'deleteItem']
}
</script>

<style scoped>

</style>
