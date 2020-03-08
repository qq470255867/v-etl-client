<template>
  <el-container v-loading="loading">
    <!-- <el-header class="cate_mana_header">
    </el-header> -->
    <el-main class="">
      <el-table
        ref="multipleTable"
        :data="jobLogs"
        tooltip-effect="dark"
        style="width: 100%;margin: 70px auto 0px auto"
        height="550"
      >
        <el-table-column
          label="任务名称"
          prop="jobName"
          width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="lastDate"
          label="上次运行"
          width="240"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="avgCost"
          label="平均时长/ms"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="runNum"
          label="运行次数"
          width="180"
          align="center"
        >
        </el-table-column>
        </el-table-column>
        <el-table-column
          prop="dataVolume"
          label="接入总量"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="状态"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <div v-html="scope.row.status"></div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="360"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showJobLog(scope)"
              type="info"
              icon=" el-icon-tickets"
              plain
            >日志
            </el-button>
            <el-button
              size="mini"
              @click="showJobCostTime(scope)"
              type="info"
              icon=" el-icon-time"
              plain
            >时长
            </el-button>
            <el-button
              size="mini"
              @click="showDataVolume(scope)"
              type="info"
              icon="el-icon-menu"
              :disabled="scope.row.dataVolume == 'N/A'"
              plain
            >数据
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: space-around;flex-wrap: wrap">
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
      <el-dialog :visible.sync="dialogFormVisible">
        <el-table
          :data="logs"
          :header-cell-style="tableHeaderColor"
          height="500"
        >
          <el-table-column
            property="jobDate"
            label="时间"
            min-width="30%"
            align="center"
          ></el-table-column>
          <el-table-column
            label="内容"
            min-width="70%"
            align="left"
          >
            <template slot-scope="scope">
              <div
                v-html="scope.row.log"
                style="padding-left: 80px;"
              ></div>
            </template>
          </el-table-column>
        </el-table>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="">清空</el-button>
          <el-button
            type="primary"
            @click="refreshLog(logs[0].jobId)"
          >刷新</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="volumedialogFormVisible">
        <div
          id="dataChart"
          style="width: 900px;height: 400px;"
        ></div>
      </el-dialog>
      <el-dialog :visible.sync="timedialogFormVisible">
        <div
          id="timeChart"
          style="width: 900px;height: 400px;"
        ></div>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import { postRequest } from '../utils/api'
