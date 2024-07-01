<template>
    <v-container class="mt-5">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6">
          <v-card>
            <v-card-title class="text-center">
              <h2 class="headline">Register</h2>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="registerAction">
                <v-text-field v-model="name" label="Name" required></v-text-field>
                <v-text-field v-model="email" label="Email address" type="email" required></v-text-field>
                <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                <v-text-field v-model="confirmPassword" label="Confirm Password" type="password" required></v-text-field>
                <v-btn :loading="isSubmitting" :disabled="isSubmitting" color="primary" block type="submit">Register Now</v-btn>
                <p class="text-center">Already have an account? <router-link to="/">Login here</router-link></p>
                <p v-if="Object.keys(validationErrors).length !== 0" class="text-center">
                  <small class="text-danger">{{ validationErrors[Object.keys(validationErrors)[0]][0] }}</small>
                </p>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'RegisterPage',
    data() {
      return {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        validationErrors: {},
        isSubmitting: false,
      };
    },
    created() {
      if (localStorage.getItem('token')) {
        this.$router.push('/');
      }
    },
    methods: {
      registerAction() {
        this.isSubmitting = true;
        const payload = {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.confirmPassword,
        };
  
        axios.post('http://127.0.0.1:8000/api/register', payload)
          .then(response => {
            localStorage.setItem('token', response.data.token);
            this.$router.push('/login-page');
          })
          .catch(error => {
            this.isSubmitting = false;
            if (error.response && error.response.data.errors) {
              this.validationErrors = error.response.data.errors;
            } else {
              this.validationErrors = { general: 'An error occurred. Please try again.' };
            }
          });
      },
    },
  };
  </script>