import { createRouter, createWebHistory } from 'vue-router'
import LoginVue  from '../views/LoginView.vue';
import HomeView from '.../viwes/HomeView.vue';
import { useAuthStore } from '../stores/auth';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginVue,
        },
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requireAuth: true },
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
        return '/';
    }
});

export default router;