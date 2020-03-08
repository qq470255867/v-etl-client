<template>
  <div
    v-loading="loading"
    class="g-job"
  >
    <!-- <el-header class="cate_mana_header">
    </el-header> -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      :inline="true"
      style="margin: 50px auto 20px auto;"
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model="ruleForm.name"
          placeholder="名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="方式"
        prop="type"
      >
        <el-autocomplete
          v-model="ruleForm.type"
          placeholder="方式"
          :fetch-suggestions="suggestions"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item
        label="连接信息"
        prop="ipPort"
      >
        <el-input
          v-model="ruleForm.ipPort"
          placeholder="ip端口"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="类型"
        prop="accessType"
      >
        <el-select
          v-model="ruleForm.accessType"
          placeholder="类型"
        >
          <el-option
            label="接入"
            value="1"
          ></el-option>
          <el-option
            label="接出"
            value="2"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit('ruleForm',ruleForm)"
          icon="el-icon-circle-plus"
        >新增</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-header class="cate_mana_center"> -->
    </el-header>
    <!-- !! -->
    <el-table
      :data="typeList"
      style=" margin: 10px auto; width: 90%"
    >
      <el-table-column
        prop="name"
        label="名称"
        width="280"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        label="方式"
        width="280"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="ipPort"
        label="连接信息"
        width="380"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="accessType"
        label="类型"
        width="280"
        align="center"
        :formatter="el_formatter"
      >

      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="primary"
            @click="update(scope.row.id)"
          >修改</el-button> -->
          <el-button
            size="mini"
            type="danger"
            @click="deleteType(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap ">
      <el-pagination
        layout="prev, pager, next"
        :total="totalNum"
        background
        @current-change="pageChange"
        :page-size="pageSize"
        :current-page="currentPage"
      >
      </el-pagination>
    </div>

    <!-- dialog -->
    <el-dialog
      title="修改接入类型"
      :visible.sync="editVisible"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class=""
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="ruleForm.name"
            placeholder="名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="方式"
          prop="type"
        >
          <el-autocomplete
            v-model="ruleForm.type"
            placeholder="方式"
            :fetch-suggestions="suggestions"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item
          label="连接信息"
          prop="ipPort"
        >
          <el-input
            v-model="ruleForm.ipPort"
            placeholder="ip端口"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="accessType"
        >
          <el-select
            v-model="ruleForm.accessType"
            placeholder="类型"
          >
            <el-option
              label="接入"
              value="1"
            ></el-option>
            <el-option
              label="接出"
              value="2"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit('ruleForm',ruleForm)"
          >确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<script>
import { postRequest } from '../utils/api'
import { getRequest } from '../utils/api'
export default {
  data() {
    return {
      loading: false,
      typeList: [],
      ruleForm: {
        name: '',
        type: '',
        ipPort: '',
        accessType: ''
      },
      pageSize: 5,
      totalNum: 0,
      currentPage: 1,
      editVisible: false,
      rules: {
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择方式', trigger: 'change' }
        ],
        ipPort: [
          { required: true, message: '请填写连接信息', trigger: 'change' }
        ],
        accessType: [
          { required: true, message: '请选择接入还是接出', trigger: 'change' }
        ]
      },
      sugtype: [
        { "value": "mysql", "content": "mysql" },
        { "value": "oracle", "content": "oracle" },
        { "value": "kafka", "content": "kafka" },
        { "value": "webService", "content": "webService" },
        { "value": "ftp", "content": "ftp" },
        { "value": "sftp", "content": "sftp" }

      ]

    }
  },
  mounted: function () {
    this.getPageList(1, 5);

  },
  methods: {
    update(id) {
      this.editVisible = true;
    },
    onSubmit(formName, form) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          postRequest('/vetl/access_info/save', form).then(
            resp => {
              this.loading = false
              let res = resp.data
              if (res.code == 200) {
                this.$message({
                  message: '添加类型成功！',
                  type: 'success'
                });
                this.getPageList(this.currentPage, this.pageSize);
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
              this.$refs[formName].resetFields();
            }
          )
        }

      });
    },
    pageChange(page) {
      this.currentPage = page
      this.getPageList(page, 5);
    },
    suggestions(queryString, cb) {
      cb(this.sugtype)
    },
    getPageList(page, pageSize) {
      this.loading = true
      let req = { "curPage": page, "pageSize": pageSize }
      postRequest("/vetl/access_info/page/list", req).then(
        resp => {
          this.loading = false;
          let res = resp.data
          if (res.code == 200) {
            this.totalNum = res.data.total;
            this.typeList = res.data.records;
          } else {
            this.$message({
              type: "error",
              message: res.message
            })
          }
        }
      )
    },
    el_formatter(row, column, cellValue) {
      console.log(row, column, cellValue)
      return cellValue === 1 ? '接入' : '接出'
    },
    deleteType(id) {
      var _this = this;
      _this.$confirm('确定删除这项吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        _this.loading = true
        getRequest('/vetl/access_info/delete/', id
        ).then(resp => {
          _this.loading = false;
          var res = resp.data;
          if (res.code == 200) {
            _this.getPageList(_this.currentPage, _this.pageSize);
            _this.$message({
              message: '删除类型成功！',
              type: 'success'
            });
          } else {
            _this.$message({ type: 'error', message: res.message });
          }
        }
        )
      }
      )

    }
  }
}
</script>
<style>
.cate_mana_header {
  background-color: #ffffff;
  margin-top: 10px;
  padding-left: 5px;
  display: flex;
  justify-content: flex-start;
}
.cate_mana_center {
  background-color: #ffffff;
  margin-top: 5px;
  padding-left: 5px;
  display: flex;
  justify-content: flex-start;
}
.g-job {
  height: calc(100% - 50px);
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
