<template>
  <div class="list">
    <v-data-table
      :headers="headers"
      :items="filteredProjects"
      item-key="name"
      class="elevation-1 data-table"
      :search="search"
      :custom-filter="filterCaseInsensitive"
    >
      <template v-slot:top>
        <v-toolbar flat class="table-toolbar">
          <v-toolbar-title>Projects</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn class="button" @click="goToHome" @mouseover="showTooltipGoToHome = true" @mouseleave="showTooltipGoToHome = false">
            <v-icon class="button-icon">mdi-arrow-left</v-icon>
            <span v-if="showTooltipGoToHome" class="button-text">Go to home</span>
          </v-btn>
          <v-btn v-if="isAdmin" class="button" @click="openAddProjectModal" @mouseover="showTooltipAddProject = true" @mouseleave="showTooltipAddProject = false">
            <v-icon class="button-icon">mdi-plus</v-icon>
            <span v-if="showTooltipAddProject" class="button-text">Add Project</span>
          </v-btn>
        </v-toolbar>
        <v-text-field v-model="search" label="Search Projects" class="mx-4"></v-text-field>
      </template>
      <template v-slot:append>
        <tr>
          <td></td>
          <td>
            <v-text-field v-model="clientFilter" label="Client"></v-text-field>
          </td>
          <td>
            <v-text-field v-model="estimationFilter" label="Estimation" type="number" step="0.01"></v-text-field>
          </td>
          <td colspan="3"></td>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <tr class="table-row">
          <td>{{ item.name }}</td>
          <td>{{ item.client_name }}</td>
          <td>{{ item.estimation }}</td>
          <td v-if="isAdmin">
            <v-icon 
              class="action-edit-button" 
              @click="editProject(item)"
              title="Edit"
            >mdi-pencil</v-icon>
            <v-icon 
              class="action-delete-button" 
              @click="confirmDeleteProject(item)"
              title="Delete"
            >mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

    <EditProjectModal
      :editDialog.sync="editDialog"
      :editedProject="editedProject"
      :clients="clients"
      @save-changes="handleSaveChanges"
      @update:editDialog="updateEditDialog"
    />

    <AddProjectModal
      v-if="addDialog"
      :addDialog.sync="addDialog"
      :clients="clients"
      @project-added="fetchProjects"
      @update-clients="updateClients"
    />

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card class="card">
        <v-card-title class="center-content">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this project? This will delete all related estimations.</v-card-text>
        <v-card-actions class="center-content">
          <v-btn class="button" @click="deleteProject">Yes</v-btn>
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
import EditProjectModal from './EditProjectModal.vue';
import AddProjectModal from './AddProjectModal.vue';

export default {
  components: {
    EditProjectModal,
    AddProjectModal,
  },
  data() {
    return {
      showTooltipGoToHome: false,
      showTooltipAddProject: false,
      search: '',
      clientFilter: '',
      estimationFilter: '',
      projects: [],
      editDialog: false,
      addDialog: false,
      deleteDialog: false,
      editedProject: {},
      projectToDelete: null,
      clients: [],
      notyf: new Notyf({
        position: {x: 'center', y:'bottom'},
      })
    };
  },
  computed: {
    headers() {
      const headers = [
        { text: 'Name', value: 'name' },
        { text: 'Client', value: 'client_name' },
        { text: 'Estimation', value: 'estimation' },
      ];
      
      if (this.isAdmin) {
        headers.push({ text: 'Actions', value: 'actions', sortable: false });
      }

      return headers;
    },

    filteredProjects() {
      let filtered = this.projects;

      if (this.search) {
        filtered = filtered.filter(item => this.filterCaseInsensitive(item.name, this.search) ||
                                          this.filterCaseInsensitive(item.client_name, this.search) ||
                                          this.filterCaseInsensitive(item.estimation.toString(), this.search));
      }

      if (this.clientFilter) {
        filtered = filtered.filter(item => this.filterCaseInsensitive(item.client_name, this.clientFilter));
      }

      if (this.estimationFilter) {
        filtered = filtered.filter(item => parseFloat(item.estimation) === parseFloat(this.estimationFilter));
      }

      return filtered;
    },
    ...mapGetters(['isAdmin']),
  },
  created() {
    this.fetchProjects();
    this.fetchClients();
  },
  methods: {
    filterCaseInsensitive(value, search) {
      return value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    },
    async fetchProjects() {
      try {
        const response = await axios.get('http://localhost:8000/api/projects');
        let projects = response.data;
        const clientRequests = projects.map(project => {
          return axios.get(`http://localhost:8000/api/clients/${project.client_id}`);
        });

        const clientResponses = await Promise.all(clientRequests);
        projects = projects.map((project, index) => {
          const estimation = parseFloat(project.estimation);
          return { ...project, client_name: clientResponses[index].data.name, estimation };
        });

        this.projects = projects;
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
    updateClients(newClients) {
      this.clients = newClients;
    },
    goToHome() {
      this.$router.push('/home-page');
    },
    editProject(project) {
      this.editedProject = { ...project };
      this.editDialog = true;
    },
    async handleSaveChanges(updatedProject) {
      try {
        const projectToSave = {
          ...updatedProject,
          client_id: updatedProject.client_id
        };
        await axios.put(`http://localhost:8000/api/projects/${updatedProject.id}`, projectToSave);
        this.fetchProjects();
        this.editDialog = false;
        this.notyf.success('Project updated successfully.');
      } catch (error) {
        console.error('Error saving changes:', error);
        this.notyf.error('Failed to update project.');
      }
    },
    updateEditDialog(val) {
      this.editDialog = val;
    },
    confirmDeleteProject(project) {
      this.projectToDelete = project;
      this.deleteDialog = true;
    },
    async deleteProject() {
      try {
        await axios.delete(`http://localhost:8000/api/projects/${this.projectToDelete.id}`);
        this.fetchProjects();
        this.deleteDialog = false;
        this.notyf.success('Project deleted successfully.');
      } catch (error) {
        console.error('Error deleting project:', error);
        this.notyf.error('Failed to delete project.');
      }
    },
    cancelDelete() {
      this.deleteDialog = false;
    },
    openAddProjectModal() {
      this.addDialog = true;
    },
  },
};
</script>
