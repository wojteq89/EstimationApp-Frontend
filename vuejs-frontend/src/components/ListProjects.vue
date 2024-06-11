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
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.client_name }}</td>
          <td>{{ item.estimation }}</td>
          <td>
            <v-btn @click="editProject(item)">Edit</v-btn>
            <v-btn @click="deleteProject(item)">Delete</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data () {
      return {
        search: '',
        client: '',
        estimation: '',
        projects: []
      }
    },
    computed: {
      headers () {
        return [
          { text: 'Name', value: 'name' },
          { text: 'Description', value: 'description' },
          { text: 'Client', value: 'client_name' },
          { text: 'Estimation', value: 'estimation' },
        ]
      }
    },
    created() {
      this.fetchProjects();
    },
    methods: {
      filterCaseInsensitive (value, search) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toLowerCase().indexOf(search.toLowerCase()) !== -1
      },
      addProject() {
        this.$router.push('/add-project');
      },
      goToHome() {
        this.$router.push("/home-page")
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
      }
    }
  }
</script>

<style>
  .container {
    padding: 25px;
  }
</style>
