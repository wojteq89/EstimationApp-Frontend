<template>
    <v-dialog v-model="localAddDialog" max-width="500" @click:outside="cancel">
      <v-card class="card">
        <v-card-title class="center-content">Add User</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="localUser.name"
            label="Nickname"
            required
            :rules="[v => !!v || 'Nickname is required']"
          ></v-text-field>
          <v-text-field
            v-model="localUser.email"
            label="Email"
            required
            :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
          ></v-text-field>
          <v-select
            v-model="localUser.role"
            :items="roles"
            label="Role"
            required
            :rules="[v => !!v || 'Role is required']"
          ></v-select>
        </v-card-text>
        <v-text>Default password is: "Password123"</v-text>
        <v-card-actions class="center-content">
          <v-btn class="button" @click="addUser">Add</v-btn>
          <v-btn class="button" @click="cancel">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import axios from 'axios';
  import { Notyf } from 'notyf';
  import 'notyf/notyf.min.css';
  
  export default {
    props: {
      addDialog: {
        type: Boolean,
        required: true
      },
      roles: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        localAddDialog: false,
        localUser: {
          name: '',
          email: '',
          password: 'Password123',
          role: '',
        },
        notyf: new Notyf({
          position: {x: 'center', y:'bottom'},
        })
      };
    },
    watch: {
      addDialog: {
        immediate: true,
        handler(newVal) {
          this.localAddDialog = newVal;
          if (!newVal) {
            this.resetForm();
          }
        }
      },
      localAddDialog(newVal) {
        if (!newVal) {
          this.$emit('update:addDialog', false);
        }
      }
    },
    methods: {
      addUser() {
        if (!this.localUser.name || !this.localUser.email || !this.localUser.role) {
          this.notyf.error('Please fill in all required fields.');
          return;
        }
  
        axios.post('http://localhost:8000/api/users', this.localUser)
          .then(response => {
            console.log('User added:', response.data);
            this.notyf.success('User added successfully.');
            this.resetForm();
            this.$emit('user-added');
          })
          .catch(error => {
            console.error('Error adding user:', error);
            const errorMessage = error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Failed to add user.';
            this.notyf.error(errorMessage);
          });
      },
      resetForm() {
        this.localUser = {
          name: '',
          email: '',
          role: '',
        };
      },
      cancel() {
        this.localAddDialog = false;
        this.$emit('update:addDialog', false);
      }
    }
  };
  </script>