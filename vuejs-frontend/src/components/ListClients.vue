<template>
  <div class="container">
    <v-data-table
      :headers="headers"
      :items="clients"
      item-key="name"
      class="elevation-1"
      :search="search"
      :custom-filter="filterCaseInsensitive"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Clients</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn @click="goToHome">↩</v-btn>
          <v-btn @click="addClient">Add Client</v-btn>
        </v-toolbar>
        <v-text-field
          v-model="search"
          label="Search Clients"
          class="mx-4"
        ></v-text-field>
      </template>
      <template v-slot:append>
        <tr>
          <td></td>
          <td>
            <v-text-field
              v-model="country"
              label="Country"
            ></v-text-field>
          </td>
          <td>
            <v-text-field
              v-model="email"
              label="Email"
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
      country: '',
      email: '',
      clients: [
        {
          name: 'Client 1',
          description: 'Description 1',
          logo: 'Logo 1',
          country: 'Country 1',
          email: 'email1@example.com',
        },
        {
          name: 'Client 2',
          description: 'Description 2',
          logo: 'Logo 2',
          country: 'Country 2',
          email: 'email2@example.com',
        },
        // Dodaj inne klienty tutaj...
      ],
    }
  },
  computed: {
    headers () {
      return [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Logo', value: 'logo' },
        { text: 'Country', value: 'country' },
        { text: 'Email', value: 'email' },
      ]
    },
  },
  methods: {
    filterCaseInsensitive (value, search) {
      return value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toLowerCase().indexOf(search.toLowerCase()) !== -1
    },
    addClient() {
      this.$router.push('/add-client');
    },
    goToHome() {
      this.$router.push("/home-page")
    }
  },
}
</script>

<style>
.container {
  padding: 25px;
}
</style>
