<template>
  <div class="container">
    <v-data-table
      :headers="headers"
      :items="projects"
      item-key="name"
      class="elevation-1"
      :search="search"
      :custom-filter="filterOnlyCapsText"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Projects</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="goToHome">↩</v-btn>
          <v-btn @click="addProject">Add Project</v-btn>
        </v-toolbar>
        <v-text-field
          v-model="search"
          label="Search Projects (UPPER CASE ONLY)"
          class="mx-4"
        ></v-text-field>
      </template>
      <template v-slot:append>
        <tr>
          <td></td>
          <td>
            <v-text-field
              v-model="client"
              label="Client"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="estimation"
              label="Estimation"
              type="number"
              step="0.01"
            ></v-text-field>
          </td>
          <td colspan="3"></td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
  
<script>
  export default {
    data () {
      return {
        search: '',
        client: '',
        estimation: '',
        projects: [
          {
            name: 'Project 1',
            description: 'Description 1',
            client: 'Client 1',
            estimation: 1000.00,
          },
          {
            name: 'Project 2',
            description: 'Description 2',
            client: 'Client 2',
            estimation: 2000.00,
          },
          // Dodaj inne projekty tutaj...
        ],
      }
    },
    computed: {
      headers () {
        return [
          { text: 'Name', value: 'name' },
          { text: 'Description', value: 'description' },
          { text: 'Client', value: 'client' },
          { text: 'Estimation', value: 'estimation' },
        ]
      },
    },
    methods: {
      filterOnlyCapsText (value, search) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
      },
      addProject() {
        this.$router.push('/add-project');
      },
      goToHome() {
        this.$router.push("/home-page");
      }
    },
  }
</script>

<style>
  .container {
    padding: 25px;
  }
</style>
