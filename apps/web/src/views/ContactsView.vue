<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { apiFetch } from '../services/api';
import { useAuthStore } from '../stores/auth';

type Contact = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
};

const contacts = ref<Contact[]>([]);
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const isCreating = ref(false);

const search = ref('');

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phone = ref('');

const { user } = useAuthStore();

async function loadContacts() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const query = search.value.trim();
    const path = query
        ?  `/contacts?q=${encodeURIComponent(query)}`
        : '/contacts';

    const result = await apiFetch(path);
    contacts.value = result.data;
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Failed to load contacts';
  } finally {
    isLoading.value = false;
  }
}

async function createContact() {
    errorMessage.value = '';
    successMessage.value = '';
    isCreating.value = true;

    try {
        await apiFetch('/contacts', {
            method: 'POST',
            body: JSON.stringify({
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                phone: phone.value || undefined,
                ownedById: user.value?.id,
            }),
        });

        successMessage.value = 'Contact created successfully.';

        firstName.value = '';
        lastName.value = '';
        email.value = '';
        phone.value = '';

        await loadContacts();
    } catch (error) {
        errorMessage.value = 
            error instanceof Error ? error.message : 'Failed to create contact';
    } finally {
        isCreating.value = false;
    }
}

watch(search, () => {
    loadContacts();
})

onMounted(() => {
  loadContacts();
});
</script>

<template>
  <main>
    <h1>Contacts</h1>

    <section>
        <h2>Create Contacts</h2>

        <form @submit.prevent="createContact">
            <div>
                <label for="firstName">First name</label>
                <input id="firstName" v-model="firstName" type="text" />
            </div>

            <div>
                <label for="lastName">Last name</label>
                <input id="lastName" v-model="lastName" type="text" />
            </div>

            <div>
                <label for="email">Email</label>
                <input id="email" v-model="email" type="email" />
            </div>

            <div>
                <label for="phone">Phone</label>
                <input id="phone" v-model="phone" type="text" />
            </div>

            <button type="submit" :disabled="isCreating">
                {{ isCreating ? 'Createing...' : 'Create Contact' }}
            </button>
        </form>
    </section>

    <section>
        <h2>Search Contacts</h2>

        <input v-model="search" type="text" placeholder="Search by name or email"/>
    </section>

    <p v-if="successMessage">{{ successMessage }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="isLoading">Loading contacts...</p>

    <ul v-else>
        <li v-for="contact in contacts" :key="contact.id">
            {{ contact.firstName }} {{ contact.lastName }} - {{ contact.email }}
        </li>
    </ul>
  </main>
</template>