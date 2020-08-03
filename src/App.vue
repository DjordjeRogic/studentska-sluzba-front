<template>

    <v-app class="grey lighten-4">
      <nav v-if="isAuthenticated">
      <v-app-bar
          app

      >

        <v-spacer></v-spacer>
        <v-toolbar-title   style="margin-left: -50px ;">Fakultet Tehnickih Nauka</v-toolbar-title>
        <v-toolbar-items>
        <v-img
            style="margin-top: 2px ; margin-left: 0px"
            :src="require('./assets/ftn-logo.png')"
            contain
            height="60"
            width="70"
        />
        </v-toolbar-items>
        <v-toolbar-title >Studentska sluzba</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
        </nav>
        <SideBar v-if="isAuthenticated"/>
      <v-content>
        <router-view></router-view>
      </v-content>
    </v-app>

</template>

<script>
import SideBar from './components/SideBarAdmin.vue'
export default {
  components:{
    SideBar
  },
  name: 'App',
  computed: {
    isAuthenticated() {
      return this.$store.getters.loggedIn;
    },
  }
}
</script>


