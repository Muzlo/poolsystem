import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const commonRoutes = [
    {
        path: '/login',
        name: 'login',
        meta: { title: '登录' },
        component: () => import('../components/Login.vue'),
    },
    {
        path: '/404',
        name: '404',
        meta: { title: '404' },
        component: () => import('../components/404.vue'),
    },
    { path: '/', redirect: '/home' },
]

// 本地所有的页面 需要配合后台返回的数据生成页面
export const asyncRoutes = {
    home: {
        path: 'home',
        name: 'home',
        meta: { title: '主页' },
        component: () => import('../views/Home.vue'),
    },
    /////////////////通知消息
    msg: {
        path: 'msg',
        name: 'msg',
        meta: { title: '通知消息' },
        component: () => import('../views/Msg.vue'),
    },

    ///////////////流量池管理
    flowPoolList: {
        path: 'flowPoolList',
        name: 'flowPoolList',
        meta: { title: '流量池列表' },
        component: () => import('../views/flowPool/flowPoolList.vue'),
    },
    flowPoolApply: {
        path: 'flowPoolApply',
        name: 'flowPoolApply',
        meta: { title: '流量池申请' },
        component: () => import('../views/flowPool/flowPoolApply.vue'),
    },
    flowPoolCardImport: {
        path: 'flowPoolCardImport',
        name: 'flowPoolCardImport',
        meta: { title: '流量池网卡导入' },
        component: () => import('../views/flowPool/flowPoolCardImport.vue'),
    },
    flowCardList: {
        path: 'flowCardList',
        name: 'flowCardList',
        meta: { title: '流量池网卡列表' },
        component: () => import('../views/flowPool/flowCardList.vue'),
    },
    ///////////基础信息
    apiUserList:{
        path: 'apiUserList',
        name: 'apiUserList',
        meta: { title: '接口用户列表' },
        component: () => import('../views/baseInfo/apiUserList.vue'),
    },
    simIspList:{
        path: 'simIspList',
        name: 'simIspList',
        meta: { title: 'ISP列表' },
        component: () => import('../views/baseInfo/simIspList.vue'),
    },
    simClassList:{
        path: 'simClassList',
        name: 'simClassList',
        meta: { title: 'SIM列表' },
        component: () => import('../views/baseInfo/simClassList.vue'),
    },


}

const createRouter = () => new Router({
    routes: commonRoutes,
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router