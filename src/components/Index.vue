<template>
    <div class="index-vue">
        <!-- 侧边栏 -->
        <aside :class="asideClassName" class="hidden">
            <!-- logo -->
            <div class="logo-c">
                <img src="../assets/imgs/logo.png" alt="logo" class="logo">
                <span v-show="isShowAsideTitle">后台管理系统</span>
            </div>
            
            
            <!-- 菜单栏 -->
            <el-menu ref="asideMenu" background-color="#545c64" text-color="#fff" active-text-color="#fff" 
            router unique-opened>

                    <!-- 只有一级 -->
                <el-menu-item :index="item.name" v-if="!item.children"  v-for="item in menuItems" :key="item.name">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.text}}</span>
                </el-menu-item>
    
                <el-submenu :index="item.text" v-if="item.children"  v-for="item in menuItems" :key="item.text">
                    <template slot="title">
                        <i :class="item.icon"></i>
                        <span>{{item.text}}</span>
                    </template>

                    <div v-for="child in item.children" :key="child.text">
                        <div v-if="!child.children && !child.hidden">
                            <el-menu-item :index="child.name">
                                {{child.text}}
                            </el-menu-item>
                        </div>
                        <div v-if="child.children">
                            <el-submenu :index="child.text">
                                <template slot="title">{{child.text}}</template>
                                <el-menu-item :index="threeMenu.name" v-for="threeMenu in child.children" :key="threeMenu.text">{{threeMenu.text}}</el-menu-item>
                            </el-submenu>
                        </div>
                    </div>
                </el-submenu>
            </el-menu>

        </aside>

        <!-- 右侧部分 -->
        <section class="sec-right">
            <!-- 头部 -->
            <div class="top-c">
                <header>
                    <div class="h-left">
                        <div class="pointer">
                            <i class="el-icon-s-grid"></i>
                        </div>
                        <!-- 面包屑功能 -->
                        <p class="crumbs">{{crumbs}}</p>
                    </div>
                    <div class="h-right hidden">
                        <!-- 消息 -->
                        <div class="notice-c" @click="info" title="查看新消息">
                            <div :class="{newMsg: hasNewMsg}"></div>
                            <i class="el-icon-bell"></i>
                        </div>
                        <!-- 用户头像 -->
                        <div class="user-img-c">
                            <i class="el-icon-user-solid userIcon"></i>
                        </div>


                        <!-- 下拉菜单 -->
                        <el-dropdown trigger="click" @command="userOperate" @visible-change="showArrow">
                            <div class="pointer">
                                <span>{{userName}}</span>
                                <i v-show="arrowDown" class="el-icon-caret-bottom"></i>
                                <i v-show="arrowUp" class="el-icon-caret-top"></i>
                            </div>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="1">修改密码</el-dropdown-item>
                                <el-dropdown-item command="2">基本资料</el-dropdown-item>
                                <el-dropdown-item command="3">退出登陆</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>


                    </div>
                </header>

                <!-- 标签栏 -->
                <div class="div-tags">
                    <ul class="ul-c">
                        <li v-for="(item, index) in tagsArry" :key="index" :class="{active: isActive(item.name)}" @click="activeTag(index)">
                            <a class="li-a">
                                {{item.text}}
                            </a>
                            <i class="el-icon-close" @click="closeTag(index)"></i>
                        </li>
                    </ul>
                    <!-- 标签栏相关功能 -->
                    <div class="div-icons">
                        <div class="refresh-c" @click="reloadPage" title="刷新当前标签页">
                            <i class="el-icon-refresh-right"></i>
                        </div>
                        <div class="tag-options" title="关闭标签">

                            <el-dropdown trigger="click" @command="closeTags">
                                <i class="el-icon-s-operation"></i>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="1">关闭其他标签</el-dropdown-item>
                                    <el-dropdown-item command="2">关闭所有标签</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>


                        </div>
                    </div>
                </div>
            </div>
            <!-- 页面主体 -->
            <div class="main-content">
                <div class="view-c">
                    <el-card class="box-card">
                    <keep-alive :include="keepAliveData">
                        <!-- 子页面 -->
                        <router-view v-if="isShowRouter" />
                    </keep-alive>
                    </el-card>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { resetTokenAndClearUser } from '../utils'
