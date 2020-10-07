<template>
  <div class="container marginTop">
    <v-card class="elevation-20" outlined>
      <v-form>
      <v-container>
        <v-row >
          <v-col>
            <h1 style="color:#485E88;" align="center">Studentska Sluzba</h1>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col>
            <v-img
                :src="require('../assets/ftn-logo.png')"
                class="my-3"
                contain
                height="250"
            />
          </v-col>
        </v-row>
        <v-form ref="form">
        <v-row align="center">
          <v-col>
            <br/>
              <v-text-field
                  filled
                  v-model="email"
                  label="E-mail@uns.ac.rs"
                  prepend-icon="mdi-account"
                  type='text'
                  outlined
                  :rules="emailRules"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                  filled
                  outlined
                  :rules="lozinkaRules"
                  v-model="password"
                  label="Lozinka"
                  prepend-icon="mdi-lock"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  @click:append="show = !show"
                  @keydown.enter="login"
              ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
        <v-row>
          <v-col  align="center">
            <p class="errorMsg" v-if="errorLogin">Pogresan email ili lozinka.</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col align="center">
            <v-btn style="margin-top: -20px" width="50%" dark color="#485E88" x-large @click="login">Uloguj se</v-btn>
          </v-col>
          <v-row>
          <v-col style="font-size: 1em" align="center"><span><i>Ako ste zaboravili sifru kontaktirajte admina studentske sluzbe.</i></span></v-col>
          </v-row>
          <v-row>
            <v-col style="font-size: 1em" align="center"><span><i><b>ssftnadmin@uns.ac.rs</b></i></span></v-col>
          </v-row>
        </v-row>
      </v-container>
      </v-form>
    </v-card>

  </div>
</template>

<script>
export default {
  name: 'Login',
  data(){
    return{
      email:"",
      password:"",
      show:false,
      errorLogin: false,
      emailRules:[
          v=> !!v || 'E-mail mora biti unesen',
          v=> /.+@uns.ac.rs+/.test(v) || 'E-mail mora biti od uns naloga',
      ],
      lozinkaRules:[
          v=>!!v || 'Lozinka mora biti uneta'
      ]
    }
  },
  methods:{
    login: function() {
      this.errorLogin=false;
      // if(this.$refs.form.validate() == false){
      //     return;
      // }
      this.$store
          .dispatch("retrieveToken", {
            email: this.email,
            password: this.password
          })
          .then(response => {
            console.log(response);
            this.$store
                .dispatch("retrieveCurrentUser")
                .then(response => {
                  console.log(response);
                  if(this.$store.getters.userRole=="ROLE_STUDENT") {
                    this.$store
                        .dispatch("proveraOvereSemestra");
                  }
                  this.$router.push({ name: "Profil" });


                })
                .catch(error => {
                  if (error.response) {
                    this.$store.dispatch("destroyToken");
                    alert("Error occured while retrieving current user.");
                  }
                });

          })
          /* .catch(error => {
             if (error.response && error.response.status === 404) {
               this.$bvToast.toast(error.response.data, {
                 title: "Not Found",
                 variant: "danger",
                 solid: true
               });
             } else if (error.response && error.response.status === 400) {
               this.$bvToast.toast(error.response.data, {
                 title: "Bad Request",
                 variant: "danger",
                 solid: true
               });
             } else if (error.response && error.response.status === 417) {
               this.$bvToast.toast(error.response.data, {
                 title: "Expectation Failed",
                 variant: "danger",
                 solid: true
               });
             }
           }); */
          .catch(() => {
            this.errorLogin = true
            this.$refs.observer.reset();
          })
    }
  },
  created() {
    this.$store.dispatch('destroyToken');
    this.$store.dispatch('destroyCurrentUser');
    this.$store.dispatch('destoryPrikaziOveru');

  },
  updated(){
  }
}
</script>

<style>
.marginTop {
  margin-top: 3%;
  width: 32em;
}
.card{
  box-shadow: 4px 4px 4px 4px;
}
.errorMsg{
  color:red;
  margin-top: -25px;

}
</style>