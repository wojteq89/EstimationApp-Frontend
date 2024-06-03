import Vue from 'vue';
import Router from 'vue-router';
import ListClients from '@/components/ListClients.vue';
import AddClient from '@/components/AddClient.vue';
import ListProjects from '@/components/ListProjects.vue';
import AddProject from '@/components/AddProject.vue';
import ListEstimations from '@/components/ListEstimations.vue';
import AddEstimation from '@/components/AddEstimation.vue';

Vue.use(Router);

export default new Router({
  mode: 'history', // Use history mode for clean URLs
  routes: [
    { path: '/clients', name: 'ListClients', component: ListClients },
    { path: '/add-client', name: 'AddClient', component: AddClient },
    { path: '/projects', name: 'ListProjects', component: ListProjects },
    { path: '/add-project', name: 'AddProject', component: AddProject },
    { path: '/estimations', name: 'ListEstimations', component: ListEstimations },
    { path: '/add-estimation', name: 'AddEstimation', component: AddEstimation },
    { path: '*', redirect: '/clients' } // Redirect to clients list for undefined routes
  ]
});
