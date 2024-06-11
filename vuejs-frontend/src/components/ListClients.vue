<template>
  <div class="container">
    <v-data-table
      :headers="headers"
      :items="clients"
      item-key="name"
      class="elevation-1"
      :search="search"
      :custom-filter="filterCaseInsensitive"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Clients</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="goToHome">↩</v-btn>
          <v-btn @click="addClient">Add Client</v-btn>
        </v-toolbar>
        <v-text-field v-model="search" label="Search Clients" class="mx-4"></v-text-field>
      </template>

      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.logo }}</td>
          <td>{{ item.country }}</td>
          <td>{{ item.email }}</td>
          <td>
            <v-btn @click="editClient(item)">Edit</v-btn>
            <v-btn @click="deleteClient(item)">Delete</v-btn>
          </td>
        </tr>
      </template>
      
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      search: '',
      clients: []
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Logo', value: 'logo' },
        { text: 'Country', value: 'country' },
        { text: 'Email', value: 'email' },
        { text: 'Actions', value: 'actions', sortable: false }
      ];
    }
  },
  created() {
    this.fetchClients();
  },
  methods: {
    filterCaseInsensitive(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toLowerCase().indexOf(search.toLowerCase()) !== -1
      );
    },
    addClient() {
      this.$router.push('/add-client');
    },
    goToHome() {
      this.$router.push("/home-page");
    },
    fetchClients() {
      axios.get('http://localhost:8000/api/clients')
        .then(response => {
          this.clients = response.data;
        })
        .catch(error => {
          console.error('Error fetching clients:', error);
        });
    },

  }
};
</script>

<style>
.container {
  padding: 25px;
}
</style>
