const axios = require("axios");

module.exports = {
  config: {
    name: "daily",
    version: "1.0",
    author: "YourName",
    countDown: 5,
    role: 0,
    description: {
      en: "Get a daily motivational quote"
    },
    category: "Utility",
    guide: {
      en: "{pn}"
    }
  },

  langs: {
    en: {
      fetching: "Fetching your daily quote...",
      error: "Error fetching quote: %1"
    }
  },

  onStart: async function ({ api, event, getLang }) {
    try {
      await api.sendMessage(getLang("fetching"), event.threadID, event.messageID);
      const res = await axios.get("https://api.quotable.io/random");
      if (res.data && res.data.content && res.data.author) {
        return api.sendMessage(`💬 "${res.data.content}"\n- ${res.data.author}`, event.threadID, event.messageID);
      } else {
        return api.sendMessage(getLang("error", "No quote found"), event.threadID, event.messageID);
      }
    } catch (e) {
      return api.sendMessage(getLang("error", e.message), event.threadID, event.messageID);
    }
  }
};
