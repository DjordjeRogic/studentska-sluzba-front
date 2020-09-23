<template>
    <v-data-table
        :headers="headers"
        :items="predmeti"
        class="elevation-1 ma-3"
        :footer-props="{
        itemsPerPageOptions: [15]
       }"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title class="display-1">Moji Predmeti</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.naziv="{item}">
        {{item.predmet.naziv}}
      </template>
      <template v-slot:item.smer="{item}">
        {{item.smer.naziv}}
      </template>
      <template v-slot:item.kategorija="{item}">
        {{item.predmet.kategorija}}
      </template>
      <template v-slot:item.actions="{item}">
        <v-btn
            color="#485E88"
            dark
            @click="studenti(item)">
          Studenti
        </v-btn>
      </template>
    </v-data-table>

</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    dialog: false,
    headers: [
      { text: 'Sifra', value: 'sifraStudijskogPrograma' },
      { text: 'Naziv', value: 'naziv' },
      { text: 'Smer', value: 'smer' },
      { text: 'Semestar', value: 'semestar' },
      { text: 'Kategorija', value: 'kategorija' },
      { text: 'Broj ESBP bodova', value: 'brojESBPBodova' },
      { text: 'Broj predavanja', value: 'brojPredavanjaUGodini' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    predmeti: [],
    editedIndex: -1,
    editedItem: {
      naziv: '',
      kategorija: '',
    },
    defaultItem: {
      naziv: '',
      kategorija: '',
    },
    snackbar:false,
    message:'',
    color:'success',
    kategorije:[
      {kategorija: 'Akademsko-opsteobrazovani', value:'AO'},
      {kategorija: 'Teorijsko-metodoloski', value:'TM'},
      {kategorija: 'Nucno-strucni', value:'NS'},
      {kategorija: 'Strucno-aplikativni', value:'SA'},
    ],
  }),
  methods:{
    studenti(item){
      this.$router.push({ path: `/predmetStudentiList/${item.id}` })
    }
  },
  mounted() {
    axios.get("http://localhost:8080/profesor/ulogovan/predmet").then((response) => {
      this.predmeti = response.data;
    })
  }
}
</script>

