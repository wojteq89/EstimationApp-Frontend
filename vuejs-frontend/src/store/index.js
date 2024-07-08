import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { Notyf } from 'notyf';
import CryptoJS from 'crypto-js';
import 'notyf/notyf.min.css';

Vue.use(Vuex);

const notyf = new Notyf({
  position: { x: 'center', y: 'bottom' },
});

const ENCRYPTION_KEY = 'EncryptionKey123';

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Error while decrypting data:', error);
    return null;
  }
};

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') ? decryptData(localStorage.getItem('token')) : '',
    status: '',
    errorMessage: '',
    user: localStorage.getItem('user') ? decryptData(localStorage.getItem('user')) : null,
    role: localStorage.getItem('role') ? decryptData(localStorage.getItem('role')) : '',
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
      localStorage.setItem('token', encryptData(token));
      localStorage.setItem('user', encryptData(user));
      localStorage.setItem('role', encryptData(role));
      notyf.success('Login successful.');
    },
    auth_error(state, message) {
      state.status = 'error';
      state.errorMessage = message;
      notyf.error('Email or password is incorrect');
    },
    set_user(state, user) {
      state.user = user;
      localStorage.setItem('user', encryptData(user));
    },
    set_role(state, role) {
      state.role = role;
      localStorage.setItem('role', encryptData(role));
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
