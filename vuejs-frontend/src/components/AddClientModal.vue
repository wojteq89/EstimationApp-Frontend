<template>
  <v-dialog v-model="localAddDialog" max-width="500" @click:outside="cancel">
    <v-card class="card">
      <v-card-title class="center-content">Add Client</v-card-title>
      <v-img v-if="previewImage" :src="previewImage" class="addLogo" contain></v-img>
      <v-card-text>
        <v-text-field
          v-model="localClient.name"
          label="Client Name"
          required
          :rules="[v => !!v || 'Name is required']"
        ></v-text-field>
        <v-text-field
          v-model="localClient.email"
          label="Email"
          required
          :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
        ></v-text-field>
        <v-file-input
          v-model="localClient.logo"
          label="Logo"
          accept="image/*"
          @change="previewLogo"
          append-icon="mdi-paperclip"
        ></v-file-input>
        <v-combobox
          v-model="localClient.country"
          :items="countries"
          label="Country"
          required
          :rules="[v => !!v || 'Country is required']"
        ></v-combobox>
        <v-textarea v-model="localClient.description" label="Description"></v-textarea>
      </v-card-text>
      <v-card-actions class="center-content">
        <v-btn class="button" @click="addClient">Add</v-btn>
        <v-btn class="button" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axiosInstance from '@/axiosAuthConfig';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default {
  props: {
    addDialog: {
      type: Boolean,
      required: true
    },
    countries: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localAddDialog: false,
      localClient: {
        name: '',
        description: '',
        logo: null,
        country: '',
        email: ''
      },
      previewImage: null,
      defaultLogo: require('@/assets/clients.svg'),
      notyf: new Notyf({
        position: {x: 'center', y:'bottom'},
      })
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
    },
    localAddDialog(newVal) {
      if (!newVal) {
        this.$emit('update:addDialog', false);
      }
    }
  },
  methods: {
    previewLogo(file) {
      if (file) {
        this.localClient.logo = file;
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
          img.onerror = () => reject(new Error('Image loading error'));
        };
        reader.onerror = () => reject(new Error('File reading error'));
      });
    },
    addClient() {
      if (!this.localClient.name || !this.localClient.country || !this.localClient.email) {
        this.notyf.error('Please fill in all required fields.');
        return;
      }

      const formData = new FormData();
      formData.append('name', this.localClient.name);
      formData.append('description', this.localClient.description);
      formData.append('country', this.localClient.country);
      formData.append('email', this.localClient.email);

      if (this.localClient.logo) {
        this.resizeImage(this.localClient.logo)
          .then(base64Image => {
            formData.append('logo', base64Image);
            this.sendFormData(formData);
          })
          .catch(error => {
            console.error('Error resizing image:', error);
            this.notyf.error('Failed to resize image.');
          });
      } else {
        formData.append('logo', this.defaultLogo);
        this.sendFormData(formData);
      }
    },
    sendFormData(formData) {
      axiosInstance.post('/clients', formData)
        .then(response => {
          console.log('Client added:', response.data);
          this.notyf.success('Client added successfully.');
          this.resetForm();
          this.$emit('client-added');
          this.localAddDialog = false;
        })
        .catch(error => {
          console.error('Error adding client:', error);
          const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : 'Failed to add client.';
          this.notyf.error(errorMessage);
        });
    },
    resetForm() {
      this.localClient = {
        name: '',
        description: '',
        logo: null,
        country: '',
        email: ''
      };
      this.previewImage = null;
    },
    cancel() {
      this.localAddDialog = false;
      this.$emit('update:addDialog', false);
    }
  }
};
</script>