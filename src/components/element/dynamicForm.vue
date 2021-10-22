<template>
  <div>
    <el-row>
      <h2 style="text-align: center">{{value.name}}</h2>
    </el-row>
    <el-row>
      <p style="text-align: center">{{value.intention}}</p>
    </el-row>
    <el-form :disabled="disabled" :model="value" ref="dynamicForm">
      <el-row :key="index" v-for="(question,index) in value.statsData">
        <el-form-item v-if="question.projectRules.type==='text'|| question.projectRules.type === 'textarea'"
                      :label="'Q'+(index+1)+' '+question.projectName" :prop="'statsData.'+index+'.projectRules.value'"
                      :rules="question.projectRules.rules">
          <el-input v-if="!isNumber(question.projectRules.rules)" v-model="question.projectRules.value"
                    :type="question.projectRules.type" clearable></el-input>
          <el-input v-if="isNumber(question.projectRules.rules)" v-model.number="question.projectRules.value"
                    :type="question.projectRules.type" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="question.projectRules.type==='radio'" :label="'Q'+(index+1)+' '+question.projectName"
                      :prop="'statsData.'+index+'.projectRules.value'" :rules="question.projectRules.rules"
        >
          <el-radio v-for="(questionOption,index) in question.projectRules.questionOption"
                    v-model="question.projectRules.value"
                    :label="questionOption" :key="index">{{questionOption}}
          </el-radio>
        </el-form-item>
        <el-form-item v-if="question.projectRules.type==='checkbox'" :label="'Q'+(index+1)+' '+question.projectName"
                      :prop="'statsData.'+index+'.projectRules.value'" :rules="question.projectRules.rules"
        >
          <el-checkbox v-for="(questionOption,index) in question.projectRules.questionOption"
                       v-model="question.projectRules.value"
                       :label="questionOption"
                       :key="index"></el-checkbox>
        </el-form-item>
        <el-form-item v-if="question.projectRules.type==='cascader'" :label="'Q'+(index+1)+' '+question.projectName"
                      :prop="'statsData.'+index+'.projectRules.value'" :rules="question.projectRules.rules"
        >
          <el-cascader
            :options="question.projectRules.questionOption"
            v-model="question.value">
          </el-cascader>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "dynamicForm",
    props: {
      value: {
        type: Object,
        required: true
      },
      disabled: Boolean
    },
    data: function () {
      return {
        value: this.value
      }
    },
    watch: {
      value: function (value) {
        let statsData = this.value.statsData;
        for (let i = 0; i < statsData.length; i++) {
          let rules = statsData[i].projectRules.rules;
          for (let j = 0; j < rules.length; j++) {
            rules[j] = this.parseRules(rules[j]);
          }
          let projectName = statsData[i].projectName;
          if (statsData[i].required) {
            rules.push({
              required: true, message: '请填写' + projectName, trigger: 'blur'
            });
          }
        }
      }

    },
    methods: {
      isNumber(val) {
        let loopTimes = val.length;
        for (let i = 0; i < loopTimes; i++) {
          if (val[i].type && val[i].type === "number") {
            return true;
          }
        }
        return false;
      },
      validate(fuc) {
        this.$refs['dynamicForm'].validate(fuc);
      },
      parseRules(selfRule) {
        if (selfRule.type === 'int') {
          return {
            validator: (rule, value, callback) => {
              if (!Number.isInteger(value)) {
                callback(new Error('必须输入整数'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          };
        } else if (selfRule.type === 'numberOrLetter') {
          return {
            validator: (rule, value, callback) => {
              if (!/^[A-Za-z0-9]+$/.test(value)) {
                callback(new Error('必须输入字母或者数字'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          };
        } else if (selfRule.type === 'maxNumber') {
          return {
            validator: (rule, value, callback) => {
              if (value > selfRule.maxNumber) {
                callback(new Error('最大输入数字为' + selfRule.maxNumber));
              } else {
                callback();
              }
            }, trigger: 'blur'

          }
        } else if (selfRule.type === 'minNumber') {
          return {
            validator: (rule, value, callback) => {
              if (value < selfRule.minNumber) {
                callback(new Error('最小输入数字为' + selfRule.minNumber));
              } else {
                callback();
              }
            }

          }
        }

        return selfRule;
      }
    }
  }
</script>

<style scoped>

</style>
