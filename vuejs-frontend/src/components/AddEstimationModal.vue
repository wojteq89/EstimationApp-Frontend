<template>
  <v-dialog v-model="localAddDialog" max-width="600" @click:outside="cancel">
    <v-card class="card">
      <v-card-title class="center-content">Add Estimation</v-card-title>
      <v-card-text>
        <v-container>
          <v-form @submit.prevent="addEstimation">
            <v-text-field v-model="localName" label="Estimation Name" required></v-text-field>
            <v-container class="center-content">
              <v-combobox
                v-model="localSelectedProject"
                :items="projectOptions"
                item-text="name"
                item-value="id"
                label="Project"
                required
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
            ></v-text-field>
            <v-combobox 
              v-model="localType" 
              :items="['hourly', 'fixed']" 
              label="Type" 
              required
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
import axios from 'axios';
import AddProjectModal from './AddProjectModal.vue';

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
        this.$notify({
          title: 'Error',
          text: 'Please fill in all required fields.',
          type: 'error'
        });
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

      axios.post('http://localhost:8000/api/estimations', estimationData)
        .then(response => {
          console.log('Estimation added:', response.data);
          this.$notify({
            title: 'Success',
            text: 'Estimation added successfully.',
            type: 'success'
          });
          this.$emit('estimation-added');
          this.localAddDialog = false;
          this.resetForm();
        })
        .catch(error => {
          console.error('Error adding estimation:', error.response ? error.response.data : error.message);
          this.$notify({
            title: 'Error',
            text: error.response?.data?.message || 'Failed to add estimation.',
            type: 'error'
          });
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
        console.error('Error fetching projects:', error);
      }
    },
    handleProjectAdded() {
      this.updateProjects();
      this.showAddProjectModal = false;
    },
  }
};
</script>
