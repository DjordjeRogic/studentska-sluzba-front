<template>
  <div>
    <v-data-table
        v-model="selected"
        :headers="headers"
        :items="ispiti"
        class="elevation-1"
        group-by="rok"
        :footer-props="{
          itemsPerPageOptions: [13]
         }"
        show-select
        selectable-key="odjava"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title class="display-1">Ispiti</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  @click="odjaviIspite()"
              > Odjavi ispite</v-btn>
            </template>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.predmet="{ item }">
        {{item.nazivPredmeta}}
      </template>
      <template v-slot:item.datum="{ item }">
        {{item.datum}}
      </template>

    </v-data-table>
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
  </div>
</template>
<script>
import axios from "axios";
const baseUrl = "http://localhost:8080";
export default {
  data(){
    return{
      studijskiProgram:null,
      ispiti:[],
      snackbar:false,
      message:'',
      headers: [
        { text: 'Predemt', value: 'predmet', groupable:false },
        { text: 'Sifra', value: 'sifra', groupable:false },
        { text: 'Datum', value: 'datum', groupable:false },
        { text: 'Vreme odrzavanja', value: 'vremeOdrzavanja', groupable:false  },
        { text: 'Mesto odrzavanja', value: 'mestoOdrzavanja', groupable:false  },
        { text: 'Rok', value: 'rok', groupable:true  },
      ],
      rokovi:[
        {naziv: 'Januarski', value:'JAN'},
        {naziv: 'Februarski', value:'FEB'},
        {naziv: 'Aprilski', value:'APR'},
        {naziv: 'Junski', value:'JUN'},
        {naziv: 'Julski', value:'JUL'},
        {naziv: 'Septembarski', value:'SEP'},
        {naziv: 'Oktobarski', value:'OKT'},
        {naziv: 'Dodatni', value:'DO'},
      ],
      dateFormatted: this.formatDateInput(new Date().toISOString().substr(0, 10)),
      selected:[],
      info:null
    }
  },

  methods:{
    formatDate(value){
      if (value) {
        return value[2]+"-"+value[1]+"-"+value[0]
      }
    },
    formatDateInput (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}-${month}-${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    odjaviIspite(){
      axios.put(baseUrl+"/student/ispit/odjavi",{'ispiti':this.selected}
      ).then(response => {
        this.message="Uspesno odjavljeni ispiti.";
        this.color="success"
        this.snackbar=true
        this.info=response
        axios.get(baseUrl+"/student/ispit/prijavljen").then((response) => {
          this.ispiti = response.data;

        })
      }).catch(error=>{
        this.color="error"
        this.message = error.response.data;
        this.snackbar=true
      });
    }
  },
  computed: {
    computedDateFormatted () {
      return this.formatDateInput(this.editedItem.datum)
    },
  },
  mounted() {

    axios.get(baseUrl+"/student/ispit/prijavljen").then((response) => {
      this.ispiti = response.data;

    })
  }
}
</script>