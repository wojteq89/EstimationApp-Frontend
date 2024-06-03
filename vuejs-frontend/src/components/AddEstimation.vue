<template>
    <v-container>
      <v-form @submit.prevent="addEstimation">
        <v-text-field v-model="name" label="Estimation Name" required></v-text-field>
        <v-select v-model="project" :items="projects" label="Project" required></v-select>
        <v-select v-model="client" :items="clients" label="Client" required></v-select>
        <v-select v-model="type" :items="['Hourly', 'Fixed Price']" label="Estimation Type" required></v-select>
        <v-text-field v-model="value" label="Estimation Value" required></v-text-field>
        <v-btn type="submit" color="primary">Add Estimation</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        project: '',
        client: '',
        type: '',
        value: '',
        projects: [],
        clients: []
      };
    },
    mounted() {
      this.fetchProjects();
      this.fetchClients();
    },
    methods: {
      fetchProjects() {
        // Replace with actual API call
        this.projects = ['Project A', 'Project B', 'Project C'];
      },
      fetchClients() {
        // Replace with actual API call
        this.clients = ['Client A', 'Client B', 'Client C'];
      },
      addEstimation() {
        // Replace with actual API call
        console.log('Estimation added:', this.name, this.project, this.client, this.type, this.value);
        this.name = '';
        this.project = '';
        this.client = '';
        this.type = '';
        this.value = '';
        this.$router.push('/estimations');
      }
    }
  };
  </script>
  