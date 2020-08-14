<template>
  <div>
    <v-container j>
      <v-row justify="start">
        <v-col>
          <span class="display-2">Unos rezultata ispita</span>
        </v-col>
        <v-col  md="auto" offset="4">
          <v-btn
              x-large
              color="info"
              @click="downloadFile"
          >
            <v-icon left dark>mdi-cloud-download</v-icon>

            Skini u excel fajlu
          </v-btn>
        </v-col>
        <v-col  md="auto">
          <v-btn @click="unesiOcene"  x-large color="success"><v-icon left>mdi-check</v-icon> Potvrdi unos</v-btn>
        </v-col>
      </v-row>
      <v-row justify="start">
        <v-col md="auto" >
          Smer:
        </v-col>
        <v-col  md="auto" >
          {{ispit.nazivSmera}}
        </v-col>
        <v-divider vertical></v-divider>
        <v-col md="auto" >
          Predmet:
        </v-col>
        <v-col  md="auto" >
          {{ispit.nazivPredmeta}}
        </v-col>
        <v-divider vertical></v-divider>

        <v-col  md="auto" >
          Sifra predmeta:
        </v-col>
        <v-col  md="auto" >
          {{ispit.sifra}}
        </v-col>
        <v-divider vertical></v-divider>

        <v-col  md="auto" >
          Datum:
        </v-col>
        <v-col  md="auto" >
          {{ispit.datum}}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
              :headers="headers"
              :items="studenti"
              class="elevation-1"
              :footer-props="{
              itemsPerPageOptions: [15]
             }"
          >

            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>



              <template v-slot:item.bodovi="props">
              <v-form>
                <v-edit-dialog
                    :return-value.sync="props.item.bodovi"
                    large
                    persistent
                    @save="save(props.item)"
                    @error="error()"
                    @close="close(props.item)"
                >
                  <v-chip :color="getColor(props.item.bodovi)" dark>{{props.item.bodovi }}</v-chip>
                  <template v-slot:input>
                    <div class="mt-4 title">Unesi bodove</div>
                  </template>
                  <template v-slot:input>
                    <v-text-field
                        v-model="props.item.bodovi"
                        type="number"
                        counter
                        autofocus
                        :rules="[numberRule]"
                    >
                      <template v-slot:label>
                        Bodovi za studenta: {{props.item.brojIndexa}}
                      </template>

                    </v-text-field>
                  </template>
                </v-edit-dialog>
              </v-form>
            </template>
          </v-data-table>

          <v-snackbar
              v-model="snackbar"
              right
              timeout=1500
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
        </v-col>
      </v-row>
    </v-container>
  </div>

</template>
<script>
import axios from "axios";
const baseUrl = "http://localhost:8080";
export default {
  data(){
    return{
      dialog: false,
      headers: [
        { text: 'Ime', value: 'name' },
        { text: 'Prezime', value: 'surname' },
        { text: 'Broj Indexa', value: 'brojIndexa' },
        { text: 'Bodovi', value: 'bodovi', sortable: false },
      ],
      studenti: [],
      ispit:null,
      editedIndex: -1,
      snackbar:false,
      message:'',
      color:'success',
      smerovi:[],
      editBodovi:0,
      id:this.$route.params.id,
      info:null,
      download:false,
      numberRule: v  => {
        if (!isNaN(parseFloat(v)) && v >= 0 && v <= 100) return true;
        return 'Broj bodova mora biti izmedju 0 i 100';
      },
      }
    },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Registracija' : 'student'
    },
  },

  watch: {

  },
  methods: {
    save (item) {
      this.info = item;
    },
    close(item){
      if(item.bodovi < 0 || item.bodovi>100){
        this.snackbar = true
        this.color = 'error'
        this.message = 'Broj bodova mora biti izmedju 0 i 100';
        this.editBodovi =0;

        for(var i in this.studenti) {
          if (this.studenti[i].id == item.id) {
            this.info = this.studenti[i];
            this.studenti[i].bodovi = 0;
          }
        }
      }else {
        this.editBodovi = item.bodovi
        this.snackbar = true
        this.color = 'success'
        this.message = 'Uspesno uneseni bodovi za studenta: ' + item.brojIndexa
      }


    },
    error () {
      this.snackbar = true
      this.color = 'error'
      this.message = 'Canceled'
    },

    getColor (bodovi) {
      if (bodovi > 50) {
        console.log('green')
        return 'green'
      } else {
        console.log('red')
        return 'red'
      }
    },
      unesiOcene(){
        axios.put(baseUrl+"/ocena/ispit/"+this.id+"/rezultatiIspita",this.studenti
        ).then(response => {
          this.info=response;
          this.color="success"
          this.message = "Uspesno unete bodovi ispita";
          this.snackbar=true
          this.$router.push({ path: `/unosOcenaIspitList` })

        }).catch(error=>{
          this.color="error"
          this.info = error;
          this.message = "Nije uspeo unos ocena ispita";
          this.snackbar=true
        });
      },
    downloadFile(){
      console.log("test");
     /* axios.get(baseUrl+"/ispit/"+this.id+"/student/download").then(response => {
        console.log(response.data);

        let FileSaver = require('file-saver');
        let blob = new Blob([response.data],{type: 'application/vnd.ms-excel'});
        console.log(blob.size);
        FileSaver.saveAs(blob);

      });*/

      let FileSaver = require('file-saver');
      axios.get(baseUrl+"/ispit/"+this.id+"/student/download", {
        responseType: 'blob'
      }).then((response) => {

        // response.data is a blob type
        FileSaver.saveAs(response.data, this.filename());
      });
    },
    filename(){
      return this.ispit.nazivSmera +"_"+this.ispit.nazivPredmeta+"_"+this.ispit.datum;
    }
  },
  created() {
    axios.get(baseUrl+"/ispit/"+this.id+"/student").then((response) => {
      this.studenti = response.data;
    })
    axios.get(baseUrl+"/ispit/"+this.id).then((response) => {
      this.ispit = response.data;
    })

  }
}
</script>