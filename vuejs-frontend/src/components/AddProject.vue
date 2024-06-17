<template>
  <v-app class="add-page">
    <v-container class="add-form">
      <v-form @submit.prevent="addProject">
        <v-text-field v-model="name" label="Project Name" required></v-text-field>
        <v-combobox
        v-model="selectedClient"
        :items="clientOptions"
        item-text="displayText"
        item-value="id"
        label="Client"
        required
        ></v-combobox>
        <v-text-field
        v-model="estimation"
        label="Estimation"
        type="number"
        step="1"
        required
        ></v-text-field>
        <v-textarea v-model="description" label="Description"></v-textarea>
        <v-container style="display: flex; flex-direction: row; justify-content: center;">
          <v-btn class="button" type="submit">Add Project</v-btn>
          <v-btn class="button" @click="cancel">Cancel</v-btn>
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
      selectedClient: null,
      estimation: 0,
      clients: [],
      menu: false
    };
  },
  computed: {
    clientOptions() {
      return this.clients.map(client => ({
        id: client.id,
        name: client.name,
        displayText: `${client.name}`
      }));
    }
  },
  mounted() {
    this.fetchClients();
  },
  methods: {
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
    addProject() {
  if (!this.name || !this.selectedClient || !this.estimation) {
    console.log('Form data:', this.name, this.selectedClient, this.estimation);

    this.$notify({
      title: 'Error',
      text: 'Please fill in all required fields.',
      type: 'error'
    });
    return;
  }

  const projectData = {
    name: this.name,
    description: this.description,
    client_id: this.selectedClient.id,
    estimation: this.estimation
  };

  console.log('Sending project data:', projectData);

  axios.post('http://localhost:8000/api/projects', projectData)
    .then(response => {
      console.log('Project added:', response.data);
      this.$notify({
        title: 'Success',
        text: 'Project added successfully.',
        type: 'success'
      });
      this.name = '';
      this.description = '';
      this.selectedClient = null;
      this.estimation = 0;
      this.$router.push('/projects');
    })
    .catch(error => {
      console.error('Error adding project:', error.response ? error.response.data : error.message);
      this.$notify({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to add project.',
        type: 'error'
      });
    });
},

    cancel() {
      this.$router.push('/projects');
    }
  }
};
</script>
