<template>
<div>
  <v-data-table
      :headers="headers"
      :items="filterProfesor"
      class="elevation-1 ma-3"
      :footer-props="{
        itemsPerPageOptions: [15]
       }"
      :search="search"
  >

    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title class="display-1">Profesori</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="#485E88"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >Registruj novog profesora</v-btn>
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
                  <v-row>
                    <v-col>
                      <v-text-field :rules="sifraRules" filled v-model="editedItem.sifraProfesora" label="Sifra Profesora"></v-text-field>
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
      <v-container>
        <v-row>
          <v-col><v-text-field v-model="imeFilter" label="Ime" class="mx-4"></v-text-field></v-col>
          <v-col><v-text-field v-model="prezimeFilter" label="Prezime" class="mx-4"></v-text-field></v-col>
          <v-col><v-text-field v-model="emailFilter" label="Email" class="mx-4"></v-text-field></v-col>
          <v-col><v-text-field v-model="sifraFilter" label="Sifra profesora" class="mx-4"></v-text-field></v-col>

        </v-row>
      </v-container>
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
          @click="closeSnackbar"
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
    search:'',
    imeFilter:'',
    prezimeFilter:'',
    emailFilter:'',
    sifraFilter:'',
    headers: [
      { text: 'Ime', value: 'name' },
      { text: 'Prezime', value: 'surname' },
      { text: 'Email', value: 'email' },
      { text: 'Sifra profesora', value: 'sifraProfesora' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    profesori: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      surname: '',
      email: '',
      sifraProfesora: '',
    },
    defaultItem: {
      name: '',
      surname: '',
      email: '',
      sifraProfesora: '',
    },
    snackbar:false,
    message:'',
    color:'success',
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
    sifraRules:[
      v=> !!v || 'Sifra mora biti unesena',
    ],
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Registracija' : 'Profesor'
    },
    filterProfesor: function(){


      return this.profesori.filter((profesor)=>{


        return (profesor.name.toUpperCase().match(this.imeFilter.toUpperCase())) && (profesor.surname.toUpperCase().match(this.prezimeFilter.toUpperCase()))
            && (profesor.email.toUpperCase().match(this.emailFilter.toUpperCase())) && (profesor.sifraProfesora.toUpperCase().match(this.sifraFilter.toUpperCase()));
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
      this.editedIndex = this.profesori.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.profesori.indexOf(item)
      this.$refs.potvrdi.otvori("Potvrda","Da li ste sigurni da zelite da obrisete profesora").then((potvrdi)=>{
        if(potvrdi==true){

            axios.delete("http://localhost:8080/profesor/"+item.id)
                .then(response => {
                  this.message="Uspesno obrsan profesor:  "+response.data.name+ " "+response.data.surname;
                  this.color="success"
                  this.snackbar=true
                  this.profesori.splice(index, 1)
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

          axios.put(baseUrl+"/profesor",
              this.editedItem
          ).then(response => {
            this.message="Uspesno izmenjen profesor "+response.data.name+" "+response.data.surname;
            Object.assign(this.profesori[index], response.data)
            this.color="success"
            this.snackbar=true
          }).catch(error=>{
            this.color="error"
            this.message = error.response.data;
            this.snackbar=true
          });



      } else {
        axios.post(baseUrl+"/profesor",
          this.editedItem
        ).then(response => {
          this.message="Uspesno dodat profesor. Sifra koja je generisana je:  "+response.data.sifra;
          this.profesori.push(response.data)
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
    closeSnackbar(){
      this.snackbar=false;
    }

  },
  mounted() {
    axios.get("http://localhost:8080/profesor").then((response) => {
      this.profesori = response.data;
    })

  }
}
</script>