<template>
  <div id="app" data-app>
    <nav class="nav-container">
      <v-container id="user-info">
        <v-btn id="account-button">Account</v-btn>
        <p id="nickname">Guest</p> <!-- Wyświetlenie nazwy użytkownika -->
      </v-container>
      <v-container class="bookmarks">
        <router-link to="/home-page">Home</router-link>
        <router-link to="/clients">Clients</router-link>
        <router-link to="/projects">Projects</router-link>
        <router-link to="/estimations">Estimations</router-link>
        <router-link v-if="!isLoggedIn" to="/login-page">Login</router-link>
        <router-link v-if="!isLoggedIn" to="/register-page">Register</router-link>
        <v-btn v-if="isLoggedIn" @click="logoutAction">Logout</v-btn>
      </v-container>
    </nav>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    ...mapActions(['logout']),
    logoutAction() {
      this.logout()
        .then(() => {
          this.$router.push('/login-page');
        })
        .catch(() => {
        });
    },
  },
  created() {

  },
};
</script>
