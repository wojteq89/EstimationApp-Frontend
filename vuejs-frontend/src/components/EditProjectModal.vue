<template>
  <v-dialog :value="localEditDialog" max-width="500" @input="updateDialog">
    <v-card class="card">
      <v-card-title class="center-content">Edit Project</v-card-title>
      <v-card-text>
        <v-text-field v-model="localEditedProject.name" label="Name"></v-text-field>
        <v-container class="center-content">
          <v-combobox
            v-model="selectedClientName"
            :items="clientOptions.map(client => client.name)"
            label="Client"
            @change="updateClient"
            required  
          ></v-combobox>
          <v-btn class="button" 
              @click="openAddClientModal" 
              @mouseover="showTooltipAddClient = true" 
              @mouseleave="showTooltipAddClient = false" 
              style="margin-top: 15px;">
              <v-icon class="button-icon">mdi-plus</v-icon>
              <span v-if="showTooltipAddClient" class="button-text">Add Client</span>
          </v-btn>
        </v-container>
        <v-text-field v-model="localEditedProject.description" label="Description"></v-text-field>
      </v-card-text>
      <v-card-actions class="center-content">
        <v-btn class="button" @click="saveChanges">Save</v-btn>
        <v-btn class="button" @click="cancelEdit">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <AddClientModal
      v-if="showAddClientModal"
      :addDialog.sync="showAddClientModal"
      :countries="countries"
      @client-added="updateClients"
    />
  </v-dialog>
</template>

<script>
import axios from 'axios';
import AddClientModal from './AddClientModal.vue';

export default {
  name: 'EditProjectModal',
  props: {
    editDialog: {
      type: Boolean,
      required: true
    },
    editedProject: {
      type: Object,
      required: true
    },
  },
  components: {
    AddClientModal,
  },
  data() {
    return {
      localEditDialog: this.editDialog,
      localEditedProject: { ...this.editedProject },
      selectedClientName: this.editedProject.client_name,
      showTooltipAddClient: false,
      showAddClientModal: false,
      countries: ['Poland', 'Germany', 'France', 'USA', 'UK', 'Spain', 'Italy', 
      'Canada', 'Australia', 'Japan', 'China', 'Brazil', 'India', 'Russia'],
      clients: [],
    };
  },
  created() {
    this.fetchClients();
  },
  watch: {
    editDialog(val) {
      this.localEditDialog = val;
    },
    editedProject(val) {
      this.localEditedProject = { ...val };
      this.selectedClientName = val.client_name;
    }
  },
  computed: {
    clientOptions() {
      return this.clients.map(client => ({
        id: client.id,
        name: client.name
      }));
    }
  },
  methods: {
    updateDialog(val) {
      this.$emit('update:editDialog', val);
    },
    updateClient(selectedClientName) {
      console.log('Selected client:', selectedClientName);

      const client = this.clients.find(c => c.name === selectedClientName);
      console.log('Found client:', client);

      if (client) {
        this.localEditedProject.client_id = client.id;
        console.log('Updated client_id:', this.localEditedProject.client_id);
      }
    },
    saveChanges() {
      axios.put(`http://localhost:8000/api/projects/${this.localEditedProject.id}`, this.localEditedProject)
        .then(response => {
          console.log('Project updated:', response.data);
          this.$emit('save-changes', this.localEditedProject);
          this.updateDialog(false);
        })
        .catch(error => {
          console.error('Error updating project:', error);
          if (error.response) {
            console.error('Server responded with:', error.response.data);
          }
        });
    },
    cancelEdit() {
      this.updateDialog(false);
    },
    openAddClientModal() {
      this.showAddClientModal = true;
    },
    async fetchClients() {
      try {
        const response = await axios.get('http://localhost:8000/api/clients');
        this.clients = response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    },
    async updateClients() {
      try {
        const response = await axios.get('http://localhost:8000/api/clients');
        this.clients = response.data;
        if (response.data.length > 0) {
          this.localSelectedClient = response.data[response.data.length - 1]; // Ustawienie wybranego klienta na ostatniego dodanego
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    }
  }
};
</script>
