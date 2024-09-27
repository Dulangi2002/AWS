import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      // Define your state here
      message: 'Hello from Vuex!',
      user: { 
        username: '',
        role: '',
        idToken : '',
        accessToken : ''
      }
    };
  },
  mutations: {
    // Define your mutations here
    setMessage(state, newMessage) {
      state.message = newMessage;
    },

    setUser(state , user){
      state.user = user
    }


  },
  actions: {
    // Define your actions here
    updateMessage({ commit }, newMessage) {
      commit('setMessage', newMessage);
    },
    updateUser({commit},user){
      commit('setUser',user)
    }

  },
  getters: {
    // Define your getters here
    getMessage(state) {
      return state.message;
    },
    getUser(state){
      return state.user
    }
  },
});
