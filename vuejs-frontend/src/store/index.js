import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

Vue.use(Vuex);

const notyf = new Notyf({
  position: { x: 'center', y: 'bottom' },
});

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    status: '',
    errorMessage: '',
    user: JSON.parse(localStorage.getItem('user')) || null,
    role: localStorage.getItem('role') || '',
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
      state.errorMessage = '';
    },
    auth_success(state, { token, user, role }) {
      state.status = 'success';
      state.token = token;
      state.user = user;
      state.role = role;
      notyf.success('Login successful.');
    },
    auth_error(state, message) {
      state.status = 'error';
      state.errorMessage = message;
      notyf.error('Email or password is incorrect');
    },
    set_user(state, user) {
      state.user = user;
    },
    set_role(state, role) {
      state.role = role;
      localStorage.setItem('role', role);
    },
    logout(state) {
      state.status = '';
      state.token = '';
      state.errorMessage = '';
      state.user = null;
      state.role = '';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      notyf.success('Logout successful.');
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
            const role = response.data.role;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('role', role);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            commit('auth_success', { token, user, role });
            resolve(response);
          })
          .catch(error => {
            const message = error.response && error.response.data.error ? error.response.data.error : 'An error occurred. Please try again.';
            commit('auth_error', message);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            reject(error);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
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
    role: state => state.role,
    isAdmin: state => state.role === 'admin',
  },
});
