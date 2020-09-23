<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="filterPredmeti"
        class="elevation-1 ma-3"
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
                  color="#485E88"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
              >Unesi novi predmet</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-form ref="form">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col >
                        <v-text-field :rules="nazivRules" filled v-model="editedItem.naziv" label="Naziv"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-select
                            :rules="kategorijaRules"
                            filled
                            v-model="editedItem.kategorija"
                            :items="kategorije"
                            item-text="kategorija"
                            item-value="value"
                            label="Kategorija"
                            return-object
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
              </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-row>
          <v-col><v-text-field v-model="nazivFilter" label="Naziv" class="mx-4"></v-text-field></v-col>
        </v-row>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
          mdi-delete
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
    <potvrdi ref="potvrdi"></potvrdi>
  </div>
</template>
<script>
import axios from "axios";
import Potvrdi from "@/components/Potvrdi";
const baseUrl = "http://localhost:8080";

export default {
  components:{
    Potvrdi
  },
  data: () => ({
    dialog: false,
    nazivFilter:'',
    headers: [
      { text: 'Naziv', value: 'naziv' },
      { text: 'Kategorija', value: 'kategorija' },
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
    selectedKategorija:{kategorija: 'Akademsko-opsteobrazovani', value:'AO'},
    nazivRules:[
      v=> !!v || 'Ime mora biti uneseno',
      v=> /^[A-Z]{1}/.test(v) || 'Naziv mora poceti velikim slovom.',
      v=> /^[A-Z]{1}[a-zA-Z0-9 ]*$/.test(v) || 'Naziv ne moze da sadrzi specijalne karaktere.',

    ],
    kategorijaRules:[
      v=> !!v || 'Kategorija mora biti izabrana',
    ],
  }),

  computed: {
    formTitle () {
      return 'Predmet'
    },
    filterPredmeti: function(){
      return this.predmeti.filter((predmet)=>{
        return (predmet.naziv.toUpperCase().match(this.nazivFilter.toUpperCase()))
      });
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.predmeti.indexOf(item)
      this.editedItem = Object.assign({}, item)

      switch (this.editedItem.kategorija){
        case "Akademsko-opsteobrazovani":
          this.editedItem.kategorija={}
          this.editedItem.kategorija.value="AO";
          break;
        case "Teorijsko-metodoloski":
          this.editedItem.kategorija={}
          this.editedItem.kategorija.value="TM";
          break;
        case "Nucno-strucni":
          this.editedItem.kategorija={}
          this.editedItem.kategorija.value="NS";
          break;
        case "Strucno-aplikativni":
          this.editedItem.kategorija={}
          this.editedItem.kategorija.value="SA";
          break;
      }

      this.dialog = true
    },

    deleteItem (item) {
      const index = this.predmeti.indexOf(item)
      this.$refs.potvrdi.otvori("Potvrda","Da li ste sigurni da zelite da obrisete predmet").then((potvrdi)=>{
        if(potvrdi==true){

          axios.delete("http://localhost:8080/predmet/"+item.id)
              .then(() => {
                this.message="Uspesno obrsan predmet:  "+item.naziv;
                this.color="success"
                this.snackbar=true
                this.predmeti.splice(index, 1)
              }).catch(error=>{
            this.color="error"
            this.message = error.response.data;
            this.snackbar=true
          });
        }
      })

    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.$refs.form.resetValidation();

    },

    save () {
      if(this.$refs.form.validate() == false){
        return;
      }
      if (this.editedIndex > -1) {
        var index = this.editedIndex;

        axios.put(baseUrl+"/predmet", {
              'id':this.editedItem.id,
              'naziv': this.editedItem.naziv,
              'kategorija': this.editedItem.kategorija.value,
            }
        ).then(response => {
          this.message="Uspesno izmenjen predmet "+response.data.naziv;
          Object.assign(this.predmeti[index], response.data)
          this.color="success"
          this.snackbar=true
        }).catch(error=>{
          this.color="error"
          this.message = error.response.data;
          this.snackbar=true
        });
      } else {
        axios.post(baseUrl+"/predmet",{
          'naziv':this.editedItem.naziv,
          'kategorija':this.editedItem.kategorija.value,
        }
        ).then(response => {
          this.message="Uspesno dodat predmet:  "+response.data.naziv;
          this.predmeti.push(response.data)
          this.color="success"
          this.snackbar=true
        }).catch(error=>{
          this.color="error"
          this.message = error.response.data;
          this.snackbar=true
        });

      }
      this.close()
    },
  },
  mounted() {
    axios.get("http://localhost:8080/predmet").then((response) => {
      this.predmeti = response.data;
    })

  }
}
</script>