const axios = require("axios");

const getBaseApiUrl = async () => {
  try {
    const res = await axios.get(
      `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
      { timeout: 5000 }
    );
    return res.data.api;
  } catch {
    throw new Error("Cannot fetch base API URL");
  }
};

module.exports = {
  config: {
    name: "lyrics",
    version: "1.0",
    author: "Nazrul",
    countDown: 5,
    role: 0,
    description: {
      en: "Get song lyrics with their images",
      vi: "Lấy lời bài hát kèm ảnh"
    },
    category: "Song Lyrics",
    guide: {
      en: "{pn} <song name>",
      vi: "{pn} <tên bài hát>"
    },
    envConfig: {
      requestTimeout: 8000 // Timeout axios en ms
    }
  },

  langs: {
    en: {
      missingSong: "Please provide a song name!",
      searching: "Searching for lyrics...",
      notFound: "Sorry, lyrics not found for this song.",
      errorFetch: "Error fetching lyrics: %1"
    },
    vi: {
      missingSong: "Vui lòng nhập tên bài hát!",
      searching: "Đang tìm lời bài hát...",
      notFound: "Xin lỗi, không tìm thấy lời bài hát.",
      errorFetch: "Lỗi khi lấy lời bài hát: %1"
    }
  },

  onStart: async function ({ api, event, args, getLang, envCommands }) {
    const songName = args.join(" ").trim();
    const timeout = envCommands.lyrics?.requestTimeout || 8000;

    if (!songName) {
      return api.sendMessage(getLang("missingSong"), event.threadID, event.messageID);
    }

    try {
      await api.sendMessage(getLang("searching"), event.threadID, event.messageID);

      const baseApi = await getBaseApiUrl();
      const res = await axios.get(`${baseApi}/lyrics2?songName=${encodeURIComponent(songName)}`, { timeout });
      const data = res.data;

      if (!data.title || !data.artist || !data.lyrics) {
        return api.sendMessage(getLang("notFound"), event.threadID, event.messageID);
      }

      const songMessage = {
        body:
`❏♡ 𝐒𝐨𝐧𝐠 𝐓𝐢𝐭𝐥𝐞: ${data.title}
❏♡ 𝐀𝐫𝐭𝐢𝐬𝐭: ${data.artist}

❏♡ 𝐒𝐨𝐧𝐠 𝐋𝐲𝐫𝐢𝐜𝐬:

${data.lyrics}`
      };

      if (data.image) {
        try {
          const streamResponse = await axios.get(data.image, { responseType: "stream", timeout });
          songMessage.attachment = streamResponse.data;
        } catch {
          // Ignore image fetch errors silently
        }
      }

      return api.sendMessage(songMessage, event.threadID, event.messageID);
    } catch (error) {
      return api.sendMessage(getLang("errorFetch", error.message), event.threadID, event.messageID);
    }
  }
};
