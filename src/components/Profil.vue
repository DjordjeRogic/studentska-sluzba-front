<template>
  <v-card elevation="2" style="margin: 5px">
    <v-card-title  class="display-2" >Profil <v-spacer></v-spacer> <v-btn x-large> Izmeni profil</v-btn></v-card-title>
  <v-container  style="margin-top: 2em; margin-left: 2em">
    <v-row align="center">
      <v-col cols="2">
        <v-icon size="15em">mdi-account-circle</v-icon>
      </v-col>
      <v-col cols="9">
        <v-container>
          <v-row>
            <v-col align="center">
              <span style="font-size: 2em">Ime:</span>
            </v-col>
            <v-col align="left">
              <span style="font-size: 2em">Pera</span>
            </v-col>
            <v-col align="center" >
              <span style="font-size: 2em">Prezime:</span>
            </v-col>
            <v-col align="left">
              <span  style="font-size: 2em">Peric</span>
            </v-col>

          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col align="center" >
              <span style="font-size: 2em">Broj indexa:</span>
            </v-col>
            <v-col align="left">
              <span  style="font-size: 2em">RA531223</span>
            </v-col>
            <v-col align="center" >
              <span style="font-size: 2em">Sifra:</span>
            </v-col>
            <v-col align="left">
              <v-btn x-large> Izmeni sifru</v-btn>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row>
            <v-col align="center" >
              <span style="font-size: 2em">Email:</span>
            </v-col>
            <v-col align="left">
              <span  style="font-size: 2em">RA531223</span>
            </v-col>
            <v-col cols="6" align="center">
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-container>
      </v-col>
    </v-row>

    <v-dialog>

    </v-dialog>
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
      user:{}
    }
  },
  monuted(){
    axios.get(baseUrl+"/user/currentUser")
    .then((response) =>{
      this.user= response;
    })
  }
}
</script>