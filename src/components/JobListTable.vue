
<template>
  <div
    v-loading="loading"
    class="g-job"
  >
    <el-form
      :inline="true"
      style="margin: 40px auto 20px auto;"
    >
      <el-select
        clearable
        v-model="selectInputValue"
        placeholder="接入源"
      >
        <el-option
          v-for="item in selectInputInfo"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-select
        clearable
        v-model="selectOutputValue"
        placeholder="接出源"
      >
        <el-option
          v-for="item in selectOutputInfo"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <el-input
        clearable
        placeholder="任务名"
        class="input-with-select"
        style="width:200px;"
        v-model="searchContent"
      >
      </el-input>
      <el-button
        icon="el-icon-search"
        @click="loadJobList(1, 5)"
      ></el-button>
    </el-form>
    <!-- <div style="display: flex;justify-content: center">
      <el-input
        placeholder="任务名"
        class="input-with-select"
        style="width:450px;"
      >

        <el-select
          placeholder="数据源"
          slot="prepend"
        >

        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>
    </div> -->
    <div class="u-table">
      <el-table
        :data="jobList"
        style="margin: 20px auto 40px auto;"
        border
      >
        <el-table-column
          label="任务名称"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="接入源"
          width="180"
          align="center"
          :formatter="el_formatter"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
            >
              <p><b>名称：</b>{{ scope.row.accessInfo.name }}</p>
              <p><b>方式：</b>{{ scope.row.accessInfo.type }}</p>
              <p><b>连接：</b>{{ scope.row.accessInfo.ipPort }}</p>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <el-tag size="medium">{{ scope.row.accessInfo.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="接出源"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
            >
              <p><b>名称：</b>{{ scope.row.outputInfo.name }}</p>
              <p><b>方式：</b>{{ scope.row.outputInfo.type }}</p>
              <p><b>连接：</b>{{ scope.row.outputInfo.ipPort }}</p>
              <div
                slot="reference"
                class="name-wrapper"
              >
                <el-tag size="medium">{{ scope.row.outputInfo.name }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="cron"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.cron }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              style="display: block"
              v-model="scope.row.open"
              active-text="启用"
              active-color="#00FF00"
              inactive-text="禁用"
              @change="updateStatus(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="描述"
          width="280"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="editJob(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteJob(scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="success"
              :disabled="scope.row.srcPath == null || scope.row.srcPath == ''"
              @click="downloadSrcCode(scope.row.id)"
            >源码</el-button>
            <el-button
              size="mini"
              type="info"
              :disabled="!scope.row.executed"
              @click="checkDetail(scope.row.id)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="修改任务"
        :visible.sync="editVisible"
      >
        <el-form
          :inline="false"
          :model="editJobData"
          :rules="editRules"
          ref="editJobData"
        >
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item
                label="任务名称"
                label-width=120px
                prop="name"
              >
                <el-input
                  v-model="editJobData.name"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="cron表达式"
                label-width=120px
                prop="cron"
              >
                <el-input
                  v-model="editJobData.cron"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item
                label="JVM参数"
                label-width=120px
              >
                <el-input
                  v-model="editJobData.vmParam"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="入口参数"
                label-width=120px
              >
                <el-input
                  width="600px"
                  v-model="editJobData.parameter"
                  auto-complete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="任务描述"
            label-width=120px
            prop="description"
          >
            <el-input
              v-model="editJobData.description"
              auto-complete="off"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="18">
              <el-form-item
                label="JAR路径"
                label-width=120px
                style="text-align: start;"
                prop="jarPath"
              >
                <span style="text-align: start;  color: black;">
                  {{editJobData.jarPath}}
                </span>
              </el-form-item>
            </el-col>
            <el-upload
              class="upload-demo"
              action="/vetl/fileupload/upload/jar"
              :on-success="addJarPath"
              multiple
              :limit="1"
              ref="uploadJar"
            >
              <el-button>
                重新上传
              </el-button>
            </el-upload>

          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item
                label="源码路径"
                label-width=120px
                style="text-align: start; color: black;"
              >
                <span style="text-align: start;">
                  {{editJobData.srcPath}}
                </span>
              </el-form-item>
            </el-col>
            <el-upload
              class="upload-demo"
              action="/vetl/fileupload/upload/src"
              :on-success="addSrcPath"
              multiple
              :limit="1"
              ref="uploadSrc"
            >
              <el-button>
                重新上传
              </el-button>
            </el-upload>
          </el-row>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitEdit(editJobData)"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap">
      <el-pagination
        layout="prev, pager, next"
        :total=total
        background
        @current-change="pageChange"
        :page-size="pageSize"
        :current-page="currentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getRequest } from '../utils/api'
import { putRequest } from '../utils/api'
import { deleteRequest } from '../utils/api'
import { postRequest } from '../utils/api'
export default {
  mounted: function () {
    this.loading = true;
    this.loadJobList(1, 5);
    this.cardloading = Array.apply(null, Array(20)).map(function (item, i) {
      return false;
    });
    this.eploading = Array.apply(null, Array(20)).map(function (item, i) {
      return false;
    });
    this.getSelectInfo(1);
    console.log(this.selectInputInfo)
    this.getSelectInfo(2);
    console.log(this.selectOutputInfo)
  },
  methods: {
    loadJobList(currentPage, size) {
      var _this = this;
      let model = { "pageSize": size, "curPage": currentPage, "object": {}, "param": { "content": _this.searchContent, "input": _this.selectInputValue, "output": _this.selectOutputValue } }
      postRequest("/vetl/job/getAll", model).then(
        resp => {
          var res = resp.data;
          _this.loading = false;
          if (res.code == 200) {
            _this.total = res.data.total
            _this.jobList = res.data.object;
          } else if (res.code == 401) {
            _this.$message({ type: 'error', message: res.message });
            _this.$router.replace({ path: '/' });
          } else if (res.code == 500) {
            _this.$message({ type: 'error', message: res.message });
          }
        }
      );
    },
    pageChange(page) {
      this.currentPage = page;
      this.loadJobList(page, 5)
    },
    updateStatus(job) {
      var _this = this;
      this.loading = true;
      postRequest('/vetl/job/update', job
      ).then(resp => {
        _this.loading = false;
        var res = resp.data;
        if (res.code == 200) {
          _this.loadJobList(this.currentPage, 5)
          if (job.open) {
            _this.$notify(
              {
                title: '启用',
                message: '开启' + job.name,
                type: 'success'
              }
            );
          } else {
            _this.$notify(
              {
                title: '禁用',
                message: '停止' + job.name,
                type: 'warning'
              }
            );
          }
        } else {
          _this.$message({ type: 'error', message: res.message });
        }
      }
      );
    },
    downloadSrcCode(id) {
      this.loading = true;
      let a = document.createElement('a')
      a.href = "/vetl/fileupload/download_src_code/" + id
      a.click();
      this.loading = false;
    },
    checkDetail(id) {
      this.$router.push({ path: '/log/list', query: { jobId: id } });
    },
    deleteJob(id) {
      var _this = this;
      _this.$confirm('确定删除这个任务吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        _this.loading = true
        getRequest('/vetl/job/delete/', id
        ).then(resp => {
          var res = resp.data;
          if (res.code == 200) {
            _this.loading = false;
            _this.loadJobList(_this.currentPage, 5)
          } else {
            _this.$message({ type: 'error', message: res.message });
          }
        }
        )
      }
      )
    },
    editJob(job) {
      console.log(job)
      this.editJobData = job;
      this.editVisible = true;
    },
    addJarPath(response) {
      if (response.code == 200) {
        this.editJobData.jarPath = response.data;
      } else {
        this.$message({ type: 'error', message: response.message });
        this.$refs.uploadJar.clearFiles();
      }

    },
    el_formatter(row, column, cellValue) {
      console.log(row, column, cellValue)
    },
    addSrcPath(response) {
      if (response.code == 200) {
        this.editJobData.srcPath = response.data;
      } else {
        this.$message({ type: 'error', message: response.message });
        this.$refs.uploadSrc.clearFiles();
      }
    },
    submitEdit(val) {
      this.$refs.editJobData.validate((valid) => {
        if (valid) {
          this.loading = true;
          // this.updateStatus(val);
          this.loading = true;
          postRequest('/vetl/job/update', val
          ).then(resp => {
            this.loading = false;
            var res = resp.data;
            if (res.code == 200) {
              this.loadJobList(this.currentPage, 5)
              this.$message({ type: 'success', message: '保存成功' });
            } else {
              this.$message({ type: 'error', message: res.message });
            }
          }
          );
          this.loading = false;
          this.editVisible = false;
        }
      })
    },
    getSelectInfo(type) {
      var req = { curPage: 1, pageSize: 99999, object: { accessType: type } }
      postRequest('vetl/access_info/page/list', req).then(resp => {
        if (type == 1) {
          this.selectInputInfo = resp.data.data.records

        } else {
          this.selectOutputInfo = resp.data.data.records
        }
      })
    },
    postSearch() {
      var req = { input: this.selectInputValue, output: this.selectOutputValue, searchContent: this.searchContent }
      console.log(req)
    }
  },
  filters: {
    accessFilter: function (item) {
      if (item.accessType == 1) {
        return item.name
      }
    },
    outputFilter: function (item) {
      if (item.accessType == 2) {
        return item.name
      }
    }
  },
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageSize: 5,
      editVisible: false,
      loading: false,
      eploading: [],
      cardloading: [],
      keywords: '',
      allRoles: [],
      roles: [],
      cpRoles: [],
      jobList: [],
      editJobData: {
        id: '',
        name: '',
        jobGroup: '',
        cron: '',
        parameter: '',
        description: '',
        vmParam: '',
        jarPath: '',
        status: '',
        srcPath: ''
      },
      selectInputInfo: [],
      selectOutputInfo: [],
      selectInputValue: '',
      selectOutputValue: '',
      searchContent: '',
      editRules: {
        name: [
          { required: true, message: '请输入任务名称名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        cron: [
          { required: true, message: '请输入cron表达式', trigger: 'blur' },
          { min: 3, max: 80, message: '表达式格式错误', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写任务描述', trigger: 'blur' }
        ],
        jarPath: [
          { required: true, message: '请上传任务jar包', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>
<style >
.el-select .el-input {
  width: 150px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
  margin: 0px;
}
.g-job {
  height: calc(100% - 50px);
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.u-table {
  height: calc(100% - 40px);
  width: 100%;
}
</style>
