module.exports = {
  config: {
    name: "sicbo",
    version: "1.0",
    author: "YourName",
    countDown: 5,
    role: 0,
    description: {
      en: "Play Sicbo dice game"
    },
    category: "Games",
    guide: {
      en: "{pn}"
    }
  },

  langs: {
    en: {
      result: "🎲 Dice results: %1, %2, %3\nTotal: %4",
      playMessage: "You rolled the dice!"
    }
  },

  onStart: async function ({ message, api, event, getLang }) {
    const rollDice = () => Math.floor(Math.random() * 6) + 1;
    const dice1 = rollDice();
    const dice2 = rollDice();
    const dice3 = rollDice();
    const total = dice1 + dice2 + dice3;

    return api.sendMessage(getLang("result", dice1, dice2, dice3, total), event.threadID, event.messageID);
  }
};
