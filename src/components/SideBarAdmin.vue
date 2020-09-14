<template >
      <v-navigation-drawer
          class="elevation-2"
          app
          permanent

      >
        <v-list

            link
            class="py-0 ma-0"
        >
          <v-list-item  two-line :class="miniVariant && 'px-0'">
            <v-list-item-avatar>
              <!-- <img src="https://randomuser.me/api/portraits/men/81.jpg"> -->
              <v-icon x-large>mdi-account-circle</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ userDesc }}</v-list-item-title>
              <v-list-item-subtitle>{{userSubtxt}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider style="margin-top: -8px"></v-divider>

          <v-list-item
                       ripple
                       to="/profil"
          >
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>


          <v-list-item v-if="checkRole()=='ROLE_PROFESOR'"
                       ripple
                       to="/profesorPredmetiList"
          >
            <v-list-item-icon>
              <v-icon>mdi-book-open-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Moji predmeti</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="checkRole()=='ROLE_PROFESOR'"></v-divider>



          <v-list-item v-if="checkRole()=='ROLE_ADMIN'"
                       ripple
                       to="/profesorList"
          >
            <v-list-item-icon>
              <v-icon>mdi-account-tie</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title> Profesori </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="checkRole()=='ROLE_ADMIN'"></v-divider>

          <v-list-item v-if="checkRole()=='ROLE_ADMIN'"
                       ripple
                       to="/studentList"
          >
            <v-list-item-icon>
              <v-icon>mdi-account-group</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title> Studenti</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider  v-if="checkRole()=='ROLE_ADMIN'"></v-divider>



          <v-list-item v-if="checkRole()=='ROLE_ADMIN'"
                       ripple
                       to="/predmetList"
          >
            <v-list-item-icon>
              <v-icon>mdi-book-open-variant</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title> Predmeti </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="checkRole()=='ROLE_ADMIN'"></v-divider>

          <v-list-item v-if="checkRole()=='ROLE_ADMIN'"
                       ripple
                       to="/smerList"
          >
            <v-list-item-icon>
              <v-icon>mdi-bookshelf</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Smerovi</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider  v-if="checkRole()=='ROLE_ADMIN'"></v-divider>



          <v-list-item  to="/studentIspitList" v-if="checkRole()=='ROLE_STUDENT'"

          >
            <v-list-item-icon>
              <v-icon>mdi-playlist-check</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Prijavi ispite</v-list-item-title>

            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="checkRole()=='ROLE_STUDENT'"></v-divider>

          <v-list-item v-if="checkRole()=='ROLE_STUDENT'"
                       ripple
                       to="/prijavljeniIspitList"
          >
            <v-list-item-icon>
              <v-icon>mdi-playlist-remove</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Odjavi Ispite </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="checkRole()=='ROLE_STUDENT'"></v-divider>


          <v-list-item v-if="checkRole()=='ROLE_PROFESOR'"
                       ripple
                       to="/profesorIspitList"
          >
            <v-list-item-icon>
              <v-icon>mdi-playlist-edit</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Ispiti</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="checkRole()=='ROLE_PROFESOR'"></v-divider>


          <v-list-item v-if="checkRole()=='ROLE_PROFESOR'"
                       ripple
                       to="/unosOcenaIspitList"
          >
            <v-list-item-icon>
              <v-icon>mdi-playlist-star</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Unos rezultata</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="checkRole()=='ROLE_PROFESOR'"></v-divider>

          <v-list-item v-if="checkRole()=='ROLE_STUDENT'"
                       ripple
                       to="/ocenaList"
          >
            <v-list-item-icon>
              <v-icon>mdi-certificate</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Ocene</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="checkRole()=='ROLE_STUDENT'"></v-divider>

        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn dark color="#485E88" @click="logout" block>Logout</v-btn>
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
      role:this.$store.getters.userRole,
    }
  },
  computed: {
    bg () {
      return this.background ? 'https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg' : undefined
    },
    userDesc(){

      return this.$store.getters.user.name+" "+this.$store.getters.user.surname
    },
    userSubtxt(){
      if(this.$store.getters.userRole == "ROLE_STUDENT") {
        return "Student, " + this.$store.getters.user.brojIndexa
      }else {
        if (this.$store.getters.userRole == "ROLE_PROFESOR"){
          return "Profesor"
          }else{
            return "Admin"
        }
      }

    }
  },
  methods: {
    checkRole(){
      return this.$store.getters.userRole;
    },
    logout(){
      this.$store.dispatch('destroyToken');
      this.$store.dispatch('destroyCurrentUser');
      this.$store.dispatch('destoryPrikaziOveru');
      this.$router.push({ path: `/` })

    }
  },
  mounted() {
    this.$store.dispatch("retrieveCurrentUser"
    )
  },
  updated() {

  }
}
</script>

<style>
.nav {
  float: left;
}
</style>