<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="filterStudent"
        class="elevation-1 ma-3"
        :footer-props="{
        itemsPerPageOptions: [15]
       }"
    >
      <template v-slot:item.smer="{ item }">
        {{item.smer.naziv}}
      </template>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title class="display-1">Studenti</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="#485E88"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
              >Registruj novog studenta</v-btn>
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
                        <v-select
                            :rules="selectRules"
                            filled
                            v-model="editedItem.smer"
                            :items="smerovi"
                            item-text="naziv"
                            return-object
                            label="Smer"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col >
                        <v-text-field :rules="imeRules" filled v-model="editedItem.name" label="Ime"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field :rules="prezimeRules" filled v-model="editedItem.surname" label="Prezime"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field :rules="emailRules" filled v-model="editedItem.email" label="Email"></v-text-field>
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
          <v-col><v-text-field v-model="imeFilter" label="Ime" class="mx-4"></v-text-field></v-col>
          <v-col><v-text-field v-model="prezimeFilter" label="Prezime" class="mx-4"></v-text-field></v-col>
          <v-col><v-text-field v-model="emailFilter" label="Email" class="mx-4"></v-text-field></v-col>
          <v-col><v-text-field v-model="indexFilter" label="Broj indexa" class="mx-4"></v-text-field></v-col>

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
            v-show="false"
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
const baseUrl = "http://localhost:8080";
import Potvrdi from '../components/Potvrdi.vue'
export default {
  components:{
    Potvrdi
  },
  data: () => ({
    dialog: false,
    imeFilter:'',
    prezimeFilter:'',
    emailFilter:'',
    indexFilter:'',
    headers: [
      { text: 'Ime', value: 'name' },
      { text: 'Prezime', value: 'surname' },
      { text: 'Email', value: 'email' },
      { text: 'Broj Indexa', value: 'brojIndexa' },
      { text: 'Smer', value: 'smer' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    studenti: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      surname: '',
      email: '',
      smer: '',
    },
    defaultItem: {
      name: '',
      surname: '',
      email: '',
      smer: '',
    },
    snackbar:false,
    message:'',
    color:'success',
    smerovi:[],
    imeRules:[
      v=> !!v || 'Ime mora biti uneseno',
      v=> /^[A-Z]{1}[a-z]*$/.test(v) || 'Ime mora poceti velikim slovom i ne moze imati specijalne karaktere, velika slova ili brojeve.',

    ],
    prezimeRules:[
      v=> !!v || 'Prezime mora biti uneseno',
      v=> /^[A-Z]{1}[a-z]*$/.test(v) || 'Prezime mora poceti velikim slovom i ne moze imati specijalne karaktere, velika slova ili brojeve.',
    ],
    emailRules:[
      v=> !!v || 'E-mail mora biti unesen',
      v=> /.+@uns.ac.rs+/.test(v) || 'E-mail mora biti od uns naloga (@uns.ac.rs)',
    ],
    selectRules:[
      v=> !!v || 'Smer mora biti izabran',
    ]
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Registracija' : 'student'
    },
    filterStudent: function(){
      return this.studenti.filter((student)=>{
        return (student.name.toUpperCase().match(this.imeFilter.toUpperCase())) && (student.surname.toUpperCase().match(this.prezimeFilter.toUpperCase()))
            && (student.email.toUpperCase().match(this.emailFilter.toUpperCase())) && (student.brojIndexa.toUpperCase().match(this.indexFilter.toUpperCase()));
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
      this.editedIndex = this.studenti.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.studenti.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.studenti.splice(index, 1)
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

        axios.put(baseUrl+"/student",
            this.editedItem
        ).then(response => {
          this.message="Uspesno izmenjen student "+response.data.name+" "+response.data.surname;
          Object.assign(this.studenti[index], response.data)
          this.color="success"
          this.snackbar=true
        }).catch(error=>{
          this.color="error"
          this.message = error.response.data;
          this.snackbar=true
        });

      } else {
        axios.post(baseUrl+"/student",
            this.editedItem
        ).then(response => {
          this.message="Uspesno dodat student. Sifra koja je generisana je:  "+response.data.sifra;
          this.studenti.push(response.data)
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
    axios.get("http://localhost:8080/student").then((response) => {
      this.studenti = response.data;
    })
    axios.get("http://localhost:8080/smer").then((response) => {
      this.smerovi = response.data;
    })

  }
}
</script>