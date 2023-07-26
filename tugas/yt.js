const { youtubedl } = require("@bochilteam/scraper");

const getLinkDownload = async (link) => {
  let title = "";
  let thumb = "";
  let videoLinks = {};
  let audioLinks = {};
  await youtubedl(link).then(async (res) => {
    title = res.title;
    thumb = res.thumbnail;
    const video = res.video;
    const videoOrdered = Object.keys(video)
      .sort()
      .reverse()
      .reduce((obj, key) => {
        obj[key] = video[key];
        return obj;
      }, {});
    for (const key in videoOrdered) {
      const res = await videoOrdered[key].download();
      if (key !== "auto") {
        videoLinks[key] = res;
      }
    }

    const audio = res.audio;
    const audioOrdered = Object.keys(audio)
      .sort()
      .reverse()
      .reduce((obj, key) => {
        obj[key] = audio[key];
        return obj;
      }, {});
    for (const key in audioOrdered) {
      const res = await audioOrdered[key].download();
      if (key !== "auto") {
        audioLinks[key] = res;
      }
    }
  });

  return { title, thumb, videoLinks, audioLinks };
};

const yt = async (url, msg, client, MessageMedia) => {
  if (
    !url ||
    url === "" ||
    url === undefined ||
    (!url.includes("youtube") && !url.includes("youtu.be"))
  ) {
    client.sendMessage(msg.from, "Harap memasukkan url youtube 😊");
    return;
  }

  try {
    client.sendMessage(msg.from, "Sedang di proses 😊...");
    const nabilaba = await getLinkDownload(url);
    let txt = "*Link Download*\n";
    txt += `Judul : *${nabilaba.title}*\n\n`;

    if (nabilaba.videoLinks) {
      txt += "🎥 Video\n";
      for (const key in nabilaba.videoLinks) {
        txt += `🔗 *${key}* - ${nabilaba.videoLinks[key]}\n`;
      }
    }

    if (nabilaba.audioLinks) {
      txt += "\n:🎵 Mp3\n";
      for (const key in nabilaba.audioLinks) {
        txt += `🔗 *${key}* - ${nabilaba.audioLinks[key]}\n`;
      }
    }

    txt += "\n*_Sponsored by dl.mate_*";
    // send media message
    const media = await MessageMedia.fromUrl(nabilaba.thumb);
    client.sendMessage(msg.from, media, {
      caption: txt,
    });
  } catch (err) {
    console.log(err);
    client.sendMessage(
      msg.from,
      "Maaf, tidak dapat mengambil link download 😢"
    );
  }
};

module.exports = yt;
