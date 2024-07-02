<template>
  <div id="app" data-app>
    <nav class="nav-container">
      <v-container id="user-info">
        <v-menu offset-y :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="button" 
                   @mouseover="showTooltipSettings = true" 
                   @mouseleave="showTooltipSettings = false" 
                   v-bind="attrs" 
                   v-on="on"
                   style="height: 60px;">
              <v-icon class="button-icon">mdi-cog</v-icon>
              <span v-if="showTooltipSettings" class="button-text">Settings</span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-if="isLoggedIn">
              <v-list-item-title>
                <router-link to="/">Account Settings</router-link>
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="logoutAction" v-if="isLoggedIn">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <p id="nickname">{{ isLoggedIn ? user.nickname : 'Guest' }}</p>
      </v-container>
      <v-container class="bookmarks">
        <router-link v-if="!isLoggedIn" to="/login-page">Login</router-link>
        <router-link v-if="!isLoggedIn" to="/register-page">Register</router-link>
        <router-link v-if="isLoggedIn" to="/home-page">Home</router-link>
        <router-link v-if="isLoggedIn" to="/clients">Clients</router-link>
        <router-link v-if="isLoggedIn" to="/projects">Projects</router-link>
        <router-link v-if="isLoggedIn" to="/estimations">Estimations</router-link>
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
    ...mapGetters(['isLoggedIn', 'user']),
  },
  data(){
    return {
      showTooltipSettings: false,
    }
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
