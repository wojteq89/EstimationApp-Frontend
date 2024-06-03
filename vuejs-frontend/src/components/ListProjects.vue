  <template>
    <div>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-data-table :headers="headers" :items="projects" sort-by="name">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Projects</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="goToAddProject">Add Project</v-btn>
                </v-toolbar>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        headers: [
          { text: 'Name', value: 'name' },
          { text: 'Client', value: 'client' },
          { text: 'Actions', value: 'actions', sortable: false }
        ],
        projects: []
      };
    },
    mounted() {
      this.fetchProjects();
    },
    methods: {
      fetchProjects() {
        // Replace with actual API call
        this.projects = [
          { id: 1, name: 'Project A', client: 'Client A' },
          { id: 2, name: 'Project B', client: 'Client B' },
          { id: 3, name: 'Project C', client: 'Client C' }
        ];
      },
      goToAddProject() {
        this.$router.push('/add-project');
      }
    }
  };
  </script>
  