<template>
  <v-container style="width: 85%; margin-top: 50px;">
    <v-card class="card">
      <v-card-title class="text-center">
        <h2 class="headline">Register</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="registerAction">
          <v-text-field v-model="name" label="Name" required></v-text-field>
          <v-text-field v-model="email" label="Email address" type="email" required></v-text-field>
          <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
          <v-text-field v-model="confirmPassword" label="Confirm Password" type="password" required></v-text-field>
          <v-btn class="button" :loading="isSubmitting" :disabled="isSubmitting" color="primary" block type="submit">Register</v-btn>
          <p class="text-center">Already have an account? <router-link to="/login-page">Login here</router-link></p>
          <p v-if="Object.keys(validationErrors).length !== 0" class="text-center">
            <small class="text-danger">{{ validationErrors[Object.keys(validationErrors)[0]][0] }}</small>
          </p>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

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
    if (this.$store.getters.isLoggedIn) {
      this.$router.push('/');
    }
  },
  methods: {
    ...mapActions(['register']),
    registerAction() {
      this.isSubmitting = true;
      this.register({
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.confirmPassword,
      })
        .then(() => {
          this.$router.push('/login-page');
        })
        .catch(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>
