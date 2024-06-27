<template>
  <div id="app" data-app>
    <nav>
      <v-container class="bookmarks ">
        <router-link to="/home-page">Home</router-link>
        <router-link to="/clients">Clients</router-link>
        <router-link to="/projects">Projects</router-link>
        <router-link to="/estimations">Estimations</router-link>
      </v-container>
    </nav>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>