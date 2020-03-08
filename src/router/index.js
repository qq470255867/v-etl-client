import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import LogList from '@/components/LogList'
import PostJob from '@/components/PostJob'
import JobListTable from '@/components/JobListTable'
import AccessType from '@/components/AccessType'
import SysConf from '@/components/SysConf'
import SysMonitor from '@/components/SysMonitor'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      hidden: true,
      component: Login
    }, {
      path: '/home',
      name: '',
      component: Home,
      hidden: true
    },
    {
      path: '/home',
      component: Home,
      name: '任务查看',
      children: [
        {
          path: '/job/list',
          iconCls: 'fa fa-tasks',
          name: '任务查看',
          component: JobListTable
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '新增任务',
      children: [
        {
          path: '/post/job',
          iconCls: 'fa fa-file-text-o',
          name: '新增任务',
          component: PostJob,
          meta: {
            keepAlive: false
          }
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '执行详情',
      children: [
        {
          path: '/log/list',
          iconCls: 'fa fa-bar-chart',
          name: '执行详情',
          component: LogList
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '接入类型',
      iconCls: 'fa fa-random',
      children: [
        {
          path: '/access_type',
          iconCls: 'fa fa-random',
          name: '接入类型',
          component: AccessType
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '系统配置',
      iconCls: 'fa fa-gears',
      children: [
        {
          path: '/system_config',
          iconCls: 'fa fa-gears',
          name: '系统配置',
          component: SysConf
        }
      ]
    },
    {
      path: '/home',
      component: Home,
      name: '系统监控',
      iconCls: 'fafa-sitemap ',
      children: [
        {
          path: '/system_monitor',
          iconCls: 'fa fa-sitemap ',
          name: '系统监控',
          component: SysMonitor
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path == '/') return next();
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/')
  }
    next();

})
export default router
