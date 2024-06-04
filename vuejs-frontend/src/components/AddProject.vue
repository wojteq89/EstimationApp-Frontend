<template>
  <v-container>
    <v-card-text class="title" style="font-size: x-large;">Add Project</v-card-text>
    <v-form @submit.prevent="addProject">
      <v-text-field v-model="name" label="Project Name" required></v-text-field>
      <v-textarea v-model="description" label="Description"></v-textarea>
      <v-select 
        v-model="client_id" 
        :items="clients" 
        item-text="name" 
        item-value="id" 
        label="Client" 
        required
      ></v-select>
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
</template>

<script>
export default {
  data() {
    return {
      name: '',
      description: '',
      client_id: null,
      estimation: 0,
      clients: []
    };
  },
  created() {
    this.fetchClients();
  },
  methods: {
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