export default {
    name: 'index',
    data() {
        return {
            // 用于储存页面路径
            paths: {},
            // 当前显示页面
            currentPage: '',
            openMenus: [], // 要打开的菜单名字 name属性
            menuCache: [], // 缓存已经打开的菜单
            hasNewMsg: true, // 是否有新消息
            isShowRouter: true,
            msgNum: '10', // 新消息条数
            // 标签栏         标签标题     路由名称
            // 数据格式 {text: '首页', name: 'home'}
            // 用于缓存打开的路由 在标签栏上展示
            tagsArry: [],
            arrowUp: false, // 用户详情向上箭头
            arrowDown: true, // 用户详情向下箭头
            isShowAsideTitle: true, // 是否展示侧边栏内容
            main: null, // 页面主要内容区域
            asideClassName: 'aside-big', // 控制侧边栏宽度变化
            asideArrowIcons: [], // 缓存侧边栏箭头图标 收缩时用
            // 面包屑
            crumbs: '主页',
            userName: null,
            // 主页路由名称
            home: 'home',
            dialogArr : []
        }
    },
    created() {
        // let userLoginInfo=JSON.parse(localStorage.getItem("userLoginInfo"));
        // this.userName=JSON.parse(localStorage.getItem("userName"));
        
    },
    mounted() {
        // 第一个标签
        const name = this.$route.name
        this.currentPage = name
        this.tagsArry.push({
            text: this.nameToTitle[name],
            name,
        })

        // 根据路由打开对应的菜单栏
        this.openMenus = this.getMenus(name)

        // 设置用户信息

        this.main = document.querySelector('.sec-right')

    },
    watch: {
        $route(to) {
            const name = to.name
            this.currentPage = name
            if (name == 'error') {
                this.crumbs = '404'
                return
            }

            if (!this.keepAliveData.includes(name)) {
                // 如果标签超过8个 则将第一个标签删除
                if (this.tagsArry.length == 8) {
                    this.tagsArry.shift()
                }
                this.tagsArry.push({ name, text: this.nameToTitle[name] })
            }

            setTimeout(() => {
                this.crumbs = this.paths[name]
            }, 0)
        },
    },
    computed: {
        // 菜单栏
        menuItems() {
            return this.$store.state.menuItems
        },
        // 需要缓存的路由
        keepAliveData() {
            return this.tagsArry.map(item => item.name)
        },
        // 由于iView的导航菜单比较坑 只能设定一个name参数
        // 所以需要在这定义组件名称和标签栏标题的映射表 有多少个页面就有多少个映射条数
        nameToTitle() {
            const obj = {}
            this.menuItems.forEach(e => {
                this.processNameToTitle(obj, e)
            })

            return obj
        },
    },
    methods: {
        getMenus(name) {
            let menus
            const tagTitle = this.nameToTitle[name]
            for (let i = 0, l = this.menuItems.length; i < l; i++) {
                const item = this.menuItems[i]
                menus = []
                menus[0] = i
                if (item.text == tagTitle) {
                    return menus
                }

                if (item.children) {
                    for (let j = 0, ll = item.children.length; j < ll; j++) {
                        const child = item.children[j]
                        menus[1] = i + '-' + j
                        menus.length = 2
                        if (child.text == tagTitle) {
                            return menus
                        }

                        if (child.children) {
                            for (let k = 0, lll = child.children.length; k < lll; k++) {
                                const grandson = child.children[k]
                                menus[2] = i + '-' + j + '-' + k
                                if (grandson.text == tagTitle) {
                                    return menus
                                }
                            }
                        }
                    }
                }
            }
        },

        // 判断当前标签页是否激活状态
        isActive(name) {
            return this.$route.name === name
        },
        // 跳转页面 路由名称和参数
        gotoPage(name, params) {
            this.currentPage = name
            this.crumbs = this.paths[name]
            this.$router.replace({ name, params } ,onComplete => { }, onAbort => { })

            if (!this.keepAliveData.includes(name)) {
                // 如果标签超过8个 则将第一个标签删除
                if (this.tagsArry.length == 8) {
                    this.tagsArry.shift()
                }
                this.tagsArry.push({ name, text: this.nameToTitle[name] })
            }
        },
        // 用户操作
        userOperate(name) {
            switch (name) {
                case '1':
                    // 修改密码
                    this.gotoPage('password')
                    break
                case '2':
                    // 基本资料
                    this.gotoPage('userinfo')
                    break
                case '3':
                    resetTokenAndClearUser()
                    this.$router.replace({ name: 'login' })
                    break
            }
        },
        // 控制用户三角箭头显示状态
        showArrow(flag) {
            this.arrowUp = flag
            this.arrowDown = !flag
        },
        // 刷新当前标签页
        reloadPage() {
            let name = this.$route.name
            let index = this.keepAliveData.indexOf(name)
            this.$nextTick(() => {
                if (this.tagsArry.length) {
                    this.isShowRouter = false
                    this.tagsArry.splice(index, 1)
                    this.$nextTick(() => {
                        this.tagsArry.splice(index, 0, { name, text: this.nameToTitle[name] })
                        this.gotoPage(name)
                        this.isShowRouter = true
                    })
                } else {
                    this.isShowRouter = false
                    this.$nextTick(() => {
                        this.tagsArry.push({ name, text: this.nameToTitle[name] })
                        this.gotoPage(name)
                        this.isShowRouter = true
                    })
                }
            })
        },
        // 关闭单个标签
        closeTag(i) {
            let name = this.tagsArry[i].name
            this.tagsArry.splice(i, 1)
            window.event.stopPropagation()
            // 如果关闭的是当前标签 则激活前一个标签
            // 如果关闭的是第一个标签 则激活后一个标签
            if (this.tagsArry.length) {
                if (this.isActive(name)) {
                    if (i != 0) {
                        this.gotoPage(this.tagsArry[i - 1].name)
                    } else {
                        this.gotoPage(this.tagsArry[i].name)
                    }
                }
            } else if (name != this.home) {
                // 如果没有标签则跳往首页
                this.gotoPage(this.home)
            }else {
                this.reloadPage()
            }
        },
        // 根据路由名称关闭页面
        closeName(name) {
            for (let i = 0, len = this.tagsArry.length; i < len; i++) {
                if (this.tagsArry[i].name == name) {
                    this.closeTag(i)
                    break
                }
            }
        },
        // 批量关闭标签
        closeTags(flag) {
            if (flag == 1) {
                // 关闭其他标签
                this.tagsArry = []
                this.gotoPage(this.$route.name)
            } else {
                // 关闭所有标签
                this.tagsArry = []
                this.gotoPage(this.home)
                this.reloadPage()
            }
        },
        // 激活标签
        activeTag(i) {
            this.gotoPage(this.tagsArry[i].name)
        },
        // 消息通知
        info() {
            const self = this;
            let notify=this.$notify({
                title: '您有新消息',
                type: 'warning',
                dangerouslyUseHTMLString:true,
                message: '<p style="height:10px;"></p><span style="cursor:pointer;padding:4px 8px;margin-top:10px;background:#409EFF;color:#fff;border-radius:2px;">点击查看</span>',
                onClick(){
                    self.gotoPage("msg");
                    notify.close()
                },
            });

            
            

        },
        // 菜单栏改变事件
        menuChange(data) {
            this.menuCache = data
        },
        processNameToTitle(obj, data, text) {
            if (data.name) {
                obj[data.name] = data.text
                this.paths[data.name] = text ? `${text} / ${data.text}` : data.text
            }
            if (data.children) {
                data.children.forEach(e => {
                    this.processNameToTitle(obj, e, text ? `${text} / ${data.text}` : data.text)
                })
            }
        },
    },
}
</script>

