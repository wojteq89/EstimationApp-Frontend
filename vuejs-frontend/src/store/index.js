// Vuex store.js
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    status: '',
    errorMessage: '',
    user: JSON.parse(localStorage.getItem('user')) || null,
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
      state.errorMessage = '';
    },
    auth_success(state, { token, user }) {
      state.status = 'success';
      state.token = token;
      state.user = user;
    },
    auth_error(state, message) {
      state.status = 'error';
      state.errorMessage = message;
    },
    set_user(state, user) {
      state.user = user;
    },
    logout(state) {
      state.status = '';
      state.token = '';
      state.errorMessage = '';
      state.user = null;
    },
  },
  actions: {
    login({ commit }, credentials) {
      commit('auth_request');
      return new Promise((resolve, reject) => {
        axios.post('http://127.0.0.1:8000/api/login', credentials)
          .then(response => {
            const token = response.data.token;
            const user = { nickname: response.data.nickname };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            commit('auth_success', { token, user });
            resolve(response);
          })
          .catch(error => {
            const message = error.response && error.response.data.error ? error.response.data.error : 'An error occurred. Please try again.';
            commit('auth_error', message);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            reject(error);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        resolve();
      });
    },
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    errorMessage: state => state.errorMessage,
    user: state => state.user,
  },
});
