const ffmpegPath = require("@ffmpeg-installer/ffmpeg");
const ffprobePath = require("@ffprobe-installer/ffprobe");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const ytmp3 = require("./tugas/ytmp3");

ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

const client = new Client({
  authStrategy: new LocalAuth(),
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
    ],
  },
  ffmpegPath: ffmpegPath.path,
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("authenticated", () => {
  console.log("Client is authenticated!");
});

client.on("auth_failure", function () {
  console.log("Auth failure, restarting...");
});

client.on("message", async (msg) => {
  client.sendSeen(msg.from);
  if (msg.hasMedia) {
    if (msg.type === "image" || msg.isGif || msg.type === "video") {
      client.sendMessage(msg.from, "Sedang di proses 😊...");
      const media = await msg.downloadMedia();
      msg.reply(media, null, {
        sendMediaAsSticker: true,
        stickerAuthor: msg.body
          ? msg.body.split(",")[0]
          : msg.from.replace("@c.us", ""),
        stickerName: msg.body ? msg.body.split(",")[1] : "sticker",
      });
    }
  } else if (msg.body.startsWith("/ytmp3")) {
    ytmp3(msg.body.split(" ")[1], msg, client, MessageMedia);
  } else if (msg.body === "/link-wa") {
    // create link wa pengirim
    const link = `*Link WA kamu*\nhttps://wa.me/${msg.from.replace(
      "@c.us",
      ""
    )}\n*Atau*\napi.whatsapp.com/send?phone=${msg.from.replace("@c.us", "")}`;
    client.sendMessage(msg.from, link);
  } else if (msg.body) {
    // perintah atau bantuan
    if (msg.body || msg.body === "help") {
      // read from file help.txt
      const help = fs.readFileSync("./help.txt", "utf-8");
      client.sendMessage(msg.from, help);
    }
  }
});

client.on("disconnected", function () {
  console.log("Client was logged out");
});

client.initialize();
