<template>
    <v-container>
      <v-form @submit.prevent="addClient">
        <v-text-field v-model="name" label="Client Name" required></v-text-field>
        <v-btn type="submit" color="primary">Add Client</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: ''
      };
    },
    methods: {
      addClient() {
        // Replace with actual API call
        console.log('Client added:', this.name);
        this.name = '';
        this.$router.push('/clients');
      }
    }
  };
  </script>
  