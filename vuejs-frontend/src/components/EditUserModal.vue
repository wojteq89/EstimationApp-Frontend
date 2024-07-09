<template>
    <v-dialog v-model="localEditDialog" max-width="500" @click:outside="handleDialogClose">
      <v-card class="card">
        <v-card-title class="center-content">Edit User</v-card-title>
        <v-card-text>
          <v-text-field v-model="localEditedUser.name" label="Nickname" :rules="[v => !!v || 'Nickname is required']"></v-text-field>
          <v-text-field v-model="localEditedUser.email" label="Email" :rules="[v => !!v || 'Email is required']"></v-text-field>
          <v-select
            v-model="localEditedUser.role"
            :items="roles"
            label="Role"
            :rules="[v => !!v || 'Role is required']"
          ></v-select>
        </v-card-text>
        <v-card-actions class="center-content">
          <v-btn class="button" @click="saveChanges">Save</v-btn>
          <v-btn class="button" @click="cancelEdit">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { Notyf } from 'notyf';
  import 'notyf/notyf.min.css';
  
  export default {
    props: {
      editDialog: {
        type: Boolean,
        required: true,
      },
      editedUser: {
        type: Object,
        required: true,
      },
      roles: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        localEditDialog: false,
        localEditedUser: {
          id: null,
          name: '',
          email: '',
          role: '',
        },
        notyf: new Notyf({
          position: { x: 'center', y: 'bottom' },
        }),
      };
    },
    watch: {
      editDialog: {
        immediate: true,
        handler(newVal) {
          this.localEditDialog = newVal;
          if (!newVal) {
            this.resetLocalEditedUser();
          }
        },
      },
      editedUser: {
        immediate: true,
        handler(newVal) {
          this.localEditedUser = { ...newVal };
        },
      },
      localEditDialog(newVal) {
        if (!newVal) {
          this.$emit('update:editDialog', false);
        }
      },
    },
    methods: {
      saveChanges() {
        this.$emit('save-changes', this.localEditedUser);
        this.localEditDialog = false;
      },
      cancelEdit() {
        this.$emit('cancel-edit');
        this.localEditDialog = false;
      },
      handleDialogClose() {
        this.localEditDialog = false;
        this.$emit('update:editDialog', false);
      },
      resetLocalEditedUser() {
        this.localEditedUser = {
          id: null,
          name: '',
          email: '',
          role: '',
        };
      },
    },
  };
  </script>