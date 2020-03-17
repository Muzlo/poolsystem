import router from './router'
import store from './store'
import createRoutes from '@/utils/createRoutes'
import { getDocumentTitle, resetTokenAndClearUser } from './utils'
// 是否有菜单数据
let hasMenus = false
router.beforeEach(async (to, from, next) => {
    document.title = getDocumentTitle(to.meta.title)
    // if (localStorage.getItem('token')) {

            if (to.path === '/login') {
                next({ path: '/' })
            } else if (hasMenus) {
                next()
            } else {
                try {
                    // 这里可以用 await 配合请求后台数据来生成路由
                    // const data = await axios.get('xxx')
                    // const routes = createRoutes(data)
                    const arr= [
                        {
                            name: 'home', // 要跳转的路由名称 不是路径
                            text: '主页', // 文本内容
                            
                        },
                        
                        {
                            text: '流量池管理',
                            children: [
                                {
                                    name: 'flowPoolApply',
                                    text: '流量池申请',
                                },
                                {
                                    name: 'flowPoolList',
                                    text: '流量池列表',
                                },
                                {
                                    name: 'flowPoolCardImport',
                                    text: '流量池网卡导入',
                                },
                                {
                                    name: 'flowCardList',
                                    text: '流量池网卡列表',
                                },
                                {
                                    name: 'msg', // 要跳转的路由名称 不是路径
                                    text: '通知消息', // 文本内容
                                    hidden:true
                                },
                            ],
                        },  
                        {
                            text: '基础信息',
                            children:[
                                {
                                    name: 'apiUserList',
                                    text: '接口用户列表',
                                },
                                {
                                    name: 'simIspList',
                                    text: 'ISP列表',
                                },
                            ]
                        },   
                    ];
                    
                    arr.forEach((item)=>{
                        switch (item.text){
                            case "主页":
                                item.icon="el-icon-s-home"
                                break;
                            case "流量池管理":
                                item.icon="el-icon-coin"
                                break;
                            case "基础信息":
                                item.icon="el-icon-tickets"
                                break;
                        }
                    })



                    store.commit("setMenus",arr)
    
                    const routes = createRoutes(arr)
                    // const routes = createRoutes(store.state.menuItems)
                    // 动态添加路由
                    router.addRoutes(routes)
                    hasMenus = true
                    next({ path: to.path || '/' })
                } catch (error) {
                    resetTokenAndClearUser()
                    next(`/login?redirect=${to.path}`)
                }
            }
        

    // } else {
    //     hasMenus = false
    //     if (to.path === '/login') {
    //         next()
    //     } else {
    //         next(`/login?redirect=${to.path}`)
    //     }
    // }
})






router.afterEach(() => {
})