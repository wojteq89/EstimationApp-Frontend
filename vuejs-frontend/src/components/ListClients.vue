<template>
    <div>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-data-table :headers="headers" :items="clients" sort-by="name">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Clients</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="goToAddClient">Add Client</v-btn>
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
          { text: 'Actions', value: 'actions', sortable: false }
        ],
        clients: []
      };
    },
    mounted() {
      this.fetchClients();
    },
    methods: {
      fetchClients() {
        // Replace with actual API call
        this.clients = [
          { id: 1, name: 'Client A' },
          { id: 2, name: 'Client B' },
          { id: 3, name: 'Client C' }
        ];
      },
      goToAddClient() {
        this.$router.push('/add-client');
      }
    }
  };
  </script>
  