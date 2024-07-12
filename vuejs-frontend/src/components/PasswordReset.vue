<template>
    <form @submit.prevent="resetPassword">
        <input type="email" v-model="email" placeholder="Enter your email">
        <button type="submit">Reset Password</button>
    </form>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                email: ''
            };
        },
        methods: {
            ...mapActions(['resetPasswordRequest']),
            resetPassword() {
                this.resetPasswordRequest({ email: this.email })
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
