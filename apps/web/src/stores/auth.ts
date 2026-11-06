import { ref } from 'vue';
import { login, getMe, type LoginPayload } from '../services/auth';

type AuthUser = {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
};

const user = ref<AuthUser | null>(null);
const isLoading = ref(false);

export function useAuthStore() {
  async function signIn(payload: LoginPayload) {
    isLoading.value = true;

    try {
      const result = await login(payload);

      localStorage.setItem('accessToken', result.accessToken);
      user.value = result.user;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadMe() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      user.value = null;
      return;
    }

    try {
      user.value = await getMe();
    } catch {
      localStorage.removeItem('accessToken');
      user.value = null;
    }
  }

  function signOut() {
    localStorage.removeItem('accessToken');
    user.value = null;
  }

  return {
    user,
    isLoading,
    signIn,
    loadMe,
    signOut,
  };
}