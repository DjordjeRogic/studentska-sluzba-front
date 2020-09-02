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
        <v-row align="center">
          <v-col>
            <br/>
              <v-text-field
                  filled
                  v-model="email"
                  label="E-mail"
                  prepend-icon="mdi-account"
                  type='text'
                  outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                  filled
                  outlined
                  v-model="password"
                  label="Password"
                  prepend-icon="mdi-lock"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  @click:append="show = !show"
              ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col  align="center">
            <p class="error" v-if="errorLogin">Email or password is incorrect.</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col align="center">
            <v-btn dark color="#485E88" x-large @click="login">Log in</v-btn>
          </v-col>
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
      errorLogin: false
    }
  },
  methods:{
    login: function() {
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
                  this.$router.push({ name: "HelloWorld" });


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
          .catch(error => {
            alert(error)
            this.$refs.observer.reset();
          })
    }
  },
  created() {
    this.$store.dispatch('destroyToken');
    this.$store.dispatch('destroyCurrentUser');
    this.$store.dispatch('destoryPrikaziOveru');

  }
}
</script>

<style>
.marginTop {
  margin-top: 5%;
  width: 30em;
}
.card{
  box-shadow: 4px 4px 4px 4px;
}
.error{
  color:red;
}
</style>