import { putRequest } from '../utils/api'
import { deleteRequest } from '../utils/api'
import { getRequest } from '../utils/api'
import echarts from 'echarts'
export default {
  methods: {
    pageChange(page) {
      this.currentPage = page
      this.getJobDetail(page, 5);
    },
    getJobDetail(page, pageSize) {
      if (!page) {
        page = this.currentPage
      }
      if (!pageSize) {
        pageSize = 5
      }
      this.loading = true;
      let model = { "pageSize": pageSize, "curPage": page, "param": {} }
      postRequest("/vetl/record/statistics/list", model).then(
        resp => {
          this.loading = false;
          this.jobLogs = resp.data.object;
          this.totalNum = resp.data.total;
        })
    },
    getJobDetailById(jobId) {
      if (!jobId) {
        jobId = this.staticJobId
      }
      this.loading = true;
      let model = { "pageSize": 1, "curPage": 1, "param": { "jobId": jobId } }
      postRequest("/vetl/record/statistics/list", model).then(
        resp => {
          this.loading = false;
          this.jobLogs = resp.data.object;
          this.totalNum = resp.data.total;
        })
    },
    getJobLogs() {
      console.log(this.jobId)
    },
    refreshLog(jobId) {
      this.loading = true
      getRequest("/vetl/record/log/", jobId).then(
        resp => {
          this.loading = false;
          this.logs = resp.data;
        })
      this.getJobDetail(this.currentPage, 5)
    },
    showJobLog(scope) {
      this.dialogFormVisible = true;
      console.log(job)
      var job = scope.row
      this.loading = true
      getRequest("/vetl/record/log/", job.jobId).then(
        resp => {
          this.loading = false;
          this.logs = resp.data;
        })
    },
    showDataVolume(scope) {
      this.volumedialogFormVisible = true;
      var job = scope.row
      this.DataOption.legend.data = [job.jobName]
      this.loading = true
      getRequest("/vetl/record/volume/", job.jobId).then(
        resp => {
          this.loading = false;
          this.dataVolume = resp.data;
          this.DataOption.xAxis.data = resp.data.dateList
          this.DataOption.series = [{ name: '接入数据', data: resp.data.volumeList, type: 'line' }]
        })
      var t;
      clearTimeout(t)
      t = setTimeout(() => {
        let dataChart = echarts.init(document.getElementById('dataChart'))
        dataChart.setOption(this.DataOption)
      }, 500);
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      return 'text-align:center'

    },
    getSysConfInterval() {
      this.loading = true
      var result;
      getRequest("/vetl/sys/get_conf/", '').then(
        resp => {
          this.loading = false;
          result = resp.data.data.logInterval * 1000;
          console.log('result' + result);
          this.interval = result
          return result;
        })
    },
    showJobCostTime(val) {
      this.loading = true
      var jobId = val.row.jobId;
      getRequest("/vetl/record/cost_time/", jobId).then(
        resp => {
          this.timedialogFormVisible = true
          this.loading = false;
          var res =  resp.data;
          if(res.code == 200) {
          this.timeOption.xAxis.data = res.data.dateList
          this.timeOption.series = [{ name: '运行时长', data: res.data.timeList, type: 'line' }]
          }
        })
      var t;
      clearTimeout(t)
      t = setTimeout(() => {
        let timeChart = echarts.init(document.getElementById('timeChart'))
        timeChart.setOption(this.timeOption)
      }, 500);
    }

  },
  // filters: {
  //   numfilter: function (val) {
  //     console.lo
  //     if (typeof (val) === 'number') {
  //       return (val).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  //     }
  //   }
  // },
  mounted: function () {
    let id = this.$route.query.jobId
    clearInterval(this.timer)
    if (id) {
      this.getJobDetailById(id)
      this.staticJobId = id;
      console.log('interval' + this.interval)
      this.timer = setInterval(this.getJobDetailById, this.interval);
    } else {
      this.getJobDetail(1, 5);
      console.log('interval' + this.interval)
      this.timer = setInterval(this.getJobDetail, this.interval)
    }
  },
  data() {
    return {
      timer: {},
      interval: 10000,
      loading: false,
      dialogFormVisible: false,
      volumedialogFormVisible: false,
      timedialogFormVisible: false,
      jobLogs: [],
      logs: [],
      jobId: '',
      pageSize: 5,
      totalNum: 0,
      currentPage: 1,
      staticJobId: 0,
      dataVolume: [],
      DataOption: {
        legend: { data: [] },
        xAxis: {
          type: 'category',   // 还有其他的type，可以去官网喵两眼哦
          data: [],   // x轴数据
          name: '日期',   // x轴名称
          // x轴名称样式
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18
          }
        },
        yAxis: {
          type: 'value',
          name: '接入量',   // y轴名称
          // y轴名称样式
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18
          }
        },
        label: {},
        tooltip: {
          trigger: 'axis'   // axis   item   none三个值
        },
        series: [
          {
            name: '',
            data: [],
            type: 'line'
          }
        ]
      },
      timeOption: {
        legend: { data: [] },
        xAxis: {
          type: 'category',   // 还有其他的type，可以去官网喵两眼哦
          data: [],   // x轴数据
          name: '时间',   // x轴名称
          // x轴名称样式
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18
          }
        },
        yAxis: {
          type: 'value',
          name: '时长/ms',   // y轴名称
          // y轴名称样式
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18
          }
        },
        label: {},
        tooltip: {
          trigger: 'axis'   // axis   item   none三个值
        },
        series: [
          {
            name: '',
            data: [],
            type: 'line'
          }
        ]
      }
    }

  }
}
</script>
<style>
.cate_mana_header {
  background-color: #ffffff;
  margin-top: 2px;
  padding-left: 2px;
  display: flex;
  justify-content: flex-start;
}

.cate_mana_main {
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  padding-left: 5px;
  background-color: #ececec;
  margin-top: 20px;
  padding-top: 10px;
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
