<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="ocene"
        class="elevation-1"
        group-by="semestar"
        :footer-props="{
          itemsPerPageOptions: [13]
         }"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title class="display-1">Ocene</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:item.ocena="{ item }">
        <v-chip :color="getColor(item.ocena)" dark>{{item.ocena }}</v-chip>
      </template>

    </v-data-table>
  </div>
</template>

<script>
import axios from "axios";
const baseUrl = "http://localhost:8080";
export default {
  data() {
    return {
      ocene:[],
      headers: [
        { text: 'Sifra predmeta', value: 'sifraPredmeta' },
        { text: 'Predmet', value: 'nazivPredmeta' },
        { text: 'Broj dolazaka na predavanja', value: 'brojDolazakaNaPredavanja' },
        { text: 'Bodovi', value: 'brojaBodova'},
        { text: 'Ocena', value: 'ocena'},
        { text: 'Datum Polaganja', value: 'datumPolaganja'},
      ],
    }
  },
  mounted(){
    axios.get(baseUrl+"/student/ocena").then((response) => {
      this.ocene = response.data;
    })
  },
  methods: {
    getColor (ocena) {
      if (ocena > 5) {
        console.log('green')
        return 'green'
      } else {
        console.log('red')
        return 'red'
      }
    }
  },

}
</script>

<style scoped>

</style>