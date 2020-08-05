<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="predmeti"
        class="elevation-1"
        :footer-props="{
        itemsPerPageOptions: [15]
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
              >Unesi novi predmet</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col >
                      <v-text-field filled v-model="editedItem.naziv" label="Naziv"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-select
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

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
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
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
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
  data: () => ({
    dialog: false,
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
    selectedKategorija:{kategorija: 'Akademsko-opsteobrazovani', value:'AO'}
  }),

  computed: {
    formTitle () {
      return 'Predmet'
    },
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
    },

    deleteItem (item) {
      const index = this.predmeti.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.predmeti.splice(index, 1)
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.predmeti[this.editedIndex], this.editedItem)
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