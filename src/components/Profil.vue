<template>
  <v-card elevation="2" class="ma-3">
    <v-card-title  class="display-2" >Profil <v-spacer></v-spacer> <v-btn v-show="false" x-large> Izmeni profil</v-btn></v-card-title>
  <v-container  style="margin-top: 2em; margin-left: 2em">
    <v-row align="center">
      <v-col md="3" xl="2">
        <v-icon size="15em">mdi-account-circle</v-icon>
      </v-col>
      <v-col md="9">
        <v-container>
          <v-row>
            <v-col align="center">
              <span style="font-size: 2em">Ime:</span>
            </v-col>
            <v-col align="left">
              <span style="font-size: 2em">{{user.name}}</span>
            </v-col>
            <v-col align="center" >
              <span style="font-size: 2em">Prezime:</span>
            </v-col>
            <v-col align="left">
              <span  style="font-size: 2em">{{user.surname}}</span>
            </v-col>

          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col v-if="this.$store.getters.userRole=='ROLE_STUDENT'" align="center" >
              <span style="font-size: 2em" >Broj indexa:</span>
            </v-col>
            <v-col v-if="this.$store.getters.userRole=='ROLE_STUDENT'" align="left">
              <span  style="font-size: 2em">{{user.brojIndexa}}</span>
            </v-col>
            <v-col v-if="this.$store.getters.userRole=='ROLE_PROFESOR'" align="center" >
              <span style="font-size: 2em">Sifra profesora:</span>
            </v-col>
            <v-col v-if="this.$store.getters.userRole=='ROLE_PROFESOR'" align="left">
              <span  style="font-size: 2em">{{user.sifraProfesora}}</span>
            </v-col>
            <v-col  align="center" >
              <span style="font-size: 2em">Sifra:</span>
            </v-col>
            <v-col  align="left">
              <v-btn color="#485E88" dark x-large @click="izmenaSifre = true"> Izmeni sifru</v-btn>
            </v-col>

            <v-col  v-if="this.$store.getters.userRole=='ROLE_ADMIN'" align="center" >
              <span style="font-size: 2em">Email:</span>
            </v-col>
            <v-col  v-if="this.$store.getters.userRole=='ROLE_ADMIN'" align="left">
              <span  style="font-size: 2em">{{user.email}}</span>
            </v-col>

          </v-row>
          <v-divider></v-divider>
          <v-row  v-if="this.$store.getters.userRole!='ROLE_ADMIN'">
            <v-col align="center" >
              <span style="font-size: 2em">Email:</span>
            </v-col>
            <v-col align="left">
              <span  style="font-size: 2em">{{user.email}}</span>
            </v-col>
            <v-col cols="6" align="center">
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-container>
      </v-col>
    </v-row>

    <v-dialog  max-width="500px" v-model="izmenaSifre">
      <v-card>
        <v-card-title>
          <span class="headline">Izmena sifre</span>
        </v-card-title>
        <v-form ref="form">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col >
                  <v-text-field :rules="trenutnaSifraRules" type="password" filled v-model="trenutnaSifra" label="Trenunta sifra"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field :rules="sifraRules" type="password" filled v-model="novaSifra" label="Nova sifra"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field :rules="ponovnaSifraRules" type="password" filled v-model="potvrda" label="Potvrdi sifru"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="promeniSifru">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
        v-model="snackbar"
        right
        timeout=9000
        top
        :color="color"
    >
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn
            dark
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
  </v-card>
<!--  <v-container>-->
<!--    <v-row align="center">-->
<!--      <v-col align="center" style="font-size: 3em" >Student</v-col>-->
<!--    </v-row>-->
<!--    <v-row align="center">-->
<!--      <v-col align="center"><v-icon size="15em">mdi-account-circle</v-icon></v-col>-->
<!--    </v-row>-->
<!--    <v-row align="center">-->
<!--      <v-col align="right" style="font-size: 2em" >Pera</v-col>-->
<!--      <v-col align="left" style="font-size: 2em"> Peric</v-col>-->
<!--    </v-row>-->
<!--    <v-row align="center">-->
<!--      <v-col align="center" style="font-size: 2em" > <v-btn>Promeni sifru</v-btn></v-col>-->
<!--    </v-row>-->
<!--    <v-row align="center">-->
<!--      <v-col align="center" style="font-size: 2em"> email</v-col>-->

<!--    </v-row>-->
<!--    <v-row align="center">-->
<!--      <v-col align="center" style="font-size: 2em"> godina upisa</v-col>-->

<!--    </v-row>-->
<!--  </v-container>-->
</template>
<script>
import axios from "axios";
const baseUrl = "http://localhost:8080";
export default {
  data() {
    return {
      user:{},
      izmenaSifre:false,
      potvrda:"",
      trenutnaSifra:"",
      novaSifra:"",
      snackbar:false,
      color:'success',
      message:'',
      dialog:false,
      trenutnaSifraRules:[
        v=> !!v || 'Trenutna sifra mora biti uneta',
      ],
      sifraRules:[
        v=> !!v || 'Nova sifra mora biti uneta',
        v=> /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(v) || 'Sifra mora da sadrzi barem jedno veliko slovo i broj.',
       v=>v.length > 8 || 'Sifra mora imati najmanje 8 karaktera'

      ],
      ponovnaSifraRules:[
        v=> !!v || 'Potvrda mora biti uneta',
        v=> v==this.novaSifra || 'Sifra i potvrda se ne poklapaju.',
      ],

    }
  },
  methods:{
    promeniSifru(){
      if(this.$refs.form.validate() == false){
        return;
      }
      axios.put(baseUrl+"/user/"+this.user.id+"/sifra",{
        potvrda:this.potvrda,
        trenutnaSifra:this.trenutnaSifra,
        novaSifra:this.novaSifra,
      })
          .then(() =>{
            this.color="success"
            this.message = "Uspesno promenjena sifra."
            this.snackbar=true
            this.closeDialog();
          })
        .catch((error)=>{
          if(error.response.data.message == ""){
            this.color = "error"
            this.message = "Netacna trenutna sifra";
            this.snackbar = true
          }else {
            this.color = "error"
            this.message = error.response.data;
            this.snackbar = true
          }
        })
    },
    closeDialog(){
      this.potvrda=""
      this.trenutnaSifra=""
      this.novaSifra=""
      this.izmenaSifre = false
      this.$refs.form.resetValidation();

    }
  },
  mounted(){
    if(this.$store.getters.userRole == "ROLE_STUDENT"){

      axios.get(baseUrl+"/student/"+this.$store.getters.currentUserId)
          .then((response) =>{
            this.user = response.data;
          })
    }
    if(this.$store.getters.userRole == "ROLE_PROFESOR"){

      axios.get(baseUrl+"/profesor/"+this.$store.getters.currentUserId)
          .then((response) =>{
            this.user = response.data;
          })
    }

    if(this.$store.getters.userRole == "ROLE_ADMIN"){

      axios.get(baseUrl+"/user/currentUser/")
          .then((response) =>{
            this.user = response.data;
          })
    }
  }
}
</script>