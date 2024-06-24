<template>
  <v-dialog v-model="localAddDialog" max-width="500" @click:outside="cancel">
    <v-card class="card">
      <v-card-title class="center-content">Add Client</v-card-title>
      <v-img v-if="previewImage" :src="previewImage" class="my-4 addLogo" contain></v-img>
      <v-card-text>
        <v-text-field v-model="localClient.name" label="Client Name" required></v-text-field>
        <v-text-field v-model="localClient.email" label="Email" required></v-text-field>
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
        ></v-combobox>
        <v-textarea v-model="localClient.description" label="Description"></v-textarea>
      </v-card-text>
      <v-card-actions class="center-content">
        <v-btn class="button" @click="addClient">Add Client</v-btn>
        <v-btn class="button" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';
import VueNotification from 'vue-notification';

Vue.use(VueNotification, {
  timer: 5000
});

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
      previewImage: null
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
        };
        reader.onerror = error => reject(error);
      });
    },
    addClient() {
      if (!this.localClient.name || !this.localClient.country || !this.localClient.email) {
        this.$notify({
          title: 'Error',
          text: 'Please fill in all required fields.',
          type: 'error'
        });
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
            this.$notify({
              title: 'Error',
              text: 'Failed to add client.',
              type: 'error'
            });
          });
      } else {
        this.sendFormData(formData);
      }
    },
    sendFormData(formData) {
      axios.post('http://localhost:8000/api/clients', formData)
        .then(response => {
          console.log('Client added:', response.data);
          this.$notify({
            title: 'Success',
            text: 'Client added successfully.',
            type: 'success'
          });
          this.resetForm();
          this.$emit('client-added');
        })
        .catch(error => {
          console.error('Error adding client:', error);
          this.$notify({
            title: 'Error',
            text: 'Failed to add client.',
            type: 'error'
          });
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
    },
  }
};
</script>