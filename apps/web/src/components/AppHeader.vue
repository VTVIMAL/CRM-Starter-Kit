<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const { user, signOut } = useAuthStore();

function handleLogout() {
  signOut();
  router.push('/login');
}
</script>

<template>
  <header>
    <div>
      <strong>CRM Starter Kit</strong>
    </div>

    <div v-if="user">
      <span>{{ user.email }} ({{ user.role }})</span>
      <button type="button" @click="handleLogout">Logout</button>
    </div>
  </header>
</template>