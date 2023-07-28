const ffmpegPath = require("@ffmpeg-installer/ffmpeg");
const ffprobePath = require("@ffprobe-installer/ffprobe");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const ytmp3 = require("./tugas/ytmp3");
const yt = require("./tugas/yt");
const linkWa = require("./tugas/link-wa");
const ig = require("./tugas/ig");
const sticker = require("./tugas/sticker");
const fb = require("./tugas/fb");

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
    sticker(msg, client);
  } else if (msg.body.startsWith("/fb")) {
    fb(msg, client, MessageMedia);
  } else if (msg.body.startsWith("/ig")) {
    ig(msg, client, MessageMedia);
  } else if (msg.body.startsWith("/ytmp3")) {
    ytmp3(msg.body.split(" ")[1], msg, client, MessageMedia);
  } else if (msg.body === "/link-wa") {
    linkWa(msg, client);
  } else if (msg.body.startsWith("/yt")) {
    yt(msg.body.split(" ")[1], msg, client, MessageMedia);
  } else if (msg.body === "/help") {
    // read from file help.txt
    const help = fs.readFileSync("./help.txt", "utf-8");
    client.sendMessage(msg.from, help);
  }
});

client.on("disconnected", function () {
  console.log("Client was logged out");
});

client.initialize();
