<template>
  <div id="app" data-app>
    <nav>
      <v-container class="bookmarks">
        <router-link to="/home-page">Home</router-link> |
        <router-link to="/clients">Clients</router-link> |
        <router-link to="/projects">Projects</router-link> |
        <router-link to="/estimations">Estimations</router-link>
        <br>
        <router-link v-for="page in additionalPages" :key="page.to" :to="page.to">{{ page.label }}</router-link>
      </v-container>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    additionalPages() {
      const currentPath = this.$route.path;
      const pages = [
        { to: '/add-client', label: 'Add Client' },
        { to: '/add-project', label: 'Add Project' },
        { to: '/add-estimation', label: 'Add Estimation' }
      ];
      const filteredPages = pages.filter(page => currentPath.includes(page.to));
      return filteredPages;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding-top: 20px;
  padding-bottom: 40px;
  background-image: linear-gradient(to bottom, #7091E6, #7091e600);
}

.bookmarks {
  width: 60% !important;
  padding: 10px;
}

.bookmarks a {
  font-weight: bold;
  color: #3D52A0;
  text-decoration: none;
  transition: color 0.3s ease, font-size 0.3s ease;
}

.bookmarks a:hover {
  color: #ffffff;
}

.bookmarks a.router-link-exact-active {
  color: #ffffff;
  font-size: 25px;
}
</style>
