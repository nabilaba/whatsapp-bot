const ytdl = require("ytdl-core");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const ytmp3 = async (url, msg, client, MessageMedia) => {
  if (
    !url ||
    url === "" ||
    url === undefined ||
    (!url.includes("youtube") && !url.includes("youtu.be"))
  ) {
    client.sendMessage(msg.from, "Harap memasukkan url youtube 😊");
    return;
  }

  if (ytdl.validateID(url) === false && ytdl.validateURL(url) === false) {
    client.sendMessage(msg.from, "Url tidak valid 😢");
    return;
  }

  client.sendMessage(msg.from, "Sedang di proses 😊...");
  // make directory if not exist
  if (!fs.existsSync(`../media/${msg.from.replace("@c.us", "")}`)) {
    fs.mkdirSync(
      `../media/${msg.from.replace("@c.us", "")}`,
      { recursive: true },
      (err) => {
        if (err) throw err;
      }
    );
  }
  try {
    const stream = ytdl(url, { filter: "audioonly" });
    const info = await ytdl.getBasicInfo(url);
    // title remove all special characters except - and _
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9-_ ]/g, "");
    ffmpeg(stream)
      .toFormat("mp3")
      .on("error", (err) => {
        console.error("An error occurred:", err.message);
      })
      .on("end", () => {
        console.log("Finished converting to MP3 format.");
      })
      .pipe(
        fs.createWriteStream(
          `../media/${msg.from.replace("@c.us", "")}${title}.mp3`
        )
      )
      .on("error", (err) => {
        console.error("An error occurred while saving the file:", err.message);
      })
      .on("finish", () => {
        console.log("File saved successfully.");
        const media = MessageMedia.fromFilePath(
          `../media/${msg.from.replace("@c.us", "")}${title}.mp3`
        );
        // send as document
        client
          .sendMessage(msg.from, media, {
            sendMediaAsDocument: true,
          })
          .then(() => {
            fs.unlinkSync(
              `../media/${msg.from.replace("@c.us", "")}${title}.mp3`
            );
          });
      });
  } catch (error) {
    client.sendMessage(
      msg.from,
      "Maaf, tidak dapat mengkonversi video tersebut 😢"
    );
    client.sendMessage(
      msg.from,
      "Alternatif lainnya adalah dengan menggunakan perintah */yt* 😊"
    );
  }
};

module.exports = ytmp3;
