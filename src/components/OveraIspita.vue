<template>
  <v-dialog :value="isStudent" width="30em" persistent >
    <v-card>
      <v-card-title class="headline">Overa semestra u toku</v-card-title>
      <v-card-text>Overa semestra je u toku, ako ne overite semestar necete moci da prijavite ispite!</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="overi">Overi semestar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
<script>
import axios from "axios";
const baseUrl = "http://localhost:8080";
export default {
  data() {
    return {
      open: false,
      disabled: true
    }
  },
  mounted() {
  },
  computed: {
    isStudent() {
      if( this.$store.getters.overio=="false" || this.$store.getters.overio==false )
        return false;
      else
        return true;

    }
  },
  methods:{
    overi() {
      axios.put(baseUrl + "/student/semestar/overi")
          .then(() => {
            this.$store
                .dispatch("proveraOvereSemestra");
          }
    )


    }
  }
}
</script>
<style>

</style>