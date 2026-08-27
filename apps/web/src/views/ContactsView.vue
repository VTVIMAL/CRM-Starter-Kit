<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { apiFetch } from '../services/api';

type Contact = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
};

const contacts = ref<Contact[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');

async function loadContacts() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const result = await apiFetch('/contacts');
    contacts.value = result.data;
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Failed to load contacts';
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadContacts();
});
</script>

<template>
  <main>
    <h1>Contacts</h1>

    <p v-if="isLoading">Loading contacts...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

    <ul v-else>
      <li v-for="contact in contacts" :key="contact.id">
        {{ contact.firstName }} {{ contact.lastName }} - {{ contact.email }}
      </li>
    </ul>
  </main>
</template>