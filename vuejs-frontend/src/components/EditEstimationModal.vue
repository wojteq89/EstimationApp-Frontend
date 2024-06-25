<template>
  <v-dialog :value="localEditDialog" max-width="500" @input="updateDialog">
    <v-card class="card">
      <v-card-title class="center-content">Edit Estimation</v-card-title>
      <v-card-text>
        <v-text-field v-model="localEditedEstimation.name" label="Name"></v-text-field>
        <v-container class="center-content">
          <v-combobox
              v-model="selectedProjectName"
              :items="projectOptions"
              item-text="name"
              item-value="id"
              label="Project"
              @input="updateProjectId"
            ></v-combobox>
          <v-btn class="button" 
            @click="openAddProjectModal" 
            @mouseover="showTooltipAddProject = true" 
            @mouseleave="showTooltipAddProject = false" 
            style="margin-top: 15px;">
            <v-icon class="button-icon">mdi-plus</v-icon>
            <span v-if="showTooltipAddProject" class="button-text">Add Project</span>
          </v-btn>
        </v-container>
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
                v-model="localEditedEstimation.date"
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
    <AddProjectModal
      v-if="showAddProjectModal"
      :addDialog.sync="showAddProjectModal"
      :clients="clients"
      @client-added="updateProjects"
    />
</v-dialog>
</template>

<script>
import axios from 'axios';
import AddProjectModal from './AddProjectModal.vue';


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
      showTooltipAddProject: false,
      showAddProjectModal: false,
      projects: [],
      clients: [],
      countries: ['Poland', 'Germany', 'France', 'USA', 'UK', 'Spain', 'Italy', 
      'Canada', 'Australia', 'Japan', 'China', 'Brazil', 'India', 'Russia'],
    };
  },
  created() {
    this.fetchProjects();
  },
  components: {
    AddProjectModal,
  },
  watch: {
    editDialog(val) {
      this.localEditDialog = val;
    },
    editedEstimation(val) {
      this.localEditedEstimation = { ...val };
      this.selectedProjectName = val.project_name;
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
    saveChanges() {
      const estimationToSave = {
        ...this.localEditedEstimation,
        project_id: this.selectedProjectId,
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
    openAddProjectModal() {
      this.showAddProjectModal = true;
    },
    async fetchProjects() {
      try {
        const response = await axios.get('http://localhost:8000/api/projects');
        this.projects = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    },
    async updateProjects() {
      try {
        const response = await axios.get('http://localhost:8000/api/projects');
        this.projects = response.data;
        if (response.data.length > 0) {
          this.localSelectedProject = response.data[response.data.length - 1];
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    },
  },
};
</script>
