<template>
  <v-container fluid class="px-0">
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card raised="raised" class="pa-4 ma-4">
          <v-layout justify-center align-center class="pa-4 ma-4">
            <v-btn @click="processPgn">Process Pgn</v-btn>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <div class="text-xs-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline" primary-title>Message from Go</v-card-title>
          <v-card-text>{{message}}</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">Awesome</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      message: " ",
      raised: true,
      dialog: false,
      bgWorker: undefined
    };
  },
  methods: {
    processPgn() {
      window.backend.readPgn().then(result => {
        const pgnContent = result;
        this.bgWorker.postMessage('splitPgn', [pgnContent]).then(result => {
          this.message = `There are ${result.length} games.`;
          this.dialog = true;
        });
      });
    }
  },
  mounted() {
    this.bgWorker = this.$worker.create([
      {
        message: "splitPgn",
        func: function(pgn) {
          const splitPgn = function(pgnContent) {
            let results = [];
            const isOutOfGame = 0;
            const isInHeader = 1;
            const isInGame = 2;
            let status = isOutOfGame;
            let currentGame = "";
            const isAHeaderLine = l => l.startsWith("[");
            const isBlankLine = l => l.trim().length === 0;
            const lines = pgnContent.split(/\r?\n/);
            lines.forEach(l => {
              switch (status) {
                case isOutOfGame:
                  if (isAHeaderLine(l)) {
                    status = isInHeader;
                    currentGame += l + "\n";
                  } else if (!isBlankLine(l)) {
                    status = isInGame;
                    currentGame += l + "\n";
                  }
                  break;
                case isInHeader:
                  if (status === isInGame) {
                    results.push(currentGame);
                    currentGame = "";
                  }
                  if (isAHeaderLine(l)) {
                    currentGame += l + "\n";
                  } else if (isBlankLine(l)) {
                    status = isInGame;
                    currentGame += "\n";
                  } else {
                    currentGame += l + "\n";
                  }
                  break;

                case isInGame:
                  if (isAHeaderLine(l)) {
                    results.push(currentGame);
                    currentGame = "";
                    status = isInHeader;
                    currentGame += l + "\n";
                  } else if (isBlankLine(l)) {
                    results.push(currentGame);
                    currentGame = "";
                    status = isOutOfGame;
                  } else {
                    currentGame += l + "\n";
                  }
              }
            });
            if (currentGame.length > 0) results.push(currentGame);
            return results;
          };

          return splitPgn(pgn);
        }
      }
    ]);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin-top: 2em;
  position: relative;
  min-height: 5rem;
  width: 100%;
}

a:hover {
  font-size: 1.7em;
  border-color: blue;
  background-color: blue;
  color: white;
  border: 3px solid white;
  border-radius: 10px;
  padding: 9px;
  cursor: pointer;
  transition: 500ms;
}

a {
  font-size: 1.7em;
  border-color: white;
  background-color: #121212;
  color: white;
  border: 3px solid white;
  border-radius: 10px;
  padding: 9px;
  cursor: pointer;
}
</style>
