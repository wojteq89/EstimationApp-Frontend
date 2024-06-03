<template>
    <div>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-data-table :headers="headers" :items="estimations" sort-by="name">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Estimations</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="goToAddEstimation">Add Estimation</v-btn>
                </v-toolbar>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        headers: [
          { text: 'Name', value: 'name' },
          { text: 'Project', value: 'project' },
          { text: 'Client', value: 'client' },
          { text: 'Estimation', value: 'estimation' },
          { text: 'Date', value: 'date' },
          { text: 'Actions', value: 'actions', sortable: false }
        ],
        estimations: []
      };
    },
    mounted() {
      this.fetchEstimations();
    },
    methods: {
      fetchEstimations() {
        // Replace with actual API call
        this.estimations = [
          { id: 1, name: 'Estimation A', project: 'Project A', client: 'Client A', estimation: '10h', date: '2023-05-30' },
          { id: 2, name: 'Estimation B', project: 'Project B', client: 'Client B', estimation: '$500', date: '2023-06-01' }
        ];
      },
      goToAddEstimation() {
        this.$router.push('/add-estimation');
      }
    }
  };
  </script>
  