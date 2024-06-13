<template>
  <div id="app" data-app>
    <nav>
      <router-link to="/home-page">Home</router-link> |
      <router-link to="/clients">Clients</router-link> |
      <router-link to="/projects">Projects</router-link> |
      <router-link to="/estimations">Estimations</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  background-image: linear-gradient(to bottom, rgb(151, 151, 151), rgba(0, 0, 0, 0));

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;

    &.router-link-exact-active {
      color: #f8f8f8;
    }
  }
}
</style>
