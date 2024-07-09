<template>
    <div id="account-settings" data-app>
        <v-card class="card">
                        <v-img
                src="@/assets/clients.svg"
                alt="Client Icon"
                class="icon"
            ></v-img>
            <v-card-text class="title">{{ isLoggedIn ? user.nickname : 'Guest' }}</v-card-text>
            <v-card-text class="description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Commodi, ratione debitis quis est labore voluptatibus! Eaque 
                cupiditate minima, at placeat totam, magni doloremque veniam 
                neque porro libero rerum unde voluptatem!
            </v-card-text>
            <v-card-actions class="buttons">
                <v-btn @click=resetPassword @mouseover="showTooltipChangePassword = true" @mouseleave="showTooltipChangePassword = false" class="button">
                    <v-icon class="button-icon">mdi-pencil</v-icon>
                    <span v-if="showTooltipChangePassword" class="button-text">Change Password</span>
                </v-btn>
                <v-btn @mouseover="showTooltipLogout = true" @mouseleave="showTooltipLogout = false" class="button" @click="logoutAction">
                    <v-icon class="button-icon">mdi-logout</v-icon>
                    <span v-if="showTooltipLogout" class="button-text">Logout</span>
                </v-btn>
            </v-card-actions>
         </v-card>
    </div>
  </template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapGetters(['isLoggedIn', 'user']),
  },
  data() {
    return {
      showTooltipChangePassword: false,
      showTooltipLogout: false,
    };
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
    resetPassword (){
      this.$router.push('/reset-password')
    }
  },
};
</script>