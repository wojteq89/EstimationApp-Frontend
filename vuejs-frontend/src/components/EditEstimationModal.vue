<template>
  <v-dialog :value="localEditDialog" max-width="500" @input="updateDialog">
    <v-card class="card">
      <v-card-title class="center-content">Edit Estimation</v-card-title>
      <v-card-text>
        <v-text-field v-model="localEditedEstimation.name" label="Name" :rules="[v => !!v || 'Name is required']"></v-text-field>
        <v-container class="center-content">
          <v-combobox
            v-model="selectedProjectName"
            :items="projectOptions"
            item-text="name"
            item-value="id"
            label="Project"
            @input="updateProjectId"
            :rules="[v => !!v || 'Project is required']"
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
          :rules="[v => !!v || 'Type is required']"
        ></v-combobox>
        <v-text-field v-model="localEditedEstimation.amount" label="Amount" :rules="[v => !!v || 'Amount is required']"></v-text-field>
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
      @project-added="updateProjects"
    />
  </v-dialog>
</template>

<script>
import axiosInstance from '@/axiosAuthConfig';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
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
      selectedProjectId: null,
      menu: false,
      showTooltipAddProject: false,
      showAddProjectModal: false,
      projects: [],
      clients: [],
      countries: ['Poland', 'Germany', 'France', 'USA', 'UK', 'Spain', 'Italy', 
      'Canada', 'Australia', 'Japan', 'China', 'Brazil', 'India', 'Russia'],
      notyf: new Notyf({
        position: {x: 'center', y:'bottom'},
      })
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
      const selectedProject = this.projects.find(p => p.name === this.selectedProjectName.__ob__.value.name);
      
      if (selectedProject) {
        this.selectedProjectId = selectedProject.id;
        this.$set(this.localEditedEstimation, 'project_id', selectedProject.id);
      }
    },
    saveChanges() {
      if (!this.localEditedEstimation.name || !this.localEditedEstimation.type || !this.localEditedEstimation.amount) {
        this.notyf.error('Please fill in all required fields.');
        return;
      }

      const estimationToSave = {
        ...this.localEditedEstimation,
        project_id: this.selectedProjectId,
      };

      axiosInstance.put(`/estimations/${this.localEditedEstimation.id}`, estimationToSave)
        .then(() => {
          this.notyf.success('Estimation updated successfully.');
          this.$emit('save-changes', this.localEditedEstimation);
          this.updateDialog(false);
        })
        .catch(error => {
          console.error('Error updating estimation:', error);
          this.notyf.error('Failed to update estimation.');
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
        const response = await axiosInstance.get('/projects');
        this.projects = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
        this.notyf.error('Failed to fetch projects.');
      }
    },
    async updateProjects() {
      try {
        const response = await axiosInstance.get('/projects');
        this.projects = response.data;
      } catch (error) {
        console.error('Error fetching projects:', error);
        this.notyf.error('Failed to update projects.');
      }
    },
  },
};
</script>
