import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        music: '',
        searchName: '',
        detailsActive: 'single',
        recordList: JSON.parse(localStorage.getItem('recordList')) || [],
        list: [],
    },
    mutations: {
        updateRecord(state, keyword) {
            state.searchName = keyword
            var index = state.recordList.findIndex(e => e == keyword)
            if (index == -1) {
                if (state.recordList.length >= 15) state.recordList.pop()
            } else {
                state.recordList.splice(index, 1)
            }
            state.recordList.unshift(keyword)
            localStorage.setItem('recordList', JSON.stringify(state.recordList))
        },
        clearRecrod(state) {
            state.recordList = []
            localStorage.setItem('recordList', JSON.stringify(state.recordList))
        },
        detailsName(state, name) {
            state.detailsActive = name;
        },
        updataMuic(state, item) {
            state.music = item
        },
        updataList(state, list) {
            state.list = list
            state.music = list[0]
        }
    },
    actions: {

    },
    getters: {
    }
})