<template>
  <div>
    <v-data-table
        v-model="selected"
        :headers="headers"
        :items="ispiti"
        class="elevation-1 ma-3"
        group-by="rok"
        :footer-props="{
          itemsPerPageOptions: [10]
         }"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title class="display-1">Ispiti</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>

      <template v-slot:item.predmet="{ item }">
        {{item.nazivPredmeta}}
      </template>
      <template v-slot:item.datum="{ item }">
        {{item.datum}}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
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
      info:null,
      editedItem: {
        id:'',
        datum:  null,
        mestoOdrzavanja: '',
        vremeOdrzavanja: '',
        rok:null,
        nazivPredmeta:''
      },
      defaultItem: {
        id:'',
        datum: null,
        mestoOdrzavanja: '',
        vremeOdrzavanja: '',
        rok:null,
        nazivPredmeta:''
      },
      dialog: false,
      menu2: false,
      selectedItem:null,
      attrs:'',
      color:null,
      editedIndex:null


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
    editItem (item) {
      this.editedIndex = this.ispiti.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      axios.put(baseUrl+"/ispit/profesorUpdate",{
            'id':this.editedItem.id,
            'datum':this.editedItem.datum,
            'vremeOdrzavanja':this.editedItem.vremeOdrzavanja,
            'mestoOdrzavanja':this.editedItem.mestoOdrzavanja,
            'rok':this.editedItem.rok
          }
      ).then(response => {
        this.message="Uspesno updejtovan ispit.";
        axios.get(baseUrl+"/profesor/ulogovan/predmet/ispit").then((response) => {
          this.ispiti = response.data;

        })

        this.info=response;
        this.color="success"
        this.snackbar=true
      }).catch(error=>{
        this.color="error"
        this.info = error;
        this.message = "Nije uspeo updejt ispita";
        this.snackbar=true
      });
      this.close()
    },

  },
  computed: {
    computedDateFormatted () {
      return this.formatDateInput(this.editedItem.datum)
    },
  },
  mounted() {

    axios.get(baseUrl+"/profesor/ulogovan/predmet/ispit").then((response) => {
      this.ispiti = response.data;

    })
  }
}
</script>