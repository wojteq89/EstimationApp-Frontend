<template>
  <div class="container">
    <v-data-table
      :headers="headers"
      :items="estimations"
      item-key="name"
      class="elevation-1"
      :search="search"
      :custom-filter="filterCaseInsensitive"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Estimations</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="goToHome">↩</v-btn>
          <v-btn @click="addEstimation">Add Estimation</v-btn>
        </v-toolbar>
        <v-text-field
          v-model="search"
          label="Search Estimations"
          class="mx-4"
        ></v-text-field>
      </template>
      <template v-slot:append>
        <tr>
          <td></td>
          <td>
            <v-text-field
              v-model="project"
              label="Project"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="client"
              label="Client"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="amount"
              label="Amount"
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
      project: '',
      client: '',
      amount: '',
      estimations: [],
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
        { text: 'Project', value: 'project' },
        { text: 'Client', value: 'client' },
        { text: 'Type', value: 'type' },
        { text: 'Amount', value: 'amount' },
        { text: 'Date', value: 'date' },
      ]
    },
  },
  methods: {
    fetchEstimations() {
      fetch('/api/estimations')
        .then(response => response.json())
        .then(data => {
          this.estimations = data;
        })
        .catch(error => {
          console.error('Error fetching estimations:', error);
        });
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
  },
}
</script>

<style>
.container {
  padding: 25px;
}
</style>
