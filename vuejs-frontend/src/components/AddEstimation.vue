<template>
    <v-app>
    <v-container>
      <v-card-text class="title" style="font-size: x-large;">Add Estimation</v-card-text>
      <v-form @submit.prevent="addEstimation">
        <v-text-field v-model="name" label="Estimation Name" required></v-text-field>
        <v-textarea v-model="description" label="Description"></v-textarea>
        <v-combobox
          v-model="project_id"
          :items="projects"
          item-text="name"
          item-value="id"
          label="Project"
          required
        ></v-combobox>
        <v-combobox
          v-model="client_id"
          :items="clients"
          item-text="name"
          item-value="id"
          label="Client"
          required
        ></v-combobox>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            @input="menu = false"
          ></v-date-picker>
        </v-menu>
        <v-select 
          v-model="type" 
          :items="['hourly', 'fixed']" 
          label="Type" 
          required
        ></v-select>
        <v-text-field 
          v-model="amount" 
          label="Amount" 
          type="number" 
          step="0.01" 
          required
        ></v-text-field>
        <v-container style="display: flex; flex-direction: row; justify-content: center;">
          <v-btn type="submit">Add Estimation</v-btn>
          <v-btn @click="cancel">Cancel</v-btn>
        </v-container>
      </v-form>
    </v-container>
  </v-app>
</template>

<script>
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default {
  data() {
    return {
      name: '',
      description: '',
      project_id: null,
      client_id: null,
      date: new Date().toISOString().substr(0, 10),
      type: '',
      amount: 0,
      projects: [
        { id: 1, name: 'Project1' },
        { id: 2, name: 'Project2' },
        { id: 3, name: 'Project3' },
        { id: 4, name: 'Project4' },
        { id: 5, name: 'Project5' }
      ],
      clients: [
        { id: 1, name: 'Client1' },
        { id: 2, name: 'Client2' },
        { id: 3, name: 'Client3' },
        { id: 4, name: 'Client4' },
        { id: 5, name: 'Client5' }
      ],
      menu: false
    };
  },
  created() {
    this.fetchProjects();
    this.fetchClients();
  },
  methods: {
    fetchProjects() {
      fetch('/api/projects')
        .then(response => response.json())
        .then(data => {
          this.projects = data;
        })
        .catch(error => {
          console.error('Error fetching projects:', error);
        });
    },
    fetchClients() {
      fetch('/api/clients')
        .then(response => response.json())
        .then(data => {
          this.clients = data;
        })
        .catch(error => {
          console.error('Error fetching clients:', error);
        });
    },
    addEstimation() {
      if (!this.name || !this.project_id || !this.client_id || !this.type || !this.amount) {
        this.$toast.error('Please fill in all required fields.');
        return;
      }

      console.log('Estimation added:', {
        name: this.name,
        description: this.description,
        project_id: this.project_id,
        client_id: this.client_id,
        date: this.date,
        type: this.type,
        amount: this.amount
      });

      this.name = '';
      this.description = '';
      this.project_id = null;
      this.client_id = null;
      this.date = new Date().toISOString().substr(0, 10);
      this.type = '';
      this.amount = 0;

      this.$router.push('/estimations');
    },
    cancel() {
      this.$router.push('/estimations');
    }
  }
};
</script>

<style>
.v-btn {
  margin-left: 15px;
}
</style>
