<template>
  <el-container class="home_container">
    <el-header>
      <div class="home_title">{{platName}}</div>
      <div class="home_userinfoContainer">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link home_userinfo">
            管理员<i class="el-icon-arrow-down el-icon--right home_userinfo"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              command="downloadCode"
              divided
            >下载模板</el-dropdown-item>
            <el-dropdown-item
              command="logout"
              divided
            >退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          style="background-color: #ECECEC"
          router
        >
          <template
            v-for="(item,index) in this.$router.options.routes"
            v-if="!item.hidden"
          >
            <el-submenu
              :index="index+''"
              v-if="item.children.length>1"
              :key="index"
            >
              <template slot="title">
                <i :class="item.iconCls"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                v-if="!child.hidden"
                :index="child.path"
                :key="child.path"
              >
                {{child.name}}
              </el-menu-item>
            </el-submenu>
            <template v-else>
              <el-menu-item :index="item.children[0].path">
                <i :class="item.children[0].iconCls"></i>
                <span slot="title">{{item.children[0].name}}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
          </el-breadcrumb>
          <keep-alive>
            <router-view v-if="this.$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!this.$route.meta.keepAlive"></router-view>
        </el-main>
        
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import { getRequest } from '../utils/api'
export default {
  methods: {
    handleCommand(command) {
      var _this = this;
      if (command == 'logout') {
        this.$confirm('注销登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          window.sessionStorage.clear();
          _this.currentUserName = '管理员';
          _this.$router.replace({ path: '/' });
        }, function () {
          //取消
        })
      }
      if (command == 'downloadCode') {
        this.loading = true;
        let a = document.createElement('a')
        a.href = "/vetl/fileupload/download_demo_code/"
        a.click();
        this.loading = false;
      }
    },
    getPlateName() {
      this.loading = true
      getRequest("/vetl/sys/get_conf/", '').then(
        resp => {
          this.loading = false;
          this.platName = resp.data.data.platName;
        })
    }
  },
  mounted: function () {
    this.getPlateName()
  },
  data() {
    return {
      currentUserName: '',
      platName: ''
    }
  }
}
</script>
<style>
.home_container {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}

.el-header {
  background-color: #20a0ff;
  color: #333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
}

.el-aside {
  background-color: #ececec;
}

.el-main {
  background-color: #fff;
  color: #000;
  text-align: center;
}

.home_title {
  color: #fff;
  font-size: 22px;
  display: inline;
}

.home_userinfo {
  color: #fff;
  cursor: pointer;
}
.download_code {
  display: inline;
  margin-right: 40px;
}

.home_userinfoContainer {
  display: inline;
  margin-right: 20px;
}
</style>
