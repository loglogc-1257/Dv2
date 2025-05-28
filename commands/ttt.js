// TicTacToe très simple - juste un rappel ou début de partie

module.exports = {
  config: {
    name: "ttt",
    version: "1.0",
    author: "YourName",
    countDown: 5,
    role: 0,
    description: {
      en: "Start a Tic Tac Toe game"
    },
    category: "Games",
    guide: {
      en: "{pn} start"
    }
  },

  langs: {
    en: {
      start: "Tic Tac Toe game started! (Feature to be implemented)"
    }
  },

  onStart: async function ({ api, event, getLang, args }) {
    if (args[0] && args[0].toLowerCase() === "start") {
      return api.sendMessage(getLang("start"), event.threadID, event.messageID);
    } else {
      return api.sendMessage("Usage: {pn} start", event.threadID, event.messageID);
    }
  }
};
