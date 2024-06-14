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
          <v-btn class="button" @click="goToHome">↩</v-btn>
          <v-btn class="button" @click="addEstimation">Add Estimation</v-btn>
        </v-toolbar>
        <v-text-field v-model="search" label="Search Estimations" class="mx-4"></v-text-field>
      </template>
      
      <template v-slot:item="{ item }">
        <tr class="table-row">
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.project_name }}</td>
          <td>{{ item.client_name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.date }}</td>
          <td>
            <v-btn class="button" @click="editEstimation(item)">Edit</v-btn>
            <v-btn class="button" @click="deleteEstimation(item)">Delete</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>Edit Estimation</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedEstimation.name" label="Name"></v-text-field>
          <v-text-field v-model="editedEstimation.description" label="Description"></v-text-field>
          <v-text-field v-model="editedEstimation.project_name" label="Project"></v-text-field>
          <v-text-field v-model="editedEstimation.client_name" label="Client"></v-text-field>
          <v-text-field v-model="editedEstimation.type" label="Type"></v-text-field>
          <v-text-field v-model="editedEstimation.amount" label="Amount"></v-text-field>
          <v-text-field v-model="editedEstimation.date" label="Date"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn class="button" @click="saveChanges">Save</v-btn>
          <v-btn class="button" @click="cancelEdit">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      search: '',
      estimations: [],
      editDialog: false,
      editedEstimation: {},
    }
  },
  created() {
    this.fetchEstimations();
  },
  computed: {
    headers () {
      return [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Project', value: 'project_name' },
        { text: 'Client', value: 'client_name' },
        { text: 'Type', value: 'type' },
        { text: 'Amount', value: 'amount' },
        { text: 'Date', value: 'date' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  methods: {
    async fetchEstimations() {
      try {
        const response = await axios.get('http://localhost:8000/api/estimations');
        this.estimations = await Promise.all(response.data.map(async estimation => {
          const projectResponse = await axios.get(`http://localhost:8000/api/projects/${estimation.project_id}`);
          const clientResponse = await axios.get(`http://localhost:8000/api/clients/${estimation.client_id}`);
          return {
            ...estimation,
            project_name: projectResponse.data.name,
            client_name: clientResponse.data.name
          };
        }));
      } catch (error) {
        console.error('Error fetching estimations:', error);
      }
    },
    async editEstimation(estimation) {
      this.editedEstimation = { ...estimation };
      this.editDialog = true;
    },
    async saveChanges() {
      try {
        const estimationToSave = {
          ...this.editedEstimation,
          project_id: this.editedEstimation.project_id,
          client_id: this.editedEstimation.client_id
        };
        await axios.put(`http://localhost:8000/api/estimations/${this.editedEstimation.id}`, estimationToSave);
        this.fetchEstimations();
        this.editDialog = false;
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    },
    cancelEdit() {
      this.editDialog = false;
    },
    async deleteEstimation(estimation) {
      try {
        await axios.delete(`http://localhost:8000/api/estimations/${estimation.id}`);
        const index = this.estimations.findIndex(item => item.id === estimation.id);
        this.estimations.splice(index, 1);
      } catch (error) {
        console.error('Error deleting estimation:', error);
      }
    },
    filterCaseInsensitive(value, search) {
      return value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toLowerCase().indexOf(search.toLowerCase()) !== -1
    },
    addEstimation() {
      this.$router.push('/add-estimation');
    },
    goToHome() {
      this.$router.push("/home-page");
    }
  }
}
</script>

<style scoped>

.list {
  padding: 20px;
}
.table-toolbar {
  background-color: #EDE8F5 !important;
  color: #48599a !important;
}
.data-table {
  border-radius: 50px !important;
  background-color: #EDE8F5 !important;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1), -4px 4px 8px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px
}
.v-data-table {
  border-radius: 50px !important;
}
.table-row {
  height: 100px;
}
.button {
  margin-bottom: 5px;
}
.logo {
  border-radius: 30px;
}
.editLogo {
  border-radius: 30px;
  height: 250px;
}
</style>
