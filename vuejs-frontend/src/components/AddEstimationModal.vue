<template>
  <v-dialog v-model="localAddDialog" max-width="600" @click:outside="cancel">
    <v-card class="card">
      <v-card-title class="center-content">Add Estimation</v-card-title>
      <v-card-text>
        <v-container>
          <v-form @submit.prevent="addEstimation">
            <v-text-field v-model="localName" label="Estimation Name" required></v-text-field>
            <v-combobox
              v-model="localSelectedProject"
              :items="projectOptions"
              item-text="name"
              item-value="id"
              label="Project"
              required
            ></v-combobox>
            <v-combobox
              v-model="localSelectedClient"
              :items="clientOptions"
              item-text="name"
              item-value="id"
              label="Client"
              required
            ></v-combobox>
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
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    addDialog: {
      type: Boolean,
      required: true
    },
    projects: {
      type: Array,
      required: true
    },
    clients: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localAddDialog: false,
      localName: '',
      localDescription: '',
      localSelectedProject: null,
      localSelectedClient: null,
      localDate: new Date().toISOString().substr(0, 10),
      localType: '',
      localAmount: 0,
      menu: false,
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
    }
  },
  computed: {
    projectOptions() {
      return this.projects.map(project => ({
        id: project.id,
        name: project.name
      }));
    },
    clientOptions() {
      return this.clients.map(client => ({
        id: client.id,
        name: client.name
      }));
    }
  },
  methods: {
    addEstimation() {
      if (!this.localName || !this.localSelectedProject || !this.localSelectedClient || !this.localDate || !this.localType || !this.localAmount) {
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
        client_id: this.localSelectedClient.id,
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
      this.localSelectedClient = null;
      this.localDate = new Date().toISOString().substr(0, 10);
      this.localType = '';
      this.localAmount = 0;
    },
    cancel() {
      this.localAddDialog = false;
      this.$emit('update:addDialog', false);
    }
  }
};
</script>