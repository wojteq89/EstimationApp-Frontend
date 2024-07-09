<template>
    <v-container style="width: 85%; margin-top: 50px;">
      <v-card class="card">
        <v-card-title class="text-center">
          <h2 class="headline">Login</h2>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent='loginAction'>
            <v-text-field v-model="email" label="Email address" type="email" required></v-text-field>
            <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
            <v-btn class="button" :loading="isSubmitting" :disabled="isSubmitting" color="primary" block type="submit">Login</v-btn> <br>
            <p class="text-center">Don't have an account? <router-link to="/register-page">Register here</router-link></p>
            <p class="text-center"><router-link to="/password-reset">Forgot password?</router-link></p>
            <p v-if="errorMessage" class="text-center">
              <small class="text-danger">{{ errorMessage }}</small>
            </p>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </template>
  
  <script>
    import { mapActions, mapGetters } from 'vuex';

    export default {
    name: 'LoginPage',
    data() {
        return {
        email: '',
        password: '',
        isSubmitting: false,
        };
    },
    computed: {
        ...mapGetters(['authStatus', 'errorMessage']),
    },
    methods: {
        ...mapActions(['login']),
        loginAction() {
        this.isSubmitting = true;
        const credentials = {
            email: this.email,
            password: this.password,
        };
        this.login(credentials)
            .then(() => {
            this.$router.push('/home-page');
            })
            .catch(() => {
            })
            .finally(() => {
            this.isSubmitting = false;
            });
        },
    },
    };
  </script>
  