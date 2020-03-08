<template>
  <el-container class="">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      style="margin: 10px auto 10px 450px;"
    >
      <el-form-item
        label="任务名称"
        prop="name"
      >
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item
        label="任务描述"
        prop="description"
      >
        <el-input
          type="textarea"
          v-model="ruleForm.description"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="cron表达式 "
        prop="cron"
      >
        <!-- <el-input v-model="ruleForm.cron">
          <i
            v-popover:popover2
            slot="suffix"
            class="el-icon-info"
          ></i>
        </el-input> -->
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="ruleForm.cron"
          :fetch-suggestions="queryCron"
          placeholder=""
          size="medium"
        >
          <i
            class="el-icon-edit el-input__icon"
            slot="suffix"
          >
          </i>
          <template slot-scope="props">
            <div class="name">{{ props.item.value }}</div>
            <span style="font-size: 12px;color: #b4b4b4;">{{ props.item.content }}</span>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item
        label="接入类型"
        prop="accessType"
      >
        <el-select
          v-model="ruleForm.accessType"
          placeholder="请选择接入类型"
        >
          <el-option
            v-for="item in accessType"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="接出类型"
        prop="outputType"
      >
        <el-select
          v-model="ruleForm.outputType"
          placeholder="请选择接出类型"
        >
          <el-option
            v-for="item in outputType"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="任务jar包"
        prop="jarPath"
      >
        <el-upload
          class="upload-demo"
          drag
          action="/vetl/fileupload/upload/jar"
          :on-success="addJarFilePath"
          :on-error="addFileError"
          :limit="1"
          ref="uploadJar"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            只支持.jar类型文件上传,且不大于50Mb</div>
          <div
            class="el-upload__tip"
            slot="tip"
          >
          </div>
        </el-upload>
      </el-form-item>
      <el-collapse style="color: BLACK; ">
        <el-collapse-item
          title=""
        >
          <el-form-item label="jvm 运行参数">
            <el-input
              type="textarea"
              v-model="ruleForm.vmParam"
            ></el-input>
          </el-form-item>
          <el-form-item label="入口参数">
            <el-input v-model="ruleForm.parameter"></el-input>
          </el-form-item>
          <el-form-item
            label="任务源码"
            prop="srcPath"
          >
            <el-upload
              class="upload-demo"
              drag
              action="/vetl/fileupload/upload/src"
              multiple
              :on-success="addSrcFilePath"
              :on-error="addFileError"
              :limit="1"
              ref="uploadSrc"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                只支持.zip类型文件上传,且不大于10Mb</div>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="是否开启"
            prop="open"
          >
            <el-switch v-model="ruleForm.open"></el-switch>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
      <el-form-item style="margin-top:20px;">
        <el-button
          type="primary"
          @click="submitForm(ruleForm,'ruleForm')"
        >立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>
