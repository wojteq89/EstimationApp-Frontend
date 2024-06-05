<template>
    <v-app>
    <v-container>
      <v-card-text class="title" style="font-size: x-large;">Add Client</v-card-text>
      <v-form @submit.prevent="addClient">
        <v-text-field v-model="name" label="Client Name" required></v-text-field>
        <v-textarea v-model="description" label="Description"></v-textarea>
        <v-text-field v-model="logo" label="Logo"></v-text-field>
        <v-text-field v-model="country" label="Country" required></v-text-field>
        <v-text-field v-model="email" label="Email" required></v-text-field>
        <v-container style="display: flex; flex-direction: row; justify-content: center;">
          <v-btn type="submit">Add Client</v-btn>
          <v-btn @click="cancelClient">Cancel</v-btn>
        </v-container>
      </v-form>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';
import VueNotification from 'vue-notification';

Vue.use(VueNotification, {
  timer: 5000
});

export default {
  data() {
    return {
      name: '',
      description: '',
      logo: '',
      country: '',
      email: ''
    };
  },
  methods: {
    addClient() {
      if (!this.name || !this.country || !this.email) {
        this.$notify({
          title: 'Error',
          text: 'Please fill in all required fields.',
          type: 'error'
        });
        return;
      }

      axios.post('http://localhost:8000/api/clients', {
        name: this.name,
        description: this.description,
        logo: this.logo,
        country: this.country,
        email: this.email
      })
      .then(response => {
        console.log('Client added:', response.data);
        this.$notify({
          title: 'Success',
          text: 'Client added successfully.',
          type: 'success'
        });
        this.name = '';
        this.description = '';
        this.logo = '';
        this.country = '';
        this.email = '';
        this.$router.push('/clients');
      })
      .catch(error => {
        console.error('Error adding client:', error);
        this.$notify({
          title: 'Error',
          text: 'Failed to add client.',
          type: 'error'
        });
      });
    },

    cancelClient() {
        this.$router.push('/clients');
    }
  }
};
</script>

<style>
  .v-btn {
    margin-left: 15px;
  }
</style>
