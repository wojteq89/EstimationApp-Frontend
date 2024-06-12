<template>
  <div class="container">
    <v-data-table
      :headers="headers"
      :items="projects"
      item-key="name"
      class="elevation-1"
      :search="search"
      :custom-filter="filterCaseInsensitive"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Projects</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="goToHome">↩</v-btn>
          <v-btn @click="addProject">Add Project</v-btn>
        </v-toolbar>
        <v-text-field v-model="search" label="Search Projects" class="mx-4"></v-text-field>
      </template>
      <template v-slot:append>
        <tr>
          <td></td>
          <td>
            <v-text-field v-model="client" label="Client"></v-text-field>
          </td>
          <td>
            <v-text-field v-model="estimation" label="Estimation" type="number" step="0.01"></v-text-field>
          </td>
          <td colspan="3"></td>
        </tr>
      </template>
      <template v-slot:item="{ item }">
        <tr class="table-row">
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.client_name }}</td>
          <td>{{ item.estimation }}</td>
          <td>
            <v-btn class="button" @click="editProject(item)">Edit</v-btn>
            <v-btn class="button" @click="confirmDeleteProject(item)">Delete</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>Edit Project</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedProject.name" label="Name"></v-text-field>
          <v-text-field v-model="editedProject.description" label="Description"></v-text-field>
          <v-text-field v-model="editedProject.client_name" label="Client"></v-text-field>
          <v-text-field v-model="editedProject.estimation" label="Estimation" type="number" step="0.01"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn class="button" @click="saveChanges">Save</v-btn>
          <v-btn class="button" @click="cancelEdit">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this project?</v-card-text>
        <v-card-actions>
          <v-btn class="button" @click="deleteProject">Yes</v-btn>
          <v-btn class="button" @click="cancelDelete">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      search: '',
      client: '',
      estimation: '',
      projects: [],
      editDialog: false,
      deleteDialog: false,
      editedProject: {},
      projectToDelete: null,
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Client', value: 'client_name' },
        { text: 'Estimation', value: 'estimation' },
      ];
    },
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    filterCaseInsensitive(value, search) {
      return value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    },
    addProject() {
      this.$router.push('/add-project');
    },
    goToHome() {
      this.$router.push('/home-page');
    },
    fetchProjects() {
      axios.get('http://localhost:8000/api/projects')
        .then(async response => {
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
        })
        .catch(error => {
          console.error('Error fetching projects:', error);
        });
    },
    editProject(project) {
      this.editedProject = { ...project };
      this.editDialog = true;
    },
    async saveChanges() {
      try {
        const projectToSave = {
          ...this.editedProject,
          client_id: this.editedProject.client_id
        };
        await axios.put(`http://localhost:8000/api/projects/${this.editedProject.id}`, projectToSave);
        this.fetchProjects();
        this.editDialog = false;
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    },
    cancelEdit() {
      this.editDialog = false;
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
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    },
    cancelDelete() {
      this.deleteDialog = false;
    },
  },
};
</script>

<style>
.container {
  padding: 25px;
}
.table-row {
  height: 100px;
}
.button {
  margin-bottom: 5px;
}
</style>
