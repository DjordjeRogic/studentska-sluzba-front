<template>

    <v-app class="grey lighten-4">
      <nav  v-if="isAuthenticated">
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
        <v-toolbar-title  >Studentska sluzba</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
        </nav>
        <SideBar class="grey lighten-5" v-if="isAuthenticated"/>
      <v-main class="grey lighten-4" >
        <OveraSemestra/>
        <router-view></router-view>
      </v-main>

    </v-app>

</template>

<script>
import SideBar from './components/SideBarAdmin.vue'
import OveraSemestra from './components/OveraSemestra.vue'

export default {
  components:{
    SideBar,
    OveraSemestra
  },
  name: 'App',
  computed: {
    isAuthenticated() {
      return this.$store.getters.loggedIn;
    },
  },
  updated() {
    if(this.$store.getters.loggedIn==false){
      this.$router.push("/")
    }
  },
  mounted() {

  }
}
</script>
<style scoped>
.v-dialog__container {
  display: unset;
}
</style>


