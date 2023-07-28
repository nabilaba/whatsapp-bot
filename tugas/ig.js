const { snapsave } = require("@bochilteam/scraper");
const { igdl } = require("btch-downloader");

const ig = async (msg, client) => {
  if (!msg.body.split(" ")[1].includes("instagram")) {
    client.sendMessage(msg.from, "Harap memasukkan url instagram 😊");
    return;
  }
  client.sendMessage(msg.from, "Sedang di proses 😊...");
  try {
    let txt = "*Link Download*\n\n";

    const btch = await igdl(msg.body.split(" ")[1]);
    if (btch.url[0]) txt += btch.url[0];

    const snap = await snapsave(msg.body.split(" ")[1]);
    if (snap[0].url) txt += `\n\n${snap[0].url}`;
    client.sendMessage(msg.from, txt);

  } catch (error) {
    console.log(error);
    client.sendMessage(
      msg.from,
      "Maaf, tidak dapat mendapatkan link download 😢"
    );
  }
};

module.exports = ig;
