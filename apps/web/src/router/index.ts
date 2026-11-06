import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import ContactsView from '../views/ContactsView.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      redirect: '/contacts',
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactsView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (!auth.user.value && localStorage.getItem('accessToken')) {
    await auth.loadMe();
  }

  if (to.meta.requiresAuth && !auth.user.value) {
    return '/login';
  }

  if (to.path === '/login' && auth.user.value) {
    return '/contacts';
  }

  return true;
});

export default router;