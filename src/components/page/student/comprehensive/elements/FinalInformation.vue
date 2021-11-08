<template>
  <div>
    <!--    公式确认的按钮     -->
    <div style="text-align: right" v-if="checked">
      <el-button type="primary" @click.native="check">公示确认</el-button>
    </div>
    <!--    综测公示的表格   -->
    <div v-if="showTable">
      <!--控制结束后学生页面不再展示别人的公示-->
      <div style="padding-top: 2%">
        <el-table
          id="table"
          style="width: 100%" stripe
          :data="studentsData"
          v-loading="loading"
          border
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="studentsData[props.$index].records" style="width: 100%">
                <el-table-column label="项目类型" prop="itemType"></el-table-column>
                <el-table-column label="项目名" prop="itemName"></el-table-column>
                <el-table-column label="项目等级">
                  <template slot-scope="scope">
                    <span v-if="scope.row.itemLevel!==null&&scope.row.itemLevel!=='null'">{{scope.row.itemLevel}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="项目分数" prop="score"></el-table-column>
                <el-table-column label="凭证">
                  <template slot-scope="scope">
                    <span v-if="scope.row.imgUrl===null">暂无证明</span>
                    <img v-else class="scoreImg" v-bind:src="scope.row.imgUrl"/>
                  </template>
                </el-table-column>
                <el-table-column label="备注" prop="reason"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="compreRank" label="综测排名">
          </el-table-column>
          <el-table-column prop="majorRank" label="裸分排名">
          </el-table-column>
          <el-table-column prop="_class" label="班级">
          </el-table-column>
          <el-table-column prop="number" label="学号">
          </el-table-column>
          <el-table-column prop="name" label="姓名">
          </el-table-column>
          <el-table-column prop="grade" label="裸分">
          </el-table-column>
          <el-table-column prop="moral" label="德育分">
          </el-table-column>
          <el-table-column prop="addGrade" label="综测加分">
          </el-table-column>
          <el-table-column prop="allGrade" label="总分">
          </el-table-column>
        </el-table>
      </div>
      <!--    设置分页    -->
      <div class="block" style="float: right;">
        <el-pagination
          @size-change="
          () => {
            this.$emit('handleSizeChange')
          }
        "
          @current-change="
          () => {
            this.$emit('handleCurrentChange')
          }
        "
          :current-page="currentPage"
          :page-sizes="[20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="recordQuantity"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['checked', 'showTable', 'studentsData', 'loading', 'currentPage', 'pageSize', 'recordQuantity'],
  emits: ['handleSizeChange', 'handleCurrentChange']
}
</script>

<style scoped>

</style>
