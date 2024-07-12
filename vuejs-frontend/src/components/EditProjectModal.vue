<template>
  <v-dialog :value="localEditDialog" max-width="500" @input="updateDialog">
    <v-card class="card">
      <v-card-title class="center-content">Edit Project</v-card-title>
      <v-card-text>
        <v-text-field 
        v-model="localEditedProject.name" 
        label="Name"
        :rules="[v => !!v || 'Project name is required']"
        ></v-text-field>
        <v-container class="center-content">
          <v-combobox
            v-model="selectedClientName"
            :items="clientOptions.map(client => client.name)"
            label="Client"
            @change="updateClient"
            :rules="[v => !!v || 'Client is required']"
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
import axiosInstance from '@/config';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
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
      notyf: new Notyf({
        position: {x: 'center', y:'bottom'},
      })
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
      const client = this.clients.find(c => c.name === selectedClientName);

      if (client) {
        this.localEditedProject.client_id = client.id;
        this.notyf.success('Client updated successfully.');
      }
    },
    saveChanges() {
      axiosInstance.put(`/projects/${this.localEditedProject.id}`, this.localEditedProject)
        .then(() => {
          this.notyf.success('Project updated successfully.');
          this.$emit('save-changes', this.localEditedProject);
          this.updateDialog(false);
        })
        .catch(error => {
          console.error('Error updating project:', error);
          this.notyf.error('Failed to update project.');
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
        const response = await axiosInstance.get('/clients');
        this.clients = response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
        this.notyf.error('Failed to fetch clients.');
      }
    },
    async updateClients() {
      try {
        const response = await axiosInstance.get('/clients');
        this.clients = response.data;
        if (response.data.length > 0) {
          this.localSelectedClient = response.data[response.data.length - 1];
        }
        this.notyf.success('Clients updated successfully.');
      } catch (error) {
        console.error('Error updating clients:', error);
        this.notyf.error('Failed to update clients.');
      }
    }
  }
};
</script>
