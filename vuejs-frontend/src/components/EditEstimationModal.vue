<template>
  <v-dialog :value="localEditDialog" max-width="500" @input="updateDialog">
    <v-card class="card">
      <v-card-title class="center-content">Edit Estimation</v-card-title>
      <v-card-text>
        <v-text-field v-model="localEditedEstimation.name" label="Name"></v-text-field>
        <v-combobox
          v-model="selectedProjectName"
          :items="projectOptions.map(project => project.name)"
          label="Project"
          @input="updateProjectId"
        ></v-combobox>
        <v-combobox
          v-model="selectedClientName"
          :items="clientOptions.map(client => client.name)"
          label="Client"
          @input="updateClientId"
        ></v-combobox>
        <v-combobox 
          v-model="localEditedEstimation.type" 
          :items="['hourly', 'fixed']" 
          label="Type" 
          required
        ></v-combobox>
        <v-text-field v-model="localEditedEstimation.amount" label="Amount"></v-text-field>
        <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="localDate"
                label="Date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="localEditedEstimation.date"
              @input="menu = false"
              label="Date"
            ></v-date-picker>
          </v-menu>
        <v-text-field v-model="localEditedEstimation.description" label="Description"></v-text-field>
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
  name: 'EditEstimationModal',
  props: {
    editDialog: {
      type: Boolean,
      required: true,
    },
    editedEstimation: {
      type: Object,
      required: true,
    },
    projects: {
      type: Array,
      required: true,
    },
    clients: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      localEditDialog: this.editDialog,
      localEditedEstimation: { ...this.editedEstimation },
      selectedProjectName: null,
      selectedClientName: null,
      selectedProjectId: null,
      selectedClientId: null,
      menu: false,
    };
  },
  watch: {
    editDialog(val) {
      this.localEditDialog = val;
    },
    editedEstimation(val) {
      this.localEditedEstimation = { ...val };
      this.selectedProjectName = val.project_name;
      this.selectedClientName = val.client_name;
      this.selectedProjectId = val.project_id;
      this.selectedClientId = val.client_id;
    },
  },
  computed: {
    projectOptions() {
      return this.projects.map(project => ({
        id: project.id,
        name: project.name,
      }));
    },
    clientOptions() {
      return this.clients.map(client => ({
        id: client.id,
        name: client.name,
      }));
    },
  },
  methods: {
    updateDialog(val) {
      this.$emit('update:editDialog', val);
    },
    updateProjectId() {
      const selectedProject = this.projects.find(p => p.name === this.selectedProjectName);
      if (selectedProject) {
        this.selectedProjectId = selectedProject.id;
        this.localEditedEstimation.project_id = selectedProject.id;
      }
    },
    updateClientId() {
      const selectedClient = this.clients.find(c => c.name === this.selectedClientName);
      if (selectedClient) {
        this.selectedClientId = selectedClient.id;
        this.localEditedEstimation.client_id = selectedClient.id;
      }
    },
    saveChanges() {
      const estimationToSave = {
        ...this.localEditedEstimation,
        project_id: this.selectedProjectId,
        client_id: this.selectedClientId,
      };
      console.log('Saving estimation:', estimationToSave);

      axios.put(`http://localhost:8000/api/estimations/${this.localEditedEstimation.id}`, estimationToSave)
        .then(response => {
          console.log('Estimation updated:', response.data);
          this.$emit('save-changes', this.localEditedEstimation);
          this.updateDialog(false);
        })
        .catch(error => {
          console.error('Error updating estimation:', error);
          if (error.response) {
            console.error('Server responded with:', error.response.data);
          }
        });
    },
    cancelEdit() {
      this.updateDialog(false);
    },
  },
};
</script>
