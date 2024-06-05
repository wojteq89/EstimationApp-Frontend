<template>
  <v-app>
    <v-container>
      <v-card-text class="title" style="font-size: x-large;">Add Project</v-card-text>
      <v-form @submit.prevent="addProject">
        <v-text-field v-model="name" label="Project Name" required></v-text-field>
        <v-textarea v-model="description" label="Description"></v-textarea>
        <v-combobox
          v-model="client_id"
          :items="clients"
          item-text="name"
          item-value="id"
          label="Client"
          required
        ></v-combobox>
        <v-text-field
          v-model="estimation"
          label="Estimation"
          type="number"
          step="0.01"
          required
        ></v-text-field>
        <v-container style="display: flex; flex-direction: row; justify-content: center;">
          <v-btn type="submit">Add Project</v-btn>
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
  vuetify: new Vuetify(),
  data() {
    return {
      name: '',
      description: '',
      client_id: null,
      estimation: 0,
      clients: [
        { id: 1, name: 'Client1' },
        { id: 2, name: 'Client2' },
        { id: 3, name: 'Client3' },
        { id: 4, name: 'Client4' },
        { id: 5, name: 'Client5' }
      ]
    };
  },
  methods: {
    addProject() {
      if (!this.name || !this.client_id || !this.estimation) {
        this.$toast.error('Please fill in all required fields.');
        return;
      }

      console.log('Project added:', {
        name: this.name,
        description: this.description,
        client_id: this.client_id,
        estimation: this.estimation
      });

      this.name = '';
      this.description = '';
      this.client_id = null;
      this.estimation = 0;

      this.$router.push('/projects');
    },
    cancel() {
      this.$router.push('/projects');
    }
  }
};
</script>

<style>
.v-btn {
  margin-left: 15px;
}
</style>
