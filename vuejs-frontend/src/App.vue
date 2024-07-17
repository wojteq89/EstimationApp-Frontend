<template>
  <div id="app" data-app>
    <nav class="nav-container">
      <v-container v-if="isLoggedIn" id="user-info">
        <v-menu offset-y :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn id="account-button" v-bind="attrs" v-on="on" title="Account Settings">
              <v-icon class="button-icon">mdi-account</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item to="/settings-page">
              <v-icon class="button-icon">mdi-cog</v-icon>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logoutAction">
              <v-icon class="button-icon">mdi-logout</v-icon>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <p id="nickname">{{ isLoggedIn && user ? user.nickname : 'Guest' }}</p>
      </v-container>
      <v-container class="bookmarks">
        <router-link v-if="!isLoggedIn" to="/login-page">Login</router-link>
        <router-link v-if="!isLoggedIn" to="/register-page">Register</router-link>
        <router-link v-if="isLoggedIn" to="/home-page">Home</router-link>
        <router-link v-if="isLoggedIn" to="/clients">Clients</router-link>
        <router-link v-if="isLoggedIn" to="/projects">Projects</router-link>
        <router-link v-if="isLoggedIn" to="/estimations">Estimations</router-link>
        <router-link v-if="isLoggedIn && isAdmin" to="/admin-panel">Users</router-link>
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
    ...mapGetters(['isLoggedIn', 'user', 'isAdmin']),
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
};
</script>