<script>
import { postRequest } from '../utils/api'
import { getRequest } from '../utils/api'
export default {
  mounted: function () {
    this.getOutType()
    this.getAccessType()
  },
  data() {
    return {
      // usualCron: '&nbsp*/5&nbsp*&nbsp*&nbsp*&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每隔5秒执行一次<br>&nbsp0&nbsp*/1&nbsp*&nbsp*&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每隔1分钟执行一次<br>&nbsp0&nbsp0&nbsp12&nbsp*&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每天中午十二点触发<br>&nbsp0&nbsp0&nbsp23&nbsp*&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每天23点执行一次<br>&nbsp0&nbsp0&nbsp1&nbsp*&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每天凌晨1点执行一次<br>&nbsp0&nbsp0&nbsp1&nbsp1&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每月1号凌晨1点执行一次<br>&nbsp0&nbsp0&nbsp23&nbspL&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每月最后一天23点执行一次<br>&nbsp0&nbsp0&nbsp1&nbsp?&nbsp*&nbspL&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每周星期天凌晨1点实行一次<br>&nbsp0&nbsp26,29,33&nbsp*&nbsp*&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp在26分、29分、33分执行一次<br>&nbsp0&nbsp0&nbsp0,13,18,21&nbsp*&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每天的0点、13点、18点、21点都执行一次<br>&nbsp0&nbsp15&nbsp10&nbsp?&nbsp*&nbsp*&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每天早上10：15触发<br>&nbsp0&nbsp15&nbsp10&nbsp*&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每天早上10：15触发<br>&nbsp0&nbsp15&nbsp10&nbsp*&nbsp*&nbsp?&nbsp*&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每天早上10：15触发<br>&nbsp0&nbsp15&nbsp10&nbsp*&nbsp*&nbsp?&nbsp2005&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp2005年的每天早上10：15触发<br>&nbsp0&nbsp*&nbsp14&nbsp*&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp下午2点开始到2点59分每分钟触发<br>&nbsp0&nbsp0/5&nbsp14&nbsp*&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每天从下午2点开始到2：55分结束每5分钟一次触发<br>&nbsp0&nbsp0/5&nbsp14,18&nbsp*&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每天的下午2点至2：55和6点至6点55分内每5分钟一次触发<br>&nbsp0&nbsp0-5&nbsp14&nbsp*&nbsp*&nbsp?&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp每天14:00至14:05每分钟一次触发<br>&nbsp0&nbsp10,44&nbsp14&nbsp?&nbsp3&nbspWED&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp三月的每周三的14：10和14：44触发<br>&nbsp0&nbsp15&nbsp10&nbsp?&nbsp*&nbspMON-FRI&nbsp&nbsp&nbsp&nbsp&nbsp每个周一、周二、周三、周四、周五的10：15触发<br>',

      accessType: [{
      }],
      outputType: [],
      usualCron: [
        { "value": "*/5 * * * * ?", "content": "每隔5秒执行一次" },
        { "value": "0 */1 * * * ?", "content": "每隔1分钟执行一次" },
        { "value": "0 0 23 * * ?", "content": "每天23点执行一次" },
        { "value": "0 0 1 1 * ?", "content": "每月1号凌晨1点执行一次" },
        { "value": "0 0 23 L * ?", "content": "每月最后一天23点执行一次" },
        { "value": "0 0 1 ? * L", "content": "每周星期天凌晨1点执行一次" },
        { "value": "0 26,29,33 * * * ?", "content": "在26分、29分、33分执行一次" },
        { "value": "", "content": "" },
        { "value": "", "content": "" },
        { "value": "", "content": "" },
        { "value": "", "content": "" }
      ],
      ruleForm: {
        name: '',
        accessType: '',
        outputType: '',
        cron: '',
        open: false,
        description: '',
        jarPath: '',
        srcPath: '',
        vmParam: '',
        parameter: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入任务名称名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        cron: [
          { required: true, message: '请输入cron表达式', trigger: 'blur' },
          { min: 3, max: 30, message: '表达式格式错误', trigger: 'blur' }
        ],
        accessType: [
          { required: true, message: '请选接入类型', trigger: 'blur' }
        ],
        outputType: [
          { required: true, message: '请选接出类型', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写任务描述', trigger: 'blur' }
        ],
        jarPath: [
          { required: true, message: '请上传任务jar包', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(job, jobform) {
      this.$refs[jobform].validate((valid) => {
        if (valid) {
          var _this = this;
          this.loading = true;
          postRequest('/vetl/job/save', job
          ).then(resp => {
            _this.loading = false;
            var res = resp.data;
            if (res.code == 200) {
              _this.$refs[jobform].resetFields();
              _this.$message({
                message: '添加任务成功！',
                type: 'success'
              });
              _this.$refs.uploadJar.clearFiles();
              _this.$refs.uploadSrc.clearFiles();
            } else {
              _this.$message({ type: 'error', message: res.message });
            }
          }
          );
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addJarFilePath(response) {
      if (response.code == 200) {
        this.ruleForm.jarPath = response.data;
      } else {
        this.$message({ type: 'error', message: response.message });
      }

    },
    addSrcFilePath(response) {
      if (response.code == 200) {
        this.ruleForm.srcPath = response.data;
      } else {
        this.$message({ type: 'error', message: response.message });
      }
    },
    addFileError(response) {
      _this.$message({ type: 'error', message: response.message });
    },
    queryCron(queryString, cb) {
      cb(this.usualCron)
    },
    getAccessType() {
      let req = { "curPage": 1, "pageSize": 999999, "object": { "accessType": 1 } }
      postRequest("/vetl/access_info/page/list", req).then(
        resp => {
          this.loading = false;
          let res = resp.data
          if (res.code == 200) {
            this.accessType = res.data.records;
          } else {
            this.$message({
              type: "error",
              message: res.message
            })
          }
        }
      )
    },
    getOutType() {
      let req = { "curPage": 1, "pageSize": 999999, "object": { "accessType": 2 } }
      postRequest("/vetl/access_info/page/list", req).then(
        resp => {
          this.loading = false;
          let res = resp.data
          if (res.code == 200) {
            this.outputType = res.data.records;
          } else {
            this.$message({
              type: "error",
              message: res.message
            })
          }
        }
      )
    }

  }

}
</script>
<style>
</style>
