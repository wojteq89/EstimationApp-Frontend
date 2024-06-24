<template>
  <div class="panels">
    <v-row>
        <v-col>
            <v-card class="card">
                <v-img
                    src="@/assets/clients.svg"
                    alt="Client Icon"
                    class="icon"
              ></v-img>
              <v-card-text class="title">Clients</v-card-text>
              <v-card-text class="description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                  Commodi, ratione debitis quis est labore voluptatibus! Eaque 
                  cupiditate minima, at placeat totam, magni doloremque veniam 
                  neque porro libero rerum unde voluptatem!
              </v-card-text>
              <v-card-actions class="buttons">
                <v-btn @click="goToClients" class="button">Search Clients</v-btn>
            </v-card-actions>
            </v-card>
        </v-col>
        <v-col>
            <v-card class="card">
                <v-img
                    src="@/assets/projects.svg"
                    alt="Client Icon"
                    class="icon"
              ></v-img>
              <v-card-text class="title">Projects</v-card-text>
              <v-card-text class="description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                  Commodi, ratione debitis quis est labore voluptatibus! Eaque 
                  cupiditate minima, at placeat totam, magni doloremque veniam 
                  neque porro libero rerum unde voluptatem!
              </v-card-text>
              <v-card-actions class="buttons">
                <v-btn @click="goToProjects" class="button">Search Projects</v-btn>
              </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card class="card">
                <v-img
                    src="@/assets/estimations.svg"
                    alt="Client Icon"
                    class="icon"
              ></v-img>
              <v-card-text class="title">Estimations</v-card-text>
              <v-card-text class="description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                  Commodi, ratione debitis quis est labore voluptatibus! Eaque 
                  cupiditate minima, at placeat totam, magni doloremque veniam 
                  neque porro libero rerum unde voluptatem!
              </v-card-text>
              <v-card-actions class="buttons">
                <v-btn @click="goToEstimations" class="button">Search Estimations</v-btn>
              </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</div>
  </template>
  
  <script>
  export default {
    methods: {
        goToClients() {
            this.$router.push('/clients');
        },
        goToProjects() {
            this.$router.push('/projects');
        },
        goToEstimations() {
            this.$router.push('/estimations');
        },
    },
}
  </script>  