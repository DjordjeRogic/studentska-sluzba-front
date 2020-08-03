<template>
  <v-container j>
    <v-row justify="start">
      <v-col>
        <span class="display-2">{{ smer.naziv }}</span>
      </v-col>
    </v-row>
    <v-row justify="start">
      <v-col md="auto" >
        Naziv Diplome
      </v-col>
      <v-col  md="auto" >
        {{smer.nazivDiplome}}
      </v-col>
      <v-divider vertical></v-divider>
      <v-col  md="auto" >
        Obrazovno Polje:
      </v-col>
      <v-col  md="auto" >
        {{smer.obrazovnoPolje}}
      </v-col>
      <v-divider vertical></v-divider>

      <v-col md="auto" >
        Trajanje u semestrima:
      </v-col>
      <v-col  md="auto" >
        {{smer.trajanjeUSemestrima}}
      </v-col>
      <v-col  md="auto" offset="4">
        <v-btn>Izmeni</v-btn>
      </v-col>
      <v-col md="auto">
        <v-btn>Obrisi</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
      <v-data-table
          :headers="headers"
          :items="predmeti"
          class="elevation-1"
          :footer-props="{
        itemsPerPageOptions: [13]
       }"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title class="display-1">Predmeti</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                > <v-icon>mdi-plus</v-icon> Dodaj predmet</v-btn>
              </template>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.naziv="{ item }">
          {{item.predmet.naziv}}
        </template>
        <template v-slot:item.brojPredavanjaUGodini="{ item }">
          {{item.predmet.brojPredavanjaUGodini}}
        </template>
        <template v-slot:item.brojESBPBodova="{ item }">
          {{item.predmet.brojESBPBodova}}
        </template>
        <template v-slot:item.profesor="{ item }">
          {{item.profesor.name}} {{item.profesor.surname}}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
          >
            mdi-minus
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
const baseUrl = "http://localhost:8080";
export default {

  data(){
    return{
      id:this.$route.params.id,
      smer:null,
      predmeti:[],
      headers: [
        { text: 'Naziv', value: 'naziv' },
        { text: 'Broj predavanja', value: 'brojPredavanjaUGodini' },
        { text: 'ESBP Bodovi', value: 'brojESBPBodova' },
        { text: 'Profesor', value: 'profesor' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  created() {
    axios.get(baseUrl+"/smer/"+this.id).then((response) => {
      this.smer = response.data;
    })
    axios.get(baseUrl+"/smer/"+this.id+"/predmeti").then((response) => {
      this.predmeti = response.data;
    })
  }
}
</script>