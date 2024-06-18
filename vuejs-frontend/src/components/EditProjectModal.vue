<template>
  <v-dialog :value="localEditDialog" max-width="500" @input="updateDialog">
    <v-card class="card">
      <v-card-title class="center-content">Edit Project</v-card-title>
      <v-card-text>
        <v-text-field v-model="localEditedProject.name" label="Name"></v-text-field>
        <v-text-field v-model="localEditedProject.description" label="Description"></v-text-field>
        <v-text-field v-model="localEditedProject.client_name" label="Client"></v-text-field>
        <v-text-field v-model="localEditedProject.estimation" label="Estimation" type="number" step="0.01"></v-text-field>
      </v-card-text>
      <v-card-actions class="center-content">
        <v-btn class="button" @click="saveChanges">Save</v-btn>
        <v-btn class="button" @click="cancelEdit">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
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
    }
  },
  data() {
    return {
      localEditDialog: this.editDialog,
      localEditedProject: { ...this.editedProject }
    };
  },
  watch: {
    editDialog(val) {
      this.localEditDialog = val;
    },
    editedProject(val) {
      this.localEditedProject = { ...val };
    }
  },
  methods: {
    updateDialog(val) {
      this.$emit('update:editDialog', val);
    },
    saveChanges() {
      this.$emit('save-changes', this.localEditedProject);
      this.updateDialog(false);
    },
    cancelEdit() {
      this.updateDialog(false);
    }
  }
};
</script>