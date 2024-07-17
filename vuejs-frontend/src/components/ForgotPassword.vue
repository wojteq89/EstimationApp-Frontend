<template>
    <v-container class="card-container">
        <v-card class="card">
            <v-card-title>
                <h2 class="card-title">Reset Password</h2>
            </v-card-title>
            <v-card-text>
                <form @submit.prevent="resetPassword" style="display: flex; flex-direction: column;">
                    <v-text-field type="email" v-model="email" placeholder="Enter your email"></v-text-field>
                    <v-btn class="button" type="submit" :loading="isSubmitting" :disabled="isSubmitting" color="primary" block>Reset Password</v-btn>
                </form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
  position: { x: 'center', y: 'bottom' },
});

export default {
    data() {
        return {
            email: '',
            isSubmitting: false,
        };
    },
    methods: {
        resetPassword() {
            this.isSubmitting = true;
            this.$store.dispatch('resetPasswordRequest', { email: this.email })
                .then(() => {
                    notyf.success('An email was sent with a reset link.');
                    this.$router.push('/login-page');
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (error.response) {
                        notyf.error('User doesn\'t exist.', error.response.data.message);
                    } else {
                        notyf.error('Something went wrong :(', error.response.data.message);
                    }
                })
                .finally(() => {
                    this.isSubmitting = false;
                });
        }
    }
}
</script>