<template>
  <v-container>
    <v-card-text class="title" style="font-size: x-large;">Add Client</v-card-text>
    <v-form @submit.prevent="addClient">
      <v-text-field v-model="name" label="Client Name" required></v-text-field>
      <v-textarea v-model="description" label="Description"></v-textarea>
      <v-text-field v-model="logo" label="Logo"></v-text-field>
      <v-text-field v-model="country" label="Country" required></v-text-field>
      <v-text-field v-model="email" label="Email" required></v-text-field>
      <v-container style="display: flex; flex-direction: row; justify-content: center;">
        <v-btn type="submit">Add Client</v-btn>
        <v-btn @click="cancel">Cancel</v-btn>
      </v-container>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      description: '',
      logo: '',
      country: '',
      email: ''
    };
  },
  methods: {
    addClient() {
      // Sprawdzanie, czy wszystkie wymagane pola są wypełnione
      if (!this.name || !this.country || !this.email) {
        // Jeśli pole jest puste, wyświetl komunikat błędu
        this.$toast.error('Please fill in all required fields.');
        return;
      }

      // Replace with actual API call
      console.log('Client added:', {
        name: this.name,
        description: this.description,
        logo: this.logo,
        country: this.country,
        email: this.email
      });

      // Resetowanie formularza
      this.name = '';
      this.description = '';
      this.logo = '';
      this.country = '';
      this.email = '';

      // Przekierowanie użytkownika na stronę klientów
      this.$router.push('/clients');
    },
    cancel() {
        this.$router.push('/clients');
    }
  }
};
</script>

<style>
  .v-btn {
    margin-left: 15px;
  }
</style>
