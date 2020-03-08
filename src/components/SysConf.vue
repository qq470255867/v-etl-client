<template>
  <el-container class="">
    <!-- <span>&nbsp;</span> -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="200px"
      style="margin: 10px auto 10px 450px"
    >
      <el-form-item
        label="平台名称"
        prop="platName"
      >
        <el-input
          v-model="ruleForm.platName"
          :disabled=editStatus
        ></el-input>
      </el-form-item>
      <el-form-item
        label="jar包存放路径"
        prop="jarPath"
      >
        <el-input
          v-model="ruleForm.jarPath"
          :disabled=editStatus
        ></el-input>
      </el-form-item>
      <el-form-item
        label="源码存放路径"
        prop="srcPath"
      >
        <el-input
          v-model="ruleForm.srcPath"
          :disabled=editStatus
        ></el-input>
      </el-form-item>
      <el-form-item
        label="执行详情刷新间隔(秒)"
        prop="logInterval"
      >
        <el-input
          v-model="ruleForm.logInterval"
          :disabled=editStatus
        ></el-input>
      </el-form-item>
      <el-popover
        ref="popover2"
        placement="bottom"
        title="接入量字段"
        width="400"
        trigger="click"
        content="使平台获取任务执行输出内容中的指定字段值，作为接入数据量结果保存(例如 dataVolume:23)"
      >
      </el-popover>
      <el-form-item
        label="接入量字段"
        prop="dataStatistical"
      >
        <el-input
          v-model="ruleForm.dataStatistical"
          :disabled=editStatus
        > <i
            v-popover:popover2
            slot="suffix"
            class="el-icon-info"
          ></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="editStart"
        >{{editInfo}}</el-button>
        <el-button
          v-show="!editStatus"
          type="primary"
          @click="updateSysConf(ruleForm,'ruleForm')"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>
<script>
import { postRequest } from '../utils/api'
import { getRequest } from '../utils/api'
export default {
  mounted: function () {
    this.getSysConf()
  },
  data() {
    return {
      editStatus: true,
      editInfo: '编辑',
      ruleForm: {
        platName: '',
        jarPath: '',
        srcPath: '',
        logInterval: '',
        dataStatistical: ''
      },
      rules: {
        platName: [
          { required: true, message: '请输入平台名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        jarPath: [
          { required: true, message: '请输入jar包存放路径', trigger: 'blur' },
        ],
        srcPath: [
          { required: true, message: '请输入源码存放路径', trigger: 'blur' }
        ],
        logInterval: [
          { required: true, message: '请输入刷新间隔', trigger: 'blur' }
        ],
        dataStatistical: [
          { required: true, message: '请填写接入量字段', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    editStart() {
      if (this.editStatus) {
        this.editInfo = '取消'
      } else {
        this.editInfo = '编辑'
      }
      this.editStatus = !this.editStatus
    },
    getSysConf() {
      this.loading = true
      getRequest("/vetl/sys/get_conf/", '').then(
        resp => {
          this.loading = false;
          this.ruleForm = resp.data.data;
        })
    },
    updateSysConf(conf) {
      this.loading = true
      postRequest("/vetl/sys/update_conf/", conf).then(
        resp => {
          this.loading = false;
          let res = resp.data;
          if (res.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.editStart()
          }else {
             this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
    }

  }

}
</script>
<style>
</style>
