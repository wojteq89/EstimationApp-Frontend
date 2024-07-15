<template>
    <form @submit.prevent="resetPassword">
        <input type="email" v-model="email" placeholder="Enter your email">
        <button type="submit">Reset Password</button>
    </form>
</template>

<script>
import axiosPasswordResetInstance from '@/axiosPasswordResetConfig';

export default {
    data() {
        return {
            email: ''
        };
    },
    methods: {
        resetPassword() {
            axiosPasswordResetInstance.post('/reset-request', { email: this.email })
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