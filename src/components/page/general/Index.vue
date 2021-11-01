<template>
  <div class="page">
    <div>{{ username }}，您好！</div>
    <div
      v-if="student && this.$store.state.monitorBrowsingStatus === 'student'"
    >
      <StudentIndex/>
    </div>

    <div
      class="work"
      v-if="
        (monitor && this.$store.state.monitorBrowsingStatus === 'monitor') || instructor
      ">
      <InstructorIndex/>
    </div>
  </div>
</template>

<script>
import timeLine from "@/components/element/timeline";
import dynamicForm from "@/components/element/dynamicForm";
import StudentIndex from "./StudentIndex.vue";
import InstructorIndex from "./InstructorIndex.vue";

export default {
  name: "index",
  components: {
    timeLine,
    dynamicForm,
    StudentIndex,
    InstructorIndex
  },
  data() {
    return {
      username: "",
      instructor: false,
      student: false,
      monitor: false,
    };
  },
  created() {
    this.username = JSON.parse(sessionStorage.getItem("user")).name;
    this.instructor =
      JSON.parse(sessionStorage.getItem("user")).roles.indexOf("辅导员") >= 0;
    this.monitor =
      JSON.parse(sessionStorage.getItem("user")).roles.indexOf("班长") >= 0;
    this.student =
      JSON.parse(sessionStorage.getItem("user")).roles.indexOf("学生") >= 0;
    if (this.instructor) this.getInstructorIndex();
    if (this.student && !this.monitor) {
        this.$store.commit("changeMonitorBrowsingStatus", "student");
    }
  },
};
</script>

<style lang="scss" scoped>
$gutter: 30px;
$border-width: 4px;
$dot-diameter: 8px;

.circle {
  /*z-index: 3;*/
  border-radius: 100%;
  background-color: #fb7c9c;
  width: 6px;
  height: 6px;
  margin-left: auto;
  margin-right: auto;
}

</style>
