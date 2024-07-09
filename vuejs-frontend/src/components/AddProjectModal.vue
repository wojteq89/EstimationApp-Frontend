<template>
  <v-dialog v-model="localAddDialog" max-width="500" @click:outside="cancel">
    <v-card class="card">
      <v-card-title class="center-content">Add Project</v-card-title>
      <v-card-text>
        <v-container>
          <v-form @submit.prevent="addProject">
            <v-text-field 
              v-model="localName" 
              label="Project Name" 
              required 
              :rules="[v => !!v || 'Project Name is required']"
            ></v-text-field>
            <v-container class="center-content">
              <v-combobox
                v-model="localSelectedClient"
                :items="clients"
                item-text="name"
                item-value="id"
                label="Client"
                required
                :rules="[v => !!v || 'Client is required']"
              ></v-combobox>
              <v-btn class="button" 
                @click="openAddClientModal" 
                @mouseover="showTooltipAddClient = true" 
                @mouseleave="showTooltipAddClient = false" 
                style="margin-top: 15px;">
                <v-icon class="button-icon">mdi-plus</v-icon>
                <span v-if="showTooltipAddClient" class="button-text">Add Client</span>
              </v-btn>
            </v-container>
            <v-textarea v-model="localDescription" label="Description"></v-textarea>
            <v-card-actions class="center-content">
              <v-btn type="submit" class="button">Add</v-btn>
              <v-btn class="button" @click="cancel">Cancel</v-btn>
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
    <AddClientModal
      v-if="showAddClientModal"
      :addDialog.sync="showAddClientModal"
      :countries="countries"
      @client-added="updateClients"
    />
  </v-dialog>
</template>

<script>
import axios from 'axios';
import AddClientModal from './AddClientModal.vue';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default {
  props: {
    addDialog: {
      type: Boolean,
      required: true
    },
  },
  components: {
    AddClientModal,
  },
  data() {
    return {
      showTooltipAddClient: false,
      localAddDialog: this.addDialog,
      localName: '',
      localDescription: '',
      localSelectedClient: null,
      showAddClientModal: false,
      countries: ['Poland', 'Germany', 'France', 'USA', 'UK', 'Spain', 'Italy', 
      'Canada', 'Australia', 'Japan', 'China', 'Brazil', 'India', 'Russia'],
      clients: [],
      notyf: new Notyf({
        position: {x: 'center', y:'bottom'},
      })
    };
  },
  created() {
    this.fetchClients();
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
      this.$emit('update:addDialog', newVal);
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
    addProject() {
      if (!this.localName || !this.localSelectedClient) {
        this.notyf.error('Please fill in all required fields.');
        return;
      }

      const projectData = {
        name: this.localName,
        description: this.localDescription,
        client_id: this.localSelectedClient.id,
      };

      axios.post('http://localhost:8000/api/projects', projectData)
        .then(response => {
          console.log('Project added:', response.data);
          this.notyf.success('Project added successfully.');
          this.$emit('project-added');
          this.localAddDialog = false;
          this.resetForm();
        })
        .catch(error => {
          console.error('Error adding project:', error);
          this.notyf.error(error.response?.data?.message || 'Failed to add project.');
        });
    },
    resetForm() {
      this.localName = '';
      this.localDescription = '';
      this.localSelectedClient = null;
    },
    cancel() {
      this.localAddDialog = false;
      this.$emit('update:addDialog', false);
    },
    openAddClientModal() {
      this.showAddClientModal = true;
    },
    async fetchClients() {
      try {
        const response = await axios.get('http://localhost:8000/api/clients');
        this.clients = response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
        this.notyf.error('Failed to fetch clients.');
      }
    },
    async updateClients() {
      try {
        const response = await axios.get('http://localhost:8000/api/clients');
        this.clients = response.data;
        if (response.data.length > 0) {
          this.localSelectedClient = response.data[response.data.length - 1]; 
        }
      } catch (error) {
        console.error('Error updating clients:', error);
        this.notyf.error('Failed to update clients.');
      }
    }
  }
};
</script>