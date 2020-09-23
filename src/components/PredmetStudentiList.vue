<template>
  <div>
    <v-container j>
      <v-row justify="start">
        <v-col>
          <span class="display-2">{{studijskiProgram.predmet.naziv}}</span>
        </v-col>
        <v-col  md="auto" offset-sm="0" offset="4">
          <v-btn
              x-large
              dark
              color="#485E88"
              :loading="uploading"
              @click="uploadFile"
          >
            <v-icon left dark>mdi-cloud-upload</v-icon>

            {{uploadText}}
          </v-btn>
          <input
              ref="uploader"
              class="d-none"
              type="file"
              accept=".xls"
              @change="onFileChanged"

          >
        </v-col>
        <v-col  md="auto" >
          <v-btn
              x-large
              dark
              color="#485E88"
              @click="downloadFile"
          >
            <v-icon left dark>mdi-cloud-download</v-icon>

            Skini u excel fajlu
          </v-btn>
        </v-col>
        <v-col  md="auto">
          <v-btn @click="unesiOcene"  dark x-large color="success"><v-icon left>mdi-check</v-icon> Potvrdi unos</v-btn>
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
              :items="studenti"
              class="elevation-1"
              :footer-props="{
              itemsPerPageOptions: [15]
             }"
              sort-by="brojIndexa"
          >

            <template v-slot:no-data>
              <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>
            <template v-slot:item.brojDolazaka="{ item }">
              <v-btn x-small rounded @click="plusDolazak(item)"><v-icon>mdi-plus</v-icon></v-btn> {{item.brojDolazaka}} <v-btn @click="minusDolazak(item)" x-small rounded><v-icon>mdi-minus</v-icon></v-btn>

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
        { text: 'Broj dolazaka', value: 'brojDolazaka', sortable: false },
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
      uploading:false,
      selectedFile: null,
      defaultButtonText:"Uploaduj rezultate",
      studijskiProgram:{}
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Registracija' : 'student'
    },
    uploadText() {
      return this.selectedFile ? this.selectedFile.name : this.defaultButtonText
    }
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
      axios.put(baseUrl+"/studijskiProgram/"+this.id+"/dolasci/",this.studenti
      ).then(response => {
        this.info=response;
        this.color="success"
        this.message = "Uspesno uneti dolasci";
        this.snackbar=true
        this.$router.push({ path: `/profesorPredmetiList` })

      }).catch(error=>{
        this.color="error"
        this.info = error;
        this.message = "Nije uspeo unos dolazaka";
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
      axios.get(baseUrl+"/studijskiProgram/"+this.id+"/student/dolasci/download", {
        responseType: 'blob'
      }).then((response) => {

        // response.data is a blob type
        FileSaver.saveAs(response.data, this.filename());
      });
    },
    filename(){
      return this.studijskiProgram.smer.naziv +"_"+this.studijskiProgram.predmet.naziv+"_dolasci";
    },
    uploadFile(){
      this.uploading = true
      window.addEventListener('focus', () => {
        this.uploading = false
      }, { once: true })

      this.$refs.uploader.click()

    },
    onFileChanged(e){
      this.selectedFile = e.target.files[0]
      const formData = new FormData();
      formData.append("file", this.selectedFile);
      axios.post(baseUrl+"/studijskiProgram/"+this.id+"/student/dolasci/upload", formData

      ).then((response) => {
        this.studenti = response.data;
      })
    },
    plusDolazak(item){
      if(item.brojDolazaka == this.studijskiProgram.brojPredavanjaUGodini)
        return;
      item.brojDolazaka = item.brojDolazaka+1
    },
    minusDolazak(item){
      if(item.brojDolazaka ==0)
        return;
      item.brojDolazaka = item.brojDolazaka-1
    }
  },
  created() {
    axios.get(baseUrl+"/studijskiProgram/"+this.id+"/student/dolasci").then((response) => {
      this.studenti = response.data;
    })
    axios.get(baseUrl+"/studijskiProgram/"+this.id).then((response) => {
      this.studijskiProgram = response.data;
    })

  }
}
</script>