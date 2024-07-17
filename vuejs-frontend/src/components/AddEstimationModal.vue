<template>
  <v-dialog v-model="localAddDialog" max-width="500" @click:outside="cancel">
    <v-card class="card">
      <v-card-title class="center-content">Add Estimation</v-card-title>
      <v-card-text>
        <v-container>
          <v-form @submit.prevent="addEstimation">
            <v-text-field 
              v-model="localName" 
              label="Estimation Name" 
              required 
              :rules="[v => !!v || 'Estimation Name is required']"
            ></v-text-field>
            <v-container class="center-content">
              <v-combobox
                v-model="localSelectedProject"
                :items="projectOptions"
                item-text="name"
                item-value="id"
                label="Project"
                required
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
                  :rules="[v => !!v || 'Date is required']"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="localDate"
                @input="menu = false"
              ></v-date-picker>
            </v-menu>
            <v-text-field
              v-model="localAmount"
              label="Amount"
              type="number"
              step="1"
              required
              :rules="[v => !!v || 'Amount is required', v => v > 0 || 'Amount must be positive']"
            ></v-text-field>
            <v-combobox 
              v-model="localType" 
              :items="['hourly', 'fixed']" 
              label="Type" 
              required
              :rules="[v => !!v || 'Type is required']"
            ></v-combobox>
            <v-textarea v-model="localDescription" label="Description"></v-textarea>
            <v-container class="center-content">
              <v-btn type="submit" class="button">Add</v-btn>
              <v-btn class="button" @click="cancel">Cancel</v-btn>
            </v-container>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
    <AddProjectModal
      v-if="showAddProjectModal"
      :addDialog.sync="showAddProjectModal"
      @project-added="handleProjectAdded"
    />
  </v-dialog>
</template>

<script>
import axiosInstance from '@/axiosAuthConfig';
import AddProjectModal from './AddProjectModal.vue';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default {
  props: {
    addDialog: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      localAddDialog: false,
      localName: '',
      localDescription: '',
      localSelectedProject: null,
      localDate: new Date().toISOString().substr(0, 10),
      localType: '',
      localAmount: 0,
      menu: false,
      showTooltipAddProject: false,
      showAddProjectModal: false,
      projects: [],
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
    addDialog: {
      immediate: true,
      handler(newVal) {
        this.localAddDialog = newVal;
        if (!newVal) {
          this.resetForm();
        }
      }
    }
  },
  computed: {
    projectOptions() {
      return this.projects.map(project => ({
        id: project.id,
        name: project.name
      }));
    },
  },
  methods: {
    addEstimation() {
      if (!this.localName || !this.localSelectedProject || !this.localDate || !this.localType || !this.localAmount) {
        this.notyf.error('Please fill in all required fields.');
        return;
      }

      const estimationData = {
        name: this.localName,
        description: this.localDescription,
        project_id: this.localSelectedProject.id,
        date: this.localDate,
        type: this.localType,
        amount: this.localAmount
      };

      axiosInstance.post('/estimations', estimationData)
        .then(response => {
          console.log('Estimation added:', response.data);
          this.notyf.success('Estimation added successfully.');
          this.$emit('estimation-added');
          this.localAddDialog = false;
          this.resetForm();
        })
        .catch(error => {
          console.error('Error adding estimation:', error.response ? error.response.data : error.message);
          this.notyf.error(error.response?.data?.message || 'Failed to add estimation.');
        });
    },
    resetForm() {
      this.localName = '';
      this.localDescription = '';
      this.localSelectedProject = null;
      this.localDate = new Date().toISOString().substr(0, 10);
      this.localType = '';
      this.localAmount = 0;
    },
    cancel() {
      this.localAddDialog = false;
      this.$emit('update:addDialog', false);
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
        if (response.data.length > 0) {
          this.localSelectedProject = response.data[response.data.length - 1];
        }
      } catch (error) {
        console.error('Error updating projects:', error);
        this.notyf.error('Failed to update projects.');
      }
    },
    handleProjectAdded() {
      this.updateProjects();
      this.showAddProjectModal = false;
    },
  }
};
</script>
