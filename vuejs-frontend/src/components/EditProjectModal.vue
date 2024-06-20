<template>
  <v-dialog :value="localEditDialog" max-width="500" @input="updateDialog">
    <v-card class="card">
      <v-card-title class="center-content">Edit Project</v-card-title>
      <v-card-text>
        <v-text-field v-model="localEditedProject.name" label="Name"></v-text-field>
        <v-combobox
          v-model="selectedClientName"
          :items="clientOptions.map(client => client.name)"
          label="Client"
          @change="updateClient"
          required
        ></v-combobox>
        <v-text-field v-model="localEditedProject.description" label="Description"></v-text-field>
      </v-card-text>
      <v-card-actions class="center-content">
        <v-btn class="button" @click="saveChanges">Save</v-btn>
        <v-btn class="button" @click="cancelEdit">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditProjectModal',
  props: {
    editDialog: {
      type: Boolean,
      required: true
    },
    editedProject: {
      type: Object,
      required: true
    },
    clients: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localEditDialog: this.editDialog,
      localEditedProject: { ...this.editedProject },
      selectedClientName: this.editedProject.client_name
    };
  },
  watch: {
    editDialog(val) {
      this.localEditDialog = val;
    },
    editedProject(val) {
      this.localEditedProject = { ...val };
      this.selectedClientName = val.client_name; // Update selectedClientName when editedProject changes
    }
  },
  computed: {
    clientOptions() {
      return this.clients.map(client => ({
        id: client.id,
        name: client.name
      }));
    }
  },
  methods: {
    updateDialog(val) {
      this.$emit('update:editDialog', val);
    },
    updateClient(selectedClientName) {
      console.log('Selected client:', selectedClientName);

      // Find the client object based on selected client_name
      const client = this.clients.find(c => c.name === selectedClientName);
      console.log('Found client:', client);

      if (client) {
        // Update localEditedProject with the selected client's id
        this.localEditedProject.client_id = client.id;
        console.log('Updated client_id:', this.localEditedProject.client_id);
      }
    },
    saveChanges() {
      axios.put(`http://localhost:8000/api/projects/${this.localEditedProject.id}`, this.localEditedProject)
        .then(response => {
          console.log('Project updated:', response.data);
          this.$emit('save-changes', this.localEditedProject);
          this.updateDialog(false);
        })
        .catch(error => {
          console.error('Error updating project:', error);
          if (error.response) {
            console.error('Server responded with:', error.response.data);
          }
        });
    },
    cancelEdit() {
      this.updateDialog(false);
    }
  }
};
</script>
