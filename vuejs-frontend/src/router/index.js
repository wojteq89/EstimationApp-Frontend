import Vue from 'vue';
import Router from 'vue-router';
import ListClients from '@/components/ListClients.vue';
import ListProjects from '@/components/ListProjects.vue';
import ListEstimations from '@/components/ListEstimations.vue';
import HomePage from '@/components/HomePage.vue';
import LoginPage from '@/components/LoginPage.vue';
import RegisterPage from '@/components/RegisterPage.vue';
import SettingsPage from '@/components/AccountSettingsPage.vue';
import ListUsers from '@/components/ListUsers.vue';
import store from '@/store'; // Import Vuex store

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/home-page', name: 'HomePage', component: HomePage },
    { path: '/clients', name: 'ListClients', component: ListClients },
    { path: '/projects', name: 'ListProjects', component: ListProjects },
    { path: '/estimations', name: 'ListEstimations', component: ListEstimations },
    { path: '/login-page', name: 'LoginPage', component: LoginPage },
    { path: '/register-page', name: 'RegisterPage', component: RegisterPage },
    { path: '/settings-page', name: 'SettingsPage', component: SettingsPage },
    { path: '/admin-panel', name: 'ListUsers', component: ListUsers },
    { path: '*', redirect: '/login-page' }
  ]
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = store.getters.isLoggedIn;
  const isAdmin = store.getters.isAdmin;

  const authRequiredRoutes = [
    '/home-page',
    '/clients',
    '/projects',
    '/estimations',
    '/settings-page',
    '/admin-panel'
  ];

  const adminRequiredRoutes = [
    '/admin-panel'
  ];

  if (authRequiredRoutes.includes(to.path) && !isLoggedIn) {
    next({ path: '/login-page' });
  } else if (adminRequiredRoutes.includes(to.path) && !isAdmin) {
    next({ path: '/home-page' });
  } else {
    next();
  }
});

export default router;
