<script setup lang="ts">
import {useRouter} from 'vue-router';
import {useAuthStore} from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();


function handleLogout() {
    auth.signOut();
    router.push('/login');
}
</script>

<template>
    <header>
        <div>
            <strong>CRM Starter Kit</strong>
        </div>
    
        <div v-if="auth.user.value">
            <span>{{ auth.user.value.email }} ({{ auth.user.value.role }})</span>
            <button type="button" @click="handleLogout">Logout</button>
        </div>
    </header>
</template>