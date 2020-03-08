<template>
  <!-- <el-container class=""> -->
  <!-- <span>&nbsp;</span> -->
  <div>
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="grid-content bg-purple">
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
        </div>
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      v-loading="loading"
    >
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div
            id="cpuInfo"
            style="width: 500px;height: 500px;"
          ></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div
            id="memInfo"
            style="width: 500px;height: 500px;"
          ></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div class="grid-content bg-purple">
            <div
              id="jvmInfo"
              style="width: 500px;height: 500px;"
            ></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>
  </div>
  <!-- </el-container> -->
</template>
<script>
import { postRequest } from '../utils/api'
import { getRequest } from '../utils/api'
import echarts from 'echarts'
export default {
  created: function () {
    this.getSysInfo()

  },
  mounted: function () {
    var t;
    clearTimeout(t)
    t = setTimeout(() => {
      this.loading = false
      this.drawCpuPie('cpuInfo')
      this.drawMemPie('memInfo')
      this.drawJvmPie('jvmInfo')
    }, 2200);
  },
  data() {
    return {
      loading: true,
      cpuCharts: '',
      cpuOpinion: ['系统使用', '用户使用', '等待使用', '空闲状态'],
      cpuOpinionData: [
      ],
      memCharts: '',
      memOpinion: ['剩余', '使用'],
      memOpinionData: [
      ],
      jvmCharts: '',
      jvmOpinion: ['使用', '空闲', '剩余内存'],
      jvmOpinionData: [
      ]
    }
  },
  methods: {
    drawCpuPie(id) {
      this.cpuCharts = echarts.init(document.getElementById(id))
      this.cpuCharts.setOption({
        title: {
          text: 'cpu状态',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: this.cpuOpinion
        },
        color: ['#CD5C5C', '#00CED1', '#9ACD32', '#FFC0CB'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'blod'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.cpuOpinionData
          }
        ]
      })
    },
    drawMemPie(id) {
      this.memCharts = echarts.init(document.getElementById(id))
      this.memCharts.setOption({
        title: {
          text: '内存状态',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: this.memOpinion
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'blod'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.memOpinionData
          }
        ]
      })
    },
    drawJvmPie(id) {
      this.jvmCharts = echarts.init(document.getElementById(id))
      this.jvmCharts.setOption({
        title: {
          text: 'jvm状态',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: this.jvmOpinion
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'blod'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.jvmOpinionData
          }
        ]
      })
    },
    getSysInfo() {
      this.loading = true
      getRequest('/vetl/sys/get_info', '').then(
        resp => {
          var cpuInfo = resp.data.cpu
          this.cpuOpinionData = [
            { value: cpuInfo.sys, name: '系统使用' },
            { value: cpuInfo.used, name: '用户使用' },
            { value: cpuInfo.wait, name: '等待使用' },
            { value: cpuInfo.free, name: '空闲状态' }
          ]
          var menInfo = resp.data.mem
          this.memOpinionData = [
            { value: menInfo.free, name: '剩余' },
            { value: menInfo.used, name: '使用' }
          ]
          var jvmInfo = resp.data.jvm
          this.jvmOpinionData = [
            { value: jvmInfo.free, name: '空闲' },
            { value: jvmInfo.total - jvmInfo.free, name: '使用' },
            { value: jvmInfo.max - jvmInfo.total, name: '剩余内存' }
          ]
          this.loading = false
        })
    }
  }

}
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #ffffff;
}
.bg-purple {
  background: #ffffff;
}
.bg-purple-light {
  background: #ffffff;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 20px 0;
  background-color: #ffffff;
}
</style>
