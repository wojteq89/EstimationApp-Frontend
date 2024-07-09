<template>
  <v-dialog v-model="localEditDialog" max-width="500" @click:outside="handleDialogClose">
    <v-card class="card">
      <v-card-title class="center-content">Edit Client</v-card-title>
      <v-img v-if="previewImage" :src="previewImage" class="my-4 editLogo" contain></v-img>
      <v-card-text>
        <v-text-field v-model="localEditedClient.name" label="Name" :rules="[v => !!v || 'Name is required']"></v-text-field>
        <v-file-input
          v-model="localEditedClient.logo"
          label="Logo"
          accept="image/*"
          @change="previewLogo"
          append-icon="mdi-paperclip"
        ></v-file-input>
        <v-combobox
          v-model="localEditedClient.country"
          :items="countries"
          label="Country"
          required
          :rules="[v => !!v || 'Country is required']"
        ></v-combobox>
        <v-text-field v-model="localEditedClient.email" 
          label="Email"
          :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
        />
        <v-text-field v-model="localEditedClient.description" label="Description"></v-text-field>
      </v-card-text>
      <v-card-actions class="center-content">
        <v-btn class="button" @click="saveChanges">Save</v-btn>
        <v-btn class="button" @click="cancelEdit">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

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
      previewImage: null,
      notyf: new Notyf({
        position: {x: 'center', y:'bottom'},
      })
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
    resizeImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 200;
            ctx.drawImage(img, 0, 0, 200, 200);
            resolve(canvas.toDataURL('image/jpeg'));
          };
        };
        reader.onerror = error => reject(error);
      });
    },
    saveChanges() {
      const clientData = { ...this.localEditedClient };

      if (this.localEditedClient.logo && this.localEditedClient.logo instanceof File) {
        this.resizeImage(this.localEditedClient.logo)
          .then(base64Image => {
            clientData.logo = base64Image;
            this.$emit('save-changes', clientData);
            this.localEditDialog = false;
          })
          .catch(error => {
            console.error('Error resizing image:', error);
            this.notyf.error('Failed to edit client.');
          });
      } else {
        this.$emit('save-changes', clientData);
        this.localEditDialog = false;
      }
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