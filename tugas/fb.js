const { snapsave } = require("@bochilteam/scraper");

const fb = async (msg, client) => {
  if (!msg.body.split(" ")[1].includes("facebook" || "fb")) {
    client.sendMessage(msg.from, "Harap memasukkan url facebook 😊");
    return;
  }
  client.sendMessage(msg.from, "Sedang di proses 😊...");
  try {
    let txt = "*Link Download*\n\n";
    const link = await snapsave(msg.body.split(" ")[1]);
    txt += link[0].url;
    client.sendMessage(msg.from, txt);
  } catch (error) {
    client.sendMessage(
      msg.from,
      "Maaf, tidak dapat mendapatkan link download 😢"
    );
  }
};

module.exports = fb;
