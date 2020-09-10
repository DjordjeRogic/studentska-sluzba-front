<template>
  <div id="smerDetails">
  <v-container j>
    <v-row justify="start">
      <v-col>
        <span class="display-2">{{ smer.naziv }}</span>
      </v-col>
      <v-col  md="auto" offset="4">
        <v-btn>Izmeni</v-btn>
      </v-col>
      <v-col md="auto">
        <v-btn>Obrisi</v-btn>
      </v-col>
    </v-row>
    <v-row justify="start">
      <v-col md="auto" >
        Naziv Diplome:
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
    </v-row>
    <v-row>
      <v-col>
      <v-data-table
          :headers="headers"
          :items="predmeti"
          class="elevation-1"
          group-by="semestar"
          show-group-by
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
              <v-card>
                <v-card-title>
                  <span class="headline">Dodaj predmet</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col >
                        <v-select
                            filled
                            v-model="editedItem.predmet"
                            :items="noviPredmeti"
                            item-text="naziv"
                            label="Predmet"
                            return-object
                            v-if="edit != true"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col >
                        <v-select
                            filled
                            v-model="editedItem.profesor"
                            :items="profesori"
                            item-text="name"
                            label="Profesor"
                            return-object
                        >
                          <template v-slot:selection="data">
                             {{ data.item.name }} {{ data.item.surname }} ,{{ data.item.sifraProfesora }}
                          </template>
                          <template v-slot:item="data">
                            {{ data.item.name }} {{ data.item.surname }} ,{{ data.item.sifraProfesora }}
                          </template>
                        </v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col >
                        <v-text-field filled v-model="editedItem.sifraStudijskogPrograma" label="Sifra Studijskog Programa"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col >
                        <v-select
                            filled
                            v-model="editedItem.semestar"
                            :items="semestri"
                            item-text="broj"
                            item-value="value"
                            label="Semestar"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col >
                        <v-text-field type="number" filled v-model="editedItem.brojPredavanjaUGodini" label="Broj predavanja"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col >
                        <v-text-field type="number" filled v-model="editedItem.brojESBPBodova" label="ESBP Bodovi"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

          </v-toolbar>
        </template>
        <template v-slot:item.naziv="{ item }">
          {{item.predmet.naziv}}
        </template>
        <template v-slot:item.brojPredavanjaUGodini="{ item }">
          {{item.brojPredavanjaUGodini}}
        </template>
        <template v-slot:item.brojESBPBodova="{ item }">
          {{item.brojESBPBodova}}
        </template>
        <template v-slot:item.semestar="{ item }">
          {{item.semestar}}
        </template>
        <template v-slot:item.profesor="{ item }">
          {{item.profesor.name}} {{item.profesor.surname}}
        </template>
        <template v-slot:item.detalji="{ item }">
          <v-btn @click="detalji(item)">Detalji</v-btn>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
          >
            mdi-minus
          </v-icon>
          <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
        </template>
      </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar
      v-model="snackbar"
      right
      timeout=2000
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
      id:this.$route.params.id,
      smer:null,
      predmeti:[],
      headers: [
        { text: 'Naziv', value: 'naziv', groupable:false },
        { text: 'Broj predavanja', value: 'brojPredavanjaUGodini', groupable:false  },
        { text: 'ESBP Bodovi', value: 'brojESBPBodova', groupable:false  },
        { text: 'Semestar', value: 'semestar' },
        { text: 'Profesor', value: 'profesor', groupable:false  },
        { text: 'Detalji', value: 'detalji', sortable: false , groupable:false },
        { text: 'Actions', value: 'actions', sortable: false , groupable:false },
      ],
      editedItem: {
        sifraStudijskogPrograma: '',
        brojPredavanjaUGodini: '',
        brojESBPBodova: '',
        semestar:null,
        predmet:null,
        profesor:null,
      },
      defaultItem: {
        sifraStudijskogPrograma: '',
        brojPredavanjaUGodini: '',
        brojESBPBodova: '',
        selectedSemestar:null,
        noviPredmet:null,
        profesor:null,
      },
      dialog: false,
      noviPredmeti:[],
      test:[],
      profesori:[],
      semestri:[
        {broj: 'I', value:1},
        {broj: 'II', value:2},
        {broj: 'III', value:3},
        {broj: 'IV', value:4},
        {broj: 'V', value:5},
        {broj: 'VI', value:6},
        {broj: 'VII', value:7},
        {broj: 'VIII', value:8},
      ],
      edit:false,
      snackbar:false
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
      this.dialog = true
      this.edit = true
    },

    deleteItem (item) {
      const index = this.profesori.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.profesori.splice(index, 1)
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.edit = false
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.predmeti[this.editedIndex], this.editedItem)
      } else {
        axios.post(baseUrl+"/studijskiProgram",{
              'smer':this.smer,
              'predmet':this.editedItem.predmet,
              'profesor':this.editedItem.profesor,
              'brojPredavanjaUGodini':this.editedItem.brojPredavanjaUGodini,
              'brojESBPBodova':this.editedItem.brojESBPBodova,
              'sifraStudijskogPrograma':this.editedItem.sifraStudijskogPrograma,
              'semestar':this.editedItem.semestar
            }
        ).then(response => {
          this.message="Uspesno dodat predmet:  "+response.data.naziv;
          this.predmeti.push(response.data)
          this.color="success"
          this.snackbar=true
          this.close();
        }).catch(error=>{
          this.color="error"
          this.message = error.response.data;
          this.snackbar=true
        });
        }
      this.edit = false

      },
    detalji(item){
      this.$router.push({ path: `/sudijskiProgram/${item.id}` })
    }

  },
  created() {
    axios.get(baseUrl+"/smer/"+this.id).then((response) => {
      this.smer = response.data;
    })
    axios.get(baseUrl+"/smer/"+this.id+"/predmeti").then((response) => {
      this.predmeti = response.data;
    })
    axios.get(baseUrl+"/predmet/nePripadaSmeru/"+this.id).then((response) => {
      this.noviPredmeti = response.data;
    })
    axios.get("http://localhost:8080/profesor").then((response) => {
      this.profesori = response.data;
    })
  }
}
</script>