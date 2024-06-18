<template>
  <v-dialog :value="localEditDialog" max-width="500" @input="updateDialog">
    <v-card class="card">
      <v-card-title class="center-content">Edit Estimation</v-card-title>
      <v-card-text>
        <v-text-field v-model="localEditedEstimation.name" label="Name"></v-text-field>
        <v-text-field v-model="localEditedEstimation.description" label="Description"></v-text-field>
        <v-text-field v-model="localEditedEstimation.project_name" label="Project"></v-text-field>
        <v-text-field v-model="localEditedEstimation.client_name" label="Client"></v-text-field>
        <v-text-field v-model="localEditedEstimation.type" label="Type"></v-text-field>
        <v-text-field v-model="localEditedEstimation.amount" label="Amount"></v-text-field>
        <v-text-field v-model="localEditedEstimation.date" label="Date"></v-text-field>
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
    };
  },
  watch: {
    editDialog(val) {
      this.localEditDialog = val;
    },
    editedEstimation(val) {
      this.localEditedEstimation = { ...val };
    },
  },
  methods: {
    updateDialog(val) {
      this.$emit('update:editDialog', val);
    },
    saveChanges() {
      this.$emit('save-changes', this.localEditedEstimation);
      this.updateDialog(false);
    },
    cancelEdit() {
      this.updateDialog(false);
    },
  },
};
</script>