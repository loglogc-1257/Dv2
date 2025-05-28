const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
  );
  return base.data.mostakim;
};

module.exports = {
  name: '4k',
  aliases: ['4k', 'remini'],
  category: 'enhanced',
  author: 'Romim',

  /**
   * Execute command
   * @param {object} param0 - Object containing api, event, args
   */
  async execute({ api, event, args }) {
    try {
      // Vérifie qu'il y a une réponse à un message avec une image attachée
      if (
        !event.messageReply ||
        !event.messageReply.attachments ||
        event.messageReply.attachments.length === 0
      ) {
        return api.sendMessage(
          '𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.',
          event.threadID,
          event.messageID
        );
      }

      // Récupère l'URL de l'image dans le message reply
      const imageUrl = event.messageReply.attachments[0].url;

      // Récupère l'URL de base de l'API depuis le JSON distant
      const apiUrl = `${await baseApiUrl()}/remini?input=${encodeURIComponent(
        imageUrl
      )}`;

      // Envoie un message temporaire indiquant que le traitement est en cours
      const processingMessage = await api.sendMessage(
        '✨ Traitement de votre image en cours, veuillez patienter...',
        event.threadID,
        (err, info) => {}
      );

      // Récupère le flux de l'image améliorée
      const imageStream = await axios.get(apiUrl, {
        responseType: 'stream',
      });

      // Envoie l'image améliorée en réponse, en utilisant messageID pour remplacement
      await api.sendMessage(
        {
          body: '✅ Voici votre photo améliorée :',
          attachment: imageStream.data,
        },
        event.threadID,
        event.messageID
      );

      // Supprime le message temporaire de traitement
      if (processingMessage && processingMessage.messageID) {
        await api.unsendMessage(processingMessage.messageID);
      }
    } catch (error) {
      console.error('Erreur commande 4k:', error);
      return api.sendMessage(
        `❌ Une erreur est survenue : ${error.message || error}`,
        event.threadID,
        event.messageID
      );
    }
  },

  /**
   * Permissions & subscriptions (exemple)
   */
  permissions: ['READ_MESSAGE', 'SEND_MESSAGE', 'MANAGE_MESSAGES'],
  requiredSubscriptions: ['message_reactions', 'message_replies', 'message_attachments'],
};
