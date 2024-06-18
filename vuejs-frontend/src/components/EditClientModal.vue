<template>
  <v-dialog v-model="localEditDialog" max-width="500" @click:outside="handleDialogClose">
    <v-card class="card">
      <v-card-title class="center-content">Edit Client</v-card-title>
      <v-img v-if="previewImage" :src="previewImage" class="my-4 editLogo" contain></v-img>
      <v-card-text>
        <v-text-field v-model="localEditedClient.name" label="Name"></v-text-field>
        <v-text-field v-model="localEditedClient.description" label="Description"></v-text-field>
        <v-file-input
          v-model="localEditedClient.logo"
          label="Logo"
          accept="image/*"
          @change="previewLogo"
          append-icon="mdi-paperclip"
        ></v-file-input>
        <v-select
          v-model="localEditedClient.country"
          :items="countries"
          label="Country"
          required
        ></v-select>
        <v-text-field v-model="localEditedClient.email" label="Email"></v-text-field>
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
  props: {
    editDialog: {
      type: Boolean,
      required: true
    },
    editedClient: {
      type: Object,
      required: true
    },
    countries: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localEditDialog: false,
      localEditedClient: {
        id: null,
        name: '',
        description: '',
        logo: '',
        country: '',
        email: ''
      },
      previewImage: null
    };
  },
  watch: {
    editDialog: {
      immediate: true,
      handler(newVal) {
        this.localEditDialog = newVal;
        if (!newVal) {
          this.resetLocalEditedClient();
        }
      }
    },
    editedClient: {
      immediate: true,
      handler(newVal) {
        this.localEditedClient = { ...newVal };
        this.previewImage = newVal.logo || null;
      }
    },
    localEditDialog(newVal) {
      if (!newVal) {
        this.$emit('update:editDialog', false);
      }
    }
  },
  methods: {
    previewLogo(file) {
      if (file) {
        this.previewImage = URL.createObjectURL(file);
      }
    },
    saveChanges() {
      this.$emit('save-changes', this.localEditedClient);
      this.localEditDialog = false;
    },
    cancelEdit() {
      this.$emit('cancel-edit');
      this.localEditDialog = false;
    },
    handleDialogClose() {
      this.localEditDialog = false;
      this.$emit('update:editDialog', false);
    },
    resetLocalEditedClient() {
      this.localEditedClient = {
        id: null,
        name: '',
        description: '',
        logo: '',
        country: '',
        email: ''
      };
      this.previewImage = null;
    }
  }
};
</script>