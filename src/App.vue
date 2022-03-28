<template>
  <v-app>
    <v-navigation-drawer app>
      <!-- Barra de navegação -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Módulo Acadêmico
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item
          link
        >
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>

          <v-list-item-content
            @click="listStudents()"
          >
            <v-list-item-title>Alunos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <!-- -->
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <h5>Grupo a</h5>
    </v-footer>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  methods: {
    listStudents () {
      this.$router.replace('listStudents');
    }
  }
};
</script>
