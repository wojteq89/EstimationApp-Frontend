import Vue from 'vue';
import Router from 'vue-router';
import ListClients from '@/components/ListClients.vue';
import ListProjects from '@/components/ListProjects.vue';
import ListEstimations from '@/components/ListEstimations.vue';
import HomePage from '@/components/HomePage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/home-page', name: 'HomePage', component: HomePage },
    { path: '/clients', name: 'ListClients', component: ListClients },
    { path: '/projects', name: 'ListProjects', component: ListProjects },
    { path: '/estimations', name: 'ListEstimations', component: ListEstimations },
    { path: '*', redirect: '/home-page' }
  ]
});
