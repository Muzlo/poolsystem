import Vue from 'vue'
import Vuex from 'vuex'
import dialogVisibleBaseInfo from './baseInfo/dialogVisibleBaseInfo'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        // 左侧菜单栏数据
        menuItems:[]
    },
    mutations: {
        setMenus(state, items) {
            state.menuItems = [...items]
        },
    },
    modules:{
        dialogVisibleBaseInfo
    }
})

export default store