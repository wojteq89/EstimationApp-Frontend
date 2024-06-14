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
                <v-btn @click="addClient" class="button">Add Client</v-btn>
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
                <v-btn @click="addProject" class="button">Add Project</v-btn>
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
                <v-btn @click="addEstimation" class="button">Add Estimation</v-btn>
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
        addClient() {
            this.$router.push('/add-client');
        },
        goToProjects() {
            this.$router.push('/projects');
        },
        addProject() {
            this.$router.push('/add-project');
        },
        goToEstimations() {
            this.$router.push('/estimations');
        },
        addEstimation() {
            this.$router.push('/add-estimation');
        }
    },
}
  </script>
  
  <style>
    body {
        background-color: #ebe8f0;
    }
    .panels {
        padding: 20px;
        margin-left: 5%;
        margin-right: 5%;
        margin-bottom: 5%;
    }
    .card {
        border-radius: 50px !important;
        background-color: #EDE8F5 !important;
        padding: 25px;
        overflow: hidden;
    }
    .card .title {
        font-size: x-large;
        font-weight: bold;
        color: #2643a9 !important;
    }
    .card .description {
        padding-left: 20%;
        padding-right: 20%;
        color: #48599a !important;
    }
    .icon {
        width: 100px;
        margin: 0 auto;
        border-radius: 0 !important;
    }
    .buttons {
        justify-content: center;
    }
    .button {
        margin-left: 10px;
        text-decoration: none;
        background-color: transparent !important;
        color: #48599a !important;
        transition: background-color 0.3s ease, color 0.3s ease !important;
    }
    .button:hover {
        background-color: #3D52A0 !important;
        color: rgb(236, 236, 236) !important;
    }

  </style>
  