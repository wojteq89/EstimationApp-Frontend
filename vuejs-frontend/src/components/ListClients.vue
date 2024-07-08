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
          <v-btn class="button" @click="goToHome" @mouseover="showTooltipGoToHome = true" @mouseleave="showTooltipGoToHome = false">
            <v-icon class="button-icon">mdi-arrow-left</v-icon>
            <span v-if="showTooltipGoToHome" class="button-text" >Go to home</span>
          </v-btn>
          <v-btn v-if="isAdmin" class="button" @click="openAddClientModal" @mouseover="showTooltipAddClient = true" @mouseleave="showTooltipAddClient = false">
            <v-icon class="button-icon">mdi-plus</v-icon>
            <span v-if="showTooltipAddClient" class="button-text" >Add Client</span>
          </v-btn>
        </v-toolbar>
        <v-text-field v-model="search" label="Search Clients" class="mx-4"></v-text-field>
      </template>

      <template v-slot:item="{ item }">
        <tr class="table-row">
          <td><img :src="item.logo" class="logo" alt="Logo" style="max-width: 60px; max-height: 60px;"></td>
          <td>{{ item.name }}</td>
          <td>{{ item.country }}</td>
          <td>{{ item.email }}</td>
          <td v-if="isAdmin"> 
            <v-icon 
              class="action-edit-button" 
              @click="editClient(item)" 
              title="Edit"
            >mdi-pencil</v-icon>
            <v-icon 
              class="action-delete-button" 
              @click="confirmDeleteClient(item)" 
              title="Delete"
            >mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

    <EditClientModal
      v-if="editDialog"
      :editDialog.sync="editDialog"
      :editedClient="editedClient"
      :countries="countries"
      @save-changes="handleSaveChanges"
      @cancel-edit="cancelEdit"
    />

    <AddClientModal
      v-if="addDialog"
      :addDialog.sync="addDialog"
      :countries="countries"
      @client-added="fetchClients"
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
import { mapGetters } from 'vuex';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import EditClientModal from './EditClientModal.vue';
import AddClientModal from './AddClientModal.vue';


export default {
  components: {
    EditClientModal,
    AddClientModal,
  },
  data() {
    return {
      showTooltipGoToHome: false,
      showTooltipAddClient: false,
      search: '',
      clients: [],
      editDialog: false,
      addDialog: false,
      deleteDialog: false,
      countries: ['Poland', 'Germany', 'France', 'USA', 'UK', 'Spain', 'Italy', 
      'Canada', 'Australia', 'Japan', 'China', 'Brazil', 'India', 'Russia'],
      editedClient: {
        id: null,
        name: '',
        logo: '',
        country: '',
        email: ''
      },
      clientToDelete: null,
      notyf: new Notyf({
        position: {x: 'center', y:'bottom'},
      })
    };
  },
  computed: {
    headers() {
      const headers = [
        { text: 'Logo', value: 'logo' },
        { text: 'Name', value: 'name' },
        { text: 'Country', value: 'country' },
        { text: 'Email', value: 'email' }
      ];
      
      if (this.isAdmin) {
        headers.push({ text: 'Actions', value: 'actions', sortable: false });
      }

      return headers;
    },
    ...mapGetters(['isAdmin']),
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
          this.notyf.error('Failed to fetch clients.');
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
        this.notyf.success('Client updated successfully.');
      } catch (error) {
        console.error('Error saving changes:', error);
        this.notyf.error('Failed to update client.');
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
        this.notyf.success('Client deleted successfully.');
      } catch (error) {
        console.error('Error deleting client:', error);
        this.notyf.error('Failed to delete client.');
      }
    },
    cancelDelete() {
      this.deleteDialog = false;
    },
    openAddClientModal() {
      this.addDialog = true;
    },
  },
};
</script>
