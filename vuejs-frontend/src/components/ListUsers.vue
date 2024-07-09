<template>
  <div class="list">
    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      item-key="id"
      class="elevation-1 data-table"
      :search="search"
      :custom-filter="filterCaseInsensitive"
    >
      <template v-slot:top>
        <v-toolbar flat class="table-toolbar">
          <v-toolbar-title>Registered Users</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn class="button" @click="goToHome" @mouseover="showTooltipGoToHome = true" @mouseleave="showTooltipGoToHome = false">
            <v-icon class="button-icon">mdi-arrow-left</v-icon>
            <span v-if="showTooltipGoToHome" class="button-text">Go to home</span>
          </v-btn>
        </v-toolbar>
        <v-text-field v-model="search" label="Search Users" class="mx-4"></v-text-field>
      </template>

      <template v-slot:item="{ item }">
        <tr class="table-row">
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.role }}</td>
          <td>
            <v-icon
              class="action-edit-button"
              @click="editUser(item)"
              title="Edit"
            >mdi-pencil</v-icon>
            <v-icon
              class="action-delete-button"
              @click="confirmDeleteUser(item)"
              title="Delete"
            >mdi-delete</v-icon>
          </td>
        </tr>
      </template>
    </v-data-table>

    <EditUserModal
      v-if="editDialog"
      :editDialog.sync="editDialog"
      :editedUser="editedUser"
      :roles="roles"
      @save-changes="handleSaveChanges"
      @cancel-edit="cancelEdit"
    />

    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card class="card">
        <v-card-title class="center-content">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this user? This action cannot be undone.</v-card-text>
        <v-card-actions class="center-content">
          <v-btn class="button" @click="deleteUser">Yes</v-btn>
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
import EditUserModal from './EditUserModal.vue';

export default {
  components: {
    EditUserModal,
  },
  data() {
    return {
      showTooltipGoToHome: false,
      search: '',
      users: [],
      editDialog: false,
      deleteDialog: false,
      roles: ['user', 'admin'],
      editedUser: {
        id: null,
        name: '',
        email: '',
        role: ''
      },
      userToDelete: null,
      notyf: new Notyf({
        position: { x: 'center', y: 'bottom' },
      }),
    };
  },
  computed: {
    headers() {
      return [
        { text: 'Nickname', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'role' },
        { text: 'Actions', value: 'actions', sortable: false },
      ];
    },
    filteredUsers() {
      let filtered = this.users;

      if (this.search) {
        filtered = filtered.filter(item =>
          this.filterCaseInsensitive(item.name, this.search) ||
          this.filterCaseInsensitive(item.email, this.search) ||
          this.filterCaseInsensitive(item.role, this.search)
        );
      }

      return filtered;
    },
    ...mapGetters(['isAdmin']),
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    filterCaseInsensitive(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toLowerCase().indexOf(search.toLowerCase()) !== -1
      );
    },
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:8000/api/users');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
        this.notyf.error('Failed to fetch users.');
      }
    },
    goToHome() {
      this.$router.push('/home-page');
    },
    editUser(user) {
      this.editedUser = { ...user };
      this.editDialog = true;
    },
    async handleSaveChanges(updatedUser) {
      try {
        await axios.put(`http://localhost:8000/api/users/${updatedUser.id}`, updatedUser);
        this.fetchUsers();
        this.editDialog = false;
        this.notyf.success('User updated successfully.');
      } catch (error) {
        console.error('Error saving changes:', error);
        this.notyf.error('Failed to update user.');
      }
    },
    cancelEdit() {
      this.editDialog = false;
    },
    confirmDeleteUser(user) {
      this.userToDelete = user;
      this.deleteDialog = true;
    },
    async deleteUser() {
      try {
        await axios.delete(`http://localhost:8000/api/users/${this.userToDelete.id}`);
        this.fetchUsers();
        this.deleteDialog = false;
        this.notyf.success('User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
        this.notyf.error('Failed to delete user.');
      }
    },
    cancelDelete() {
      this.deleteDialog = false;
    },
  },
};
</script>
