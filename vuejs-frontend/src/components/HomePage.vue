<template>
    <div class="panels">
        <div class="row">
            <div class="col-md-6 mb-4">
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
                        <v-btn @mouseover="showTooltipClients = true" @mouseleave="showTooltipClients = false" class="button" @click="goToClients">
                            <v-icon>mdi-magnify</v-icon>
                            <span v-if="showTooltipClients">Search Clients</span>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
            <div class="col-md-6 mb-4">
                <v-card class="card">
                    <v-img
                        src="@/assets/projects.svg"
                        alt="Project Icon"
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
                        <v-btn @mouseover="showTooltipProjects = true" @mouseleave="showTooltipProjects = false" class="button" @click="goToProjects">
                            <v-icon>mdi-magnify</v-icon>
                            <span v-if="showTooltipProjects">Search Projects</span>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </div>  
        <div class="row">
            <div class="col-md-6 mb-4">
                <v-card class="card">
                    <v-img
                        src="@/assets/estimations.svg"
                        alt="Estimation Icon"
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
                        <v-btn @mouseover="showTooltipEstimations = true" @mouseleave="showTooltipEstimations = false" class="button" @click="goToEstimations">
                            <v-icon>mdi-magnify</v-icon>
                            <span v-if="showTooltipEstimations">Search Estimations</span>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
            <div class="col-md-6 mb-4">
                <v-card class="card">
                    <v-img
                        src="@/assets/clients.svg"
                        alt="Admin Icon"
                        class="icon"
                    ></v-img>
                    <v-card-text class="title">Admin Panel</v-card-text>
                    <v-card-text class="description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                        Commodi, ratione debitis quis est labore voluptatibus! Eaque 
                        cupiditate minima, at placeat totam, magni doloremque veniam 
                        neque porro libero rerum unde voluptatem!
                    </v-card-text>
                    <v-card-actions class="buttons">
                        <v-btn @mouseover="showTooltipEstimations = true" @mouseleave="showTooltipEstimations = false" class="button" @click="goToEstimations">
                            <v-icon>mdi-magnify</v-icon>
                            <span v-if="showTooltipEstimations">Search Estimations</span>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </div>
    </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        showTooltipClients: false,
        showTooltipProjects: false,
        showTooltipEstimations: false,
      };
    },
    methods: {
      goToClients() {
        this.$router.push('/clients');
      },
      goToProjects() {
        this.$router.push('/projects');
      },
      goToEstimations() {
        this.$router.push('/estimations');
      }
    }
  };
  </script>
