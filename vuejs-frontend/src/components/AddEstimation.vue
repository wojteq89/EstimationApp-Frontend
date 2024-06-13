<template>
  <v-app>
    <v-container>
      <v-form @submit.prevent="addEstimation">
        <v-text-field v-model="name" label="Estimation Name" required></v-text-field>
        <v-textarea v-model="description" label="Description"></v-textarea>
        <v-combobox
          v-model="selectedProject"
          :items="projectOptions"
          item-text="displayText"
          item-value="id"
          label="Project"
          required
        ></v-combobox>
        <v-combobox
          v-model="selectedClient"
          :items="clientOptions"
          item-text="displayText"
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
          min-width="auto">
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
import axios from 'axios';
import Vue from 'vue';
import VueNotification from 'vue-notification';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);
Vue.use(VueNotification, {
  timer: 5000
});

export default {
  vuetify: new Vuetify(),
  data() {
    return {
      name: '',
      description: '',
      selectedProject: null,
      selectedClient: null,
      date: new Date().toISOString().substr(0, 10),
      type: '',
      amount: 0,
      projects: [],
      clients: [],
      menu: false
    };
  },
  computed: {
    projectOptions() {
      return this.projects.map(project => ({
        id: project.id,
        name: project.name,
        displayText: `${project.name}`
      }));
    },
    clientOptions() {
      return this.clients.map(client => ({
        id: client.id,
        name: client.name,
        displayText: `${client.name}`
      }));
    }
  },
  mounted() {
    this.fetchProjects();
    this.fetchClients();
  },
  methods: {
    fetchProjects() {
      axios.get('http://localhost:8000/api/projects')
        .then(response => {
          this.projects = response.data;
        })
        .catch(error => {
          console.error('Error fetching projects:', error);
          this.$notify({
            title: 'Error',
            text: 'Failed to load projects.',
            type: 'error'
          });
        });
    },
    fetchClients() {
      axios.get('http://localhost:8000/api/clients')
        .then(response => {
          this.clients = response.data;
        })
        .catch(error => {
          console.error('Error fetching clients:', error);
          this.$notify({
            title: 'Error',
            text: 'Failed to load clients.',
            type: 'error'
          });
        });
    },
    addEstimation() {
      if (!this.name || !this.selectedProject || !this.selectedClient || !this.date || !this.type || !this.amount) {
        console.log('Form data:', this.name, this.selectedProject, this.selectedClient, this.date, this.type, this.amount);

        this.$notify({
          title: 'Error',
          text: 'Please fill in all required fields.',
          type: 'error'
        });
        return;
      }

      const estimationData = {
        name: this.name,
        description: this.description,
        project_id: this.selectedProject.id,
        client_id: this.selectedClient.id,
        date: this.date,
        type: this.type,
        amount: this.amount
      };

      console.log('Sending estimation data:', estimationData);

      axios.post('http://localhost:8000/api/estimations', estimationData)
        .then(response => {
          console.log('Estimation added:', response.data);
          this.$notify({
            title: 'Success',
            text: 'Estimation added successfully.',
            type: 'success'
          });
          this.name = '';
          this.description = '';
          this.selectedProject = null;
          this.selectedClient = null;
          this.date = '';
          this.type = '';
          this.amount = 0;
          this.$router.push('/estimations');
        })
        .catch(error => {
          console.error('Error adding estimation:', error.response ? error.response.data : error.message);
          this.$notify({
            title: 'Error',
            text: error.response?.data?.message || 'Failed to add estimation.',
            type: 'error'
          });
        });
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
