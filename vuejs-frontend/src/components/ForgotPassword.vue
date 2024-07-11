<template>
    <form @submit.prevent="resetPassword">
        <input type="email" v-model="email" placeholder="Enter your email">
        <button type="submit">Reset Password</button>
    </form>
</template>

<script>
  import axios from 'axios';

export default {
    data() {
        return {
            email: ''
        };
    },
    methods: {
        resetPassword() {
            axios.post('http://localhost:8000/api/reset-request', { email: this.email })
                .then(response => {
                    console.log(response.data.message);
                })
                .catch(error => {
                    console.error(error.response.data.message);
                });
        }
    }
}
</script>