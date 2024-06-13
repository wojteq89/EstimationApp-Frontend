<template>
  <v-app>
    <v-container>
      <v-form @submit.prevent="addClient">
        <v-img v-if="previewImage" :src="previewImage" class="editLogo" contain></v-img>
        <v-text-field v-model="name" label="Client Name" required></v-text-field>
        <v-textarea v-model="description" label="Description"></v-textarea>
        <v-select
          v-model="selectedCountry"
          :items="countries"
          label="Country"
          required
        ></v-select>
        <v-text-field v-model="email" label="Email" required></v-text-field>
        <v-file-input
          label="Logo"
          accept="image/*"
          @change="previewLogo"
          append-icon="mdi-paperclip"
        ></v-file-input>
        <v-container style="display: flex; flex-direction: row; justify-content: center;">
          <v-btn type="submit">Add Client</v-btn>
          <v-btn @click="cancelClient">Cancel</v-btn>
        </v-container>
      </v-form>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';
import VueNotification from 'vue-notification';

Vue.use(VueNotification, {
  timer: 5000
});

export default {
  data() {
    return {
      name: '',
      description: '',
      logo: null,
      countries: ['Poland', 'Germany', 'France', 'USA', 'UK', 'Spain', 'Italy', 'Canada', 'Australia', 'Japan', 'China', 'Brazil', 'India', 'Russia'],
      selectedCountry: '',
      email: '',
      previewImage: null
    };
  },
  methods: {
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
      if (!this.name || !this.selectedCountry || !this.email) {
        this.$notify({
          title: 'Error',
          text: 'Please fill in all required fields.',
          type: 'error'
        });
        return;
      }

      const formData = new FormData();
      formData.append('name', this.name);
      formData.append('description', this.description);
      formData.append('country', this.selectedCountry);
      formData.append('email', this.email);

      if (this.logo) {
        this.resizeImage(this.logo)
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
          this.$router.push('/clients');
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
      this.name = '';
      this.description = '';
      this.logo = null;
      this.selectedCountry = '';
      this.email = '';
      this.previewImage = null;
    },

    cancelClient() {
      this.$router.push('/clients');
    },

    previewLogo(file) {
      if (file) {
        this.logo = file;
        this.previewImage = URL.createObjectURL(file);
      }
    }
  }
};
</script>

<style>
.v-btn {
  margin-left: 15px;
}
.editLogo {
  border-radius: 200px;
  height: auto;
  width: auto;
  margin: 50px;
  margin-top: 0;  
}

</style>