<style scoped>
.index-vue {
    height: 100%;
    color: #666;
}
.el-menu{
    border:0;
}
/* 侧边栏 */
aside {
    position: fixed;
    top: 0;
    left: 0;
    width: 90px;
    background: #20222A;
    height: 100%;
    transition: width .3s;
    overflow: auto;
}
.logo-c {
    display: flex;
    align-items: center;
    color: rgba(255,255,255,.8);
    font-size: 16px;
    margin: 20px 0;
    justify-content: center;
}
.logo {
    width: 40px;
    margin-right: 10px;
}
.aside-big {
    width: 220px;
}
/* 主体页面 */
.sec-right {
    height: 100%;
    /* margin-left: 220px; */
    transition: margin-left .3s;
    overflow: hidden;;
    background: #f3f7fd;
}
/* 主体页面头部 */
header {
    height: 50px;
    border-bottom: none;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 40px;
    padding-left: 10px;
    font-size: 14px;
}
header .ivu-icon {
    font-size: 24px;
}

.refresh-c {
    margin: 0 30px;
    cursor: pointer;
}
.h-right {
    display: flex;
    align-items: center;
}
.h-left {
    display: flex;
    align-items: center;
}
.user-img-c img {
    width: 100%;
}
.notice-c {
    cursor: pointer;
    position: relative;
}
.newMsg {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #FF5722;
    right: 0;
    top: 0;
}
.user-img-c {
    width: 34px;
    height: 34px;
    background: #ddd;
    border-radius: 50%;
    margin: 0 40px;
    overflow: hidden;
    text-align: center;
}
.user-img-c .userIcon{
    font-size: 20px;
    line-height: 34px;
}
.tag-options {
    cursor: pointer;
    position: relative;
}
.div-tags {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 4px 0;
}
.div-icons {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #fff;
    height: 34px;
    width: 160px;
    font-size: 18px;
}
/* 标签栏 */
.ul-c {
    height: 34px;
    background: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 10px;
    overflow: hidden;
    width: calc(100% - 160px);
}
.ul-c li {
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    height: 24px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3px 5px 2px 3px;
    border: 1px solid #e6e6e6;
}
a {
    color: #666;
    transition: none;
}
.li-a {
    max-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.ul-c .ivu-icon {
    margin-left: 6px;
}
.active {
    background: #409eff;
    border: 1px solid #409eff;
}
.active a {
    color: #fff;
}
.active .el-icon-close {
    color: #fff;
}
/* 主要内容区域 */
.main-content {
    height: calc(100% - 88px);
    overflow: hidden;
}
.view-c {
    position: relative;
    height: 100%;
    min-height: 100%;
    padding: 15px;
    overflow: auto;
}
.box-card{
   height: 100%; 
}
.pointer {
    cursor: pointer;
}
.pointer>i,.el-icon-bell{
    font-size: 22px;
}
/* loading */
.loading-c {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(255,255,255,.5);
    display: flex;
    align-items: center;
    justify-content: center;
}
.crumbs {
    margin-left: 10px;
    color: #97a8be;
    cursor: default;
}
.menu-level-3 .ivu-icon {
    font-size: 18px;
}
.shrink {
    text-align: center;
}
.el-submenu .el-menu-item{
    text-indent: 10px;
    font-size: 13px;
}
.el-submenu .el-menu-item.is-active{
    background-color: #383b4a !important;
}

</style>