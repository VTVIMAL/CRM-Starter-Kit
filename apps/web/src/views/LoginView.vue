<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();
const auth = useAuthStore();

async function handleSubmit() {
  errorMessage.value = '';

  try {
    await auth.signIn({
      email: email.value,
      password: password.value,
    });

    router.push('/');
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Login failed';
  }
}
</script>

<template>
  <main>
    <h1>Login</h1>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" />
      </div>

      <div>
        <label for="password">Password</label>
        <input id="password" v-model="password" type="password" />
      </div>

      <button type="submit" :disabled="auth.isLoading">
        {{ auth.isLoading ? 'Signing in...' : 'Login' }}
      </button>

      <p v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </main>
</template>