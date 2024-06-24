<template>
  <v-dialog v-model="localAddDialog" max-width="600" @click:outside="cancel">
    <v-card class="card">
      <v-card-title class="center-content">Add Project</v-card-title>
      <v-card-text>
        <v-container>
          <v-form @submit.prevent="addProject">
            <v-text-field v-model="localName" label="Project Name" required></v-text-field>
            <v-combobox
              v-model="localSelectedClient"
              :items="clientOptions"
              item-text="name"
              item-value="id"
              label="Client"
              required
            ></v-combobox>
            <v-textarea v-model="localDescription" label="Description"></v-textarea>
            <v-card-actions class="center-content">
              <v-btn type="submit" class="button">Add</v-btn>
              <v-btn class="button" @click="cancel">Cancel</v-btn>
            </v-card-actions>
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
      localSelectedClient: null,
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
        this.$notify({
          title: 'Error',
          text: 'Please fill in all required fields.',
          type: 'error'
        });
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
          this.$notify({
            title: 'Success',
            text: 'Project added successfully.',
            type: 'success'
          });
          this.$emit('project-added');
          this.localAddDialog = false;
          this.resetForm();
        })
        .catch(error => {
          console.error('Error adding project:', error);
          this.$notify({
            title: 'Error',
            text: error.response ? error.response.data.message : 'Failed to add project.',
            type: 'error'
          });
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
    }
  }
};
</script>