const sticker = async (msg, client) => {
  if (msg.type === "image" || msg.isGif || msg.type === "video") {
    try {
      client.sendMessage(msg.from, "Sedang di proses 😊...");
      const media = await msg.downloadMedia();
      msg.reply(media, null, {
        sendMediaAsSticker: true,
        stickerAuthor: msg.body ? msg.body.split(",")[0] : "",
        stickerName: msg.body ? msg.body.split(",")[1] : "",
      });
    } catch (error) {
      client.sendMessage(msg.from, "Gagal membuat sticker 😢");
    }
  }
};

module.exports = sticker;
