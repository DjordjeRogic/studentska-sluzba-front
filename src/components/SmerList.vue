<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="smerovi"
        class="elevation-1 ma-3"
        :footer-props="{
        itemsPerPageOptions: [15]
       }"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title class="display-1">Smerovi</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="#485E88"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
              >Unesi novi smer</v-btn>
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
                        <v-text-field :rules="skracenicaRules" filled v-model="editedItem.skracenica" label="Skracenica"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-select
                            :rules="obrazovnoPoljeRules"
                            filled
                            v-model="editedItem.obrazovnoPolje"
                            :items="obrazovnaPolja"
                            item-text="naziv"
                            item-value="value"
                            label="Obrazovno polje"
                            return-object
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field :rules="nazivDiplomeRules" filled v-model="editedItem.nazivDiplome" label="Naziv Diplome"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field :rules="smestarRules" type="number" filled v-model="editedItem.trajanjeUSemestrima" label="Trajanje u semestrima"></v-text-field>
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
      </template>
      <template v-slot:item.detalji="{ item }">
        <v-btn color="#485E88" dark @click="detalji(item)">Detalji</v-btn>
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
    headers: [
      { text: 'Naziv', value: 'naziv' },
      { text: 'Skracenica', value: 'skracenica' },
      { text: 'Broj semestara', value: 'trajanjeUSemestrima' },
      { text: 'Obrazovno polje', value: 'obrazovnoPolje' },
      { text: 'Detalji', value: 'detalji', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    smerovi: [],
    editedIndex: -1,
    editedItem: {
      naziv: '',
      skracenica: '',
      trajanjeUSemestrima: '',
      obrazovnoPolje:'',
      nazivDiplome:''
    },
    defaultItem: {
      naziv: '',
      skracenica: '',
      trajanjeUSemestrima: '',
      obrazovnoPolje:'',
      nazivDiplome:''
    },
    snackbar:false,
    message:'',
    color:'success',
    obrazovnaPolja:[
      {naziv: 'Interdisciplinarno', value:'INT'},
      {naziv: 'Tehnicko tehnoloske nauke', value:'TTN'},
    ],
    selectedObrazovnoPolje:{naziv: 'Interdisciplinarno', value:'INT'},
    nazivRules:[
      v=> !!v || 'Naziv mora biti uneseno',
      v=> /^[A-Z]{1}/.test(v) || 'Naziv mora poceti velikim slovom.',
      v=> /^[A-Z]{1}[a-zA-Z0-9 ,]*$/.test(v) || 'Naziv ne moze da sadrzi specijalne karaktere.',
    ],
    skracenicaRules:[
      v=> !!v || 'Skracenica mora biti unesena',
      v=> /^[A-Z0-9]*$/.test(v) || 'Skracenica moze da sadrzi samo velika slova i brojeve.',
    ],
    obrazovnoPoljeRules:[
      v=> !!v || 'Obrazovno polje mora biti izabrano.',
    ],
    nazivDiplomeRules:[
      v=> !!v || 'Naziv diplome mora biti unesen',
      v=> /^[A-Za-z ]*$/.test(v) || 'Naziv diplome moze da sadrzi samo slova i razmake.',
    ],
    smestarRules:[
      v=> !!v || 'Broj semestara mora biti unesen',
      v=> v>0 || 'Broj semestara ne moze biti manji od 0 ili 0',
      v=> v<9 || 'Broj semestara ne moze biti veci od 8',
    ],
  }),

  computed: {
    formTitle () {
      return 'Smer'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.smerovi.indexOf(item)
      this.editedItem = Object.assign({}, item)

      switch (this.editedItem.obrazovnoPolje){
        case "Interdisciplinarno":
          this.editedItem.obrazovnoPolje={}
          this.editedItem.obrazovnoPolje.value="INT";
          break;
        case "Tehnicko tehnoloske nauke":
          this.editedItem.obrazovnoPolje={}
          this.editedItem.obrazovnoPolje.value="TTN";
          break;

      }

      this.dialog = true
    },

    deleteItem (item) {
      const index = this.smerovi.indexOf(item)
      this.$refs.potvrdi.otvori("Potvrda","Da li ste sigurni da zelite da obrisete smer").then((potvrdi)=>{
        if(potvrdi==true){

          axios.delete("http://localhost:8080/smer/"+item.id)
              .then(() => {
                this.message="Uspesno obrsan smer:  "+item.naziv;
                this.color="success"
                this.snackbar=true
                this.smerovi.splice(index, 1)
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

        axios.put(baseUrl+"/smer", {
              'id':this.editedItem.id,
              'naziv':this.editedItem.naziv,
              'skracenica':this.editedItem.skracenica,
              'trajanjeUSemestrima':this.editedItem.trajanjeUSemestrima,
              'obrazovnoPolje':this.editedItem.obrazovnoPolje.value,
              'nazivDiplome':this.editedItem.nazivDiplome
            }
        ).then(response => {
          this.message="Uspesno izmenjen smer "+response.data.naziv;
          Object.assign(this.smerovi[index], response.data)
          this.color="success"
          this.snackbar=true
        }).catch(error=>{
          this.color="error"
          this.message = error.response.data;
          this.snackbar=true
        });
      } else {
        axios.post(baseUrl+"/smer",{
              'naziv':this.editedItem.naziv,
              'skracenica':this.editedItem.skracenica,
              'trajanjeUSemestrima':this.editedItem.trajanjeUSemestrima,
              'obrazovnoPolje':this.editedItem.obrazovnoPolje.value,
               'nazivDiplome':this.editedItem.nazivDiplome
            }
        ).then(response => {
          this.message="Uspesno dodat smer:  "+response.data.naziv;
          this.smerovi.push(response.data)
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
    detalji(item){
      this.$router.push({ path: `/smer/${item.id}` })
    }
  },
  mounted() {
    axios.get("http://localhost:8080/smer").then((response) => {
      this.smerovi = response.data;
    })

  }
}
</script>