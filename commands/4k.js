const axios = require("axios");

module.exports = {
  config: {
    name: "4k",
    version: "1.0",
    author: "YourName",
    countDown: 5,
    role: 0,
    description: {
      en: "Get random 4K image"
    },
    category: "Images",
    guide: {
      en: "{pn}"
    }
  },

  langs: {
    en: {
      fetching: "Fetching a 4K image for you...",
      error: "Error fetching image: %1"
    }
  },

  onStart: async function ({ api, event, getLang }) {
    try {
      await api.sendMessage(getLang("fetching"), event.threadID, event.messageID);
      const res = await axios.get("https://api.unsplash.com/photos/random?query=4k&client_id=YOUR_UNSPLASH_API_KEY");
      if (res.data && res.data.urls && res.data.urls.full) {
        return api.sendMessage({
          body: "Here's your 4K image!",
          attachment: await global.utils.getStreamFromURL(res.data.urls.full)
        }, event.threadID, event.messageID);
      } else {
        return api.sendMessage(getLang("error", "No image found"), event.threadID, event.messageID);
      }
    } catch (e) {
      return api.sendMessage(getLang("error", e.message), event.threadID, event.messageID);
    }
  }
};
