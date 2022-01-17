import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    joinRoom: [],
    leaveRoom: {},
    userList: {}
  },
  mutations: {
    setJoinRoom(state, payload) {
      state.joinRoom.push(payload)
    },
    setUserList(state, payload) {
      state.userList = payload
    },
    setLeaveRoom(state, payload) {
      console.log('leave room', payload)
      state.leaveRoom = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
