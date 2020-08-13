<template>
      <v-navigation-drawer

          app
          permanent
      >
        <v-list
            link
            class="py-0"
        >
          <v-list-item two-line :class="miniVariant && 'px-0'">
            <v-list-item-avatar>
              <img src="https://randomuser.me/api/portraits/men/81.jpg">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>Application</v-list-item-title>
              <v-list-item-subtitle>Subtext</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item v-if="checkRole()=='ROLE_ADMIN'"

          >
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title><router-link to="/profesorList"> Profesori </router-link></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="checkRole()=='ROLE_ADMIN'"

          >
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title><router-link to="/predmetList"> Predmeti </router-link></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="checkRole()=='ROLE_ADMIN'"

          >
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title><router-link to="/smerList"> Smerovi </router-link></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="checkRole()=='ROLE_ADMIN'"

          >
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title><router-link to="/studentList"> Studenti </router-link></v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="checkRole()=='ROLE_STUDENT'"

          >
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title><router-link to="/studentIspitList"> Ispiti </router-link></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="checkRole()=='ROLE_STUDENT'"
                       ripple
                       to="/prijavljeniIspitList"
          >
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Prijavljeni Ispiti </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="checkRole()=='ROLE_PROFESOR'"
                       ripple
                       to="/profesorIspitList"
          >
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Ispiti</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>


          <v-list-item v-if="checkRole()=='ROLE_PROFESOR'"
                       ripple
                       to="/unosOcenaIspitList"
          >
            <v-list-item-icon>
              <v-icon>mdi-view-dashboard</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Unos rezultata</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block>Logout</v-btn>
          </div>
        </template>
      </v-navigation-drawer>
  </template>

<script>
export default {
  data () {
    return {
      drawer: true,
      items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-image' },
        { title: 'About', icon: 'mdi-help-box' },
      ],
      color: 'primary',
      colors: [
        'primary',
        'blue',
        'success',
        'red',
        'teal',
      ],
      right: false,
      permanent: true,
      miniVariant: false,
      expandOnHover: false,
      background: false,
      role:this.$store.getters.userRole
    }
  },
  computed: {
    bg () {
      return this.background ? 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg' : undefined
    },
  },
  methods: {
    checkRole(){
      return this.$store.getters.userRole;
    }
  }
}
</script>

<style>
.nav {
  float: left;
}
</style>