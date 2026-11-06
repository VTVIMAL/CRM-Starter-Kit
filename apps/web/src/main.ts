import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';

const app = createApp(App);

app.use(router);

const auth = useAuthStore();
await auth.loadMe();

app.mount('#app');