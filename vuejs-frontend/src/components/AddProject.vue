<template>
    <v-container>
      <v-form @submit.prevent="addProject">
        <v-text-field v-model="name" label="Project Name" required></v-text-field>
        <v-select v-model="client" :items="clients" label="Client" required></v-select>
        <v-btn type="submit" color="primary">Add Project</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        client: '',
        clients: []
      };
    },
    mounted() {
      this.fetchClients();
    },
    methods: {
      fetchClients() {
        // Replace with actual API call
        this.clients = ['Client A', 'Client B', 'Client C'];
      },
      addProject() {
        // Replace with actual API call
        console.log('Project added:', this.name, this.client);
        this.name = '';
        this.client = '';
        this.$router.push('/projects');
      }
    }
  };
  </script>
  