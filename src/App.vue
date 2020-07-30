<template>
  <div id="app">
    <v-app>
    <SideBar/>
    <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
import SideBar from './components/SideBarAdmin.vue'
export default {
  components:{
    SideBar
  },
  name: 'App',
}
</script>


