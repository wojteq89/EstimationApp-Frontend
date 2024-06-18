<template>
  <div class="list">
    <v-data-table
      :headers="headers"
      :items="clients"
      item-key="name"
      class="elevation-1 data-table"
      :search="search"
      :custom-filter="filterCaseInsensitive"
    >
      <template v-slot:top>
        <v-toolbar flat class="table-toolbar">
          <v-toolbar-title>Clients</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn class="button" @click="goToHome">↩</v-btn>
          <v-btn class="button" @click="addClient">Add Client</v-btn>
        </v-toolbar>
        <v-text-field v-model="search" label="Search Clients" class="mx-4"></v-text-field>
      </template>

      <template v-slot:item="{ item }">
        <tr class="table-row">
          <td><img :src="item.logo" class="logo" alt="Logo" style="max-width: 60px; max-height: 60px;"></td>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.country }}</td>
          <td>{{ item.email }}</td>
          <td>
            <v-icon 
              class="action-button" 
              @click="editClient(item)" 
              title="Edit"
            >mdi-pencil</v-icon>
            <v-icon 
              class="action-button" 
              @click="confirmDeleteClient(item)" 
              title="Delete"
            >mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

    <EditClientModal
      :editDialog.sync="editDialog"
      :editedClient="editedClient"
      :countries="countries"
      @save-changes="handleSaveChanges"
      @cancel-edit="cancelEdit"
    />

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card class="card">
        <v-card-title class="center-content">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this client? This action will 
          remove all customer-related projects and estimations.</v-card-text>
        <v-card-actions class="center-content">
          <v-btn class="button" @click="deleteClient">Yes</v-btn>
          <v-btn class="button" @click="cancelDelete">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import EditClientModal from './EditClientModal.vue';

export default {
  components: {
    EditClientModal,
  },
  data() {
    return {
      search: '',
      clients: [],
      editDialog: false,
      deleteDialog: false,
      countries: ['Poland', 'Germany', 'France', 'USA', 'UK', 'Spain', 'Italy', 
      'Canada', 'Australia', 'Japan', 'China', 'Brazil', 'India', 'Russia'],
      editedClient: {
        id: null,
        name: '',
        description: '',
        logo: '',
        country: '',
        email: ''
      },
      clientToDelete: null,
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Logo', value: 'logo' },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Country', value: 'country' },
        { text: 'Email', value: 'email' },
        { text: 'Actions', value: 'actions', sortable: false }
      ];
    },
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
    editClient(client) {
      this.editedClient = { ...client };
      this.editDialog = true;
    },
    async handleSaveChanges(updatedClient) {
      try {
        await axios.put(`http://localhost:8000/api/clients/${updatedClient.id}`, updatedClient);
        this.fetchClients();
        this.editDialog = false;
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    },
    cancelEdit() {
      this.editDialog = false;
    },
    confirmDeleteClient(client) {
      this.clientToDelete = client;
      this.deleteDialog = true;
    },
    async deleteClient() {
      try {
        await axios.delete(`http://localhost:8000/api/clients/${this.clientToDelete.id}`);
        this.fetchClients();
        this.deleteDialog = false;
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    },
    cancelDelete() {
      this.deleteDialog = false;
    },
  },
};
</script>