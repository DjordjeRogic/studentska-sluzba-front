<template>
  <div id="smerDetails">
    <v-container >
      <v-row justify="start">
        <v-col>
          <span class="display-2">{{ studijskiProgram.predmet.naziv }}</span>
        </v-col>
        <v-col v-show="false"  md="auto" offset="4">
          <v-btn>Izmeni</v-btn>
        </v-col>
        <v-col v-show="false" md="auto">
          <v-btn>Obrisi</v-btn>
        </v-col>
      </v-row>
      <v-row class="display-1">
        <v-col md="auto" >
          Smer:
        </v-col>
        <v-col  md="auto" >
          {{studijskiProgram.smer.naziv}}
        </v-col>
      </v-row>
      <v-row justify="start">
        <v-col md="auto" >
          Kategorija:
        </v-col>
        <v-col  md="auto" >
          {{studijskiProgram.predmet.kategorija}}
        </v-col>
        <v-divider vertical></v-divider>
        <v-col  md="auto" >
          Sifra programa:
        </v-col>
        <v-col  md="auto" >
          {{studijskiProgram.sifraStudijskogPrograma}}
        </v-col>
        <v-divider vertical></v-divider>

        <v-col md="auto" >
          Semestar:
        </v-col>
        <v-col  md="auto" >
          {{studijskiProgram.semestar}}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
              :headers="headers"
              :items="ispiti"
              class="elevation-1"
              :footer-props="{
        itemsPerPageOptions: [13]
       }"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title class="display-1">Ispiti</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        color="#485E88"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                    > <v-icon>mdi-plus</v-icon> Dodaj Ispit</v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Ispit</span>
                    </v-card-title>
                    <v-form ref="form">
                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col >
                              <v-select
                                  :rules="rokRules"
                                  filled
                                  v-model="editedItem.rok"
                                  :items="rokovi"
                                  item-text="naziv"
                                  label="Rok"
                                  v-if="edit != true"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col >
                              <v-select
                                  :rules="profesorRules"
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
                              <v-menu
                                  v-model="menu"
                                  :close-on-content-click="false"
                                  :nudge-right="40"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="290px"
                              >
                                <template v-slot:activator="{ on, attrs }">
                                  <v-text-field
                                      :rules="datumRules"
                                      v-model="computedDateFormatted"
                                      label="Datum"
                                      filled
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="editedItem.datum" @input="menu = false"></v-date-picker>
                              </v-menu>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col>
                            <v-menu
                                ref="menu2"
                                v-model="menu2"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                :return-value.sync="editedItem.vremeOdrzavanja"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="editedItem.vremeOdrzavanja"
                                    label="Vreme odrzavanja"
                                    filled
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                  format='24hr'
                                  v-if="menu2"
                                  v-model="editedItem.vremeOdrzavanja"
                                  full-width
                                  @click:minute="$refs.menu2.save(editedItem.vremeOdrzavanja)"
                              ></v-time-picker>
                            </v-menu>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col >
                              <v-text-field filled v-model="editedItem.mestoOdrzavanja" label="Mesto odrzavanja"></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>

                      </v-card-text>
                    </v-form>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                      <v-btn color="blue darken-1" text @click="save()">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

              </v-toolbar>
            </template>
            <template v-slot:item.datum="{ item }">
              {{item.datum}}
            </template>
            <template v-slot:item.profesor="{ item }">
              {{item.profesor.name}} {{item.profesor.surname}}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                  small
                  class="mr-2"
                  @click="deleteItem(item)"
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
        timeout=4000
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
const baseUrl = "http://localhost:8080";
import Potvrdi from "@/components/Potvrdi";

export default {
  components:{
    Potvrdi
  },
  data(){
    return{
      studijskiProgram:{
        predmet:{
          naziv:""
        },
        smer:{
          naziv:""
        }
      },
      id:this.$route.params.id,
      ispiti:[],
      menu:false,
      menu2: false,
      snackbar:false,
      headers: [
        { text: 'Datum', value: 'datum', groupable:false },
        { text: 'Vreme odrzavanja', value: 'vremeOdrzavanja', groupable:false  },
        { text: 'Mesto odrzavanja', value: 'mestoOdrzavanja', groupable:false  },
        { text: 'Rok', value: 'rok', groupable:false, sortable:false },
        { text: 'Profesor', value: 'profesor', groupable:false, sortable:false },
        { text: 'Actions', value: 'actions', groupable:false  },

      ],
      editedItem: {
        datum:  null,
        mestoOdrzavanja: '',
        vremeOdrzavanja: '',
        rok:null,
        profesor:null
      },
      defaultItem: {
        datum: null,
        mestoOdrzavanja: '',
        vremeOdrzavanja: '',
        rok:null,
        profesor:null
      },
      dialog: false,
      rokovi:[
        {naziv: 'Januarski', value:'JAN'},
        {naziv: 'Februarski', value:'FEB'},
        {naziv: 'Aprilski', value:'APR'},
        {naziv: 'Junski', value:'JUN'},
        {naziv: 'Julski', value:'JUL'},
        {naziv: 'Avgustovski', value:'AVG'},
        {naziv: 'Septembarski', value:'SEP'},
        {naziv: 'Oktobarski', value:'OKT'},
        {naziv: 'Dodatni', value:'DO'},
      ],
      dateFormatted: this.formatDateInput(new Date().toISOString().substr(0, 10)),
      edit:false,
      message:"",
      color:"primary",
      profesori:[],
      rokRules:[
        v=> !!v || 'Rok mora biti izabran',
      ],
      datumRules:[
        v=> !!v || 'Datum mora biti izabran',
      ],
      profesorRules:[
        v=> !!v || 'Profesor mora biti izabran',
      ],
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
      switch (this.editedItem.rok){
        case "Januarski":
          this.editedItem.rok={}
          this.editedItem.rok.value="JAN";
          break;
        case "Februarski":
          this.editedItem.rok={}
          this.editedItem.rok.value="FEB";
          break;
        case "Aprilski":
          this.editedItem.rok={}
          this.editedItem.rok.value="APR";
          break;
        case "Junski":
          this.editedItem.rok={}
          this.editedItem.rok.value="JUN";
          break;
        case "Julski":
          this.editedItem.rok={}
          this.editedItem.rok.value="JUL";
          break;
        case "Avgustovski":
          this.editedItem.rok={}
          this.editedItem.rok.value="AVG";
          break;
        case "Septembarski":
          this.editedItem.rok={}
          this.editedItem.rok.value="SEP";
          break;
        case "Oktobarski":
          this.editedItem.rok={}
          this.editedItem.rok.value="OKT";
          break;
        case "Dodatni":
          this.editedItem.rok={}
          this.editedItem.rok.value="DO";
          break;

      }
      this.editedItem.datum = this.formatDateInput(this.editedItem.datum);
      this.edit=true
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.ispiti.indexOf(item)
      this.$refs.potvrdi.otvori("Potvrda","Da li ste sigurni da zelite da uklonite ispit za "+item.rok+" rok").then((potvrdi)=>{
        if(potvrdi==true){

          axios.delete("http://localhost:8080/studijskiProgram/"+this.studijskiProgram.id+"/ispit/"+item.id)
              .then(() => {
                this.message="Uspesno uklonjen ispit za "+item.rok+" rok";
                this.color="success"
                this.snackbar=true
                this.ispiti.splice(index, 1)
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

        axios.put(baseUrl+"/ispit", {
              'id':this.editedItem.id,
              'datum':this.editedItem.datum,
              'programId':this.studijskiProgram.id,
              'vremeOdrzavanja':this.editedItem.vremeOdrzavanja,
              'mestoOdrzavanja':this.editedItem.mestoOdrzavanja,
              'profesor':this.editedItem.profesor,
              'rok':this.editedItem.rok.value
            }
        ).then(response => {
          this.message="Uspesno izmenjen ispit za "+response.data.rok+" rok.";
          Object.assign(this.ispiti[index], response.data)
          this.color="success"
          this.snackbar=true
        }).catch(error=>{
          this.color="error"
          this.message = error.response.data;
          this.snackbar=true
        });
      } else {
        axios.post(baseUrl+"/ispit",{
              'programId':this.studijskiProgram.id,
              'datum':this.editedItem.datum,
              'vremeOdrzavanja':this.editedItem.vremeOdrzavanja,
              'mestoOdrzavanja':this.editedItem.mestoOdrzavanja,
              'profesor':this.editedItem.profesor,
              'rok':this.editedItem.rok
            }
        ).then(() => {
          this.message="Uspesno dodat ispit.";
          axios.get("http://localhost:8080/studijskiProgram/"+this.id+"/ispit").then((response) => {
            this.ispiti = response.data;

          })
          this.color="success"
          this.snackbar=true
          this.close()

        }).catch(error=>{
          this.color="error"
          this.message = error.response.data;
          this.snackbar=true
        });

      }
      this.edit = false;
    },
  },
  computed: {
    computedDateFormatted () {
      return this.formatDateInput(this.editedItem.datum)
    },
  },
  mounted() {

    axios.get("http://localhost:8080/studijskiProgram/"+this.id+"/profesori").then((response) => {
      this.profesori = response.data;
    })
    axios.get("http://localhost:8080/studijskiProgram/"+this.id).then((response) => {
      this.studijskiProgram = response.data;
    })
    axios.get("http://localhost:8080/studijskiProgram/"+this.id+"/ispit").then((response) => {
      this.ispiti = response.data;

    })
    }
}
</script>
