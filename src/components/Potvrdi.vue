
<template>
  <v-dialog v-model="dialog" max-width="300px" @keydown.esc="odustanak">
    <v-card>
      <v-toolbar dense flat>
        <v-toolbar-title >{{ naslov }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>{{ poruka }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click.native="potvrda">Da</v-btn>
        <v-btn color="grey" text @click.native="odustanak">Ne</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () => ({
    poruka:'',
    naslov:'',
    dialog:false,
    resolve:null,
    reject: null,
  }),
  methods:{
    otvori(naslov,poruka){
      console.log("otvori")
      this.dialog=true
      this.naslov=naslov
      this.poruka=poruka
      return new Promise((resolve,reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    potvrda(){
      this.resolve(true)
      this.dialog = false
    },
    odustanak(){
      this.resolve(false)
      this.dialog = false
    },
  }
}
</script>