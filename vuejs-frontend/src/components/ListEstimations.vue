<template>
  <div class="list">
    <v-data-table
      :headers="headers"
      :items="estimations"
      item-key="name"
      class="elevation-1 data-table"
      :search="search"
      :custom-filter="filterCaseInsensitive"
    >
      <template v-slot:top>
        <v-toolbar flat class="table-toolbar">
          <v-toolbar-title>Estimations</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn class="button" @click="goToHome" @mouseover="showTooltipGoToHome = true" @mouseleave="showTooltipGoToHome = false">
            <v-icon class="button-icon">mdi-arrow-left</v-icon>
            <span v-if="showTooltipGoToHome" class="button-text">Go to home</span>
          </v-btn>
          <v-btn class="button" @click="openAddEstimationModal" @mouseover="showTooltipAddEstimation = true" @mouseleave="showTooltipAddEstimation = false">
            <v-icon class="button-icon">mdi-plus</v-icon>
            <span v-if="showTooltipAddEstimation" class="button-text">Add Estimation</span>
          </v-btn>
        </v-toolbar>
        <v-text-field v-model="search" label="Search Estimations" class="mx-4"></v-text-field>
      </template>
      
      <template v-slot:item="{ item }">
        <tr class="table-row">
          <td>{{ item.name }}</td>
          <td>{{ item.project_name }}</td>
          <td>{{ item.client_name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.date }}</td>
          <td>
            <v-icon 
              class="action-edit-button" 
              @click="editEstimation(item)"
              title="Edit"
            >mdi-pencil</v-icon>
            <v-icon 
              class="action-delete-button" 
              @click="confirmDeleteEstimation(item)"
              title="Delete"
            >mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>
    
    <EditEstimationModal
      :editDialog.sync="editDialog"
      :editedEstimation="editedEstimation"
      :projects="projects"
      :clients="clients"
      @save-changes="handleSaveChanges"
      @update:editDialog="updateEditDialog"
    />

    <AddEstimationModal
      v-if="addDialog"
      :addDialog.sync="addDialog"
      :projects="projects"
      :clients="clients"
      @estimation-added="handleEstimationAdded"
    />

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card class="card">
        <v-card-title class="center-content">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this estimation? This action will remove it permanently.</v-card-text>
        <v-card-actions class="center-content">
          <v-btn class="button" @click="deleteEstimation">Yes</v-btn>
          <v-btn class="button" @click="cancelDelete">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import EditEstimationModal from './EditEstimationModal.vue';
import AddEstimationModal from './AddEstimationModal.vue';

export default {
  components: {
    EditEstimationModal,
    AddEstimationModal,
  },
  data() {
    return {
      showTooltipGoToHome: false,
      showTooltipAddEstimation: false,
      search: '',
      estimations: [],
      editDialog: false,
      deleteDialog: false,
      editedEstimation: {},
      estimationToDelete: null,
      addDialog: false,
      projects: [],
      clients: [],
      notyf: new Notyf()
    };
  },
  created() {
    this.fetchEstimations();
    this.fetchProjects();
    this.fetchClients();
  },
  computed: {
    headers() {
      return [
        { text: 'Name', value: 'name' },
        { text: 'Project', value: 'project_name' },
        { text: 'Client', value: 'client_name' },
        { text: 'Type', value: 'type' },
        { text: 'Amount', value: 'amount' },
        { text: 'Date', value: 'date' },
        { text: 'Actions', value: 'actions', sortable: false },
      ];
    },
  },
  methods: {
    async fetchEstimations() {
      try {
        const response = await axios.get('http://localhost:8000/api/estimations');
        this.estimations = await Promise.all(response.data.map(async (estimation) => {
          const projectResponse = await axios.get(`http://localhost:8000/api/projects/${estimation.project_id}`);
          const clientResponse = await axios.get(`http://localhost:8000/api/clients/${estimation.client_id}`);
          return {
            ...estimation,
            project_name: projectResponse.data.name,
            client_name: clientResponse.data.name,
          };
        }));
      } catch (error) {
        console.error('Error fetching estimations:', error);
        this.notyf.error('Failed to fetch estimations.');
      }
    },
    async handleEstimationAdded() {
      await this.fetchEstimations();
      this.addDialog = false;
    },
    async editEstimation(estimation) {
      this.editedEstimation = { ...estimation };
      this.editDialog = true;
    },
    async handleSaveChanges(updatedEstimation) {
      try {
        const estimationToSave = {
          ...updatedEstimation,
          project_id: updatedEstimation.project_id,
          client_id: updatedEstimation.client_id,
        };
        await axios.put(`http://localhost:8000/api/estimations/${updatedEstimation.id}`, estimationToSave);
        this.fetchEstimations();
        this.editDialog = false;
        this.notyf.success('Estimation updated successfully.');
      } catch (error) {
        console.error('Error saving changes:', error);
        this.notyf.error('Failed to update estimation.');
      }
    },
    updateEditDialog(val) {
      this.editDialog = val;
    },
    cancelEdit() {
      this.editDialog = false;
    },
    confirmDeleteEstimation(estimation) {
      this.estimationToDelete = estimation;
      this.deleteDialog = true;
    },
    async deleteEstimation() {
      try {
        await axios.delete(`http://localhost:8000/api/estimations/${this.estimationToDelete.id}`);
        const index = this.estimations.findIndex((item) => item.id === this.estimationToDelete.id);
        this.estimations.splice(index, 1);
        this.deleteDialog = false;
        this.notyf.success('Estimation deleted successfully.');
        this.fetchEstimations();
      } catch (error) {
        console.error('Error deleting estimation:', error);
        this.notyf.error('Failed to delete estimation.');
      }
    },
    cancelDelete() {
      this.deleteDialog = false;
    },
    filterCaseInsensitive(value, search) {
      return value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    },
    openAddEstimationModal() {
      this.addDialog = true;
    },
    goToHome() {
      this.$router.push('/home-page');
    },
    async fetchProjects() {
      try {
        const response = await axios.get('http://localhost:8000/api/projects');
        this.projects = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
        this.notyf.error('Failed to fetch projects.');
      }
    },
    async fetchClients() {
      try {
        const response = await axios.get('http://localhost:8000/api/clients');
        this.clients = response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
        this.notyf.error('Failed to fetch clients.');
      }
    },
  },
};
</script>
