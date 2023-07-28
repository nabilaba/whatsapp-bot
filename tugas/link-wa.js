const linkWa = (msg, client) => {
  // create link wa pengirim
  const link = `*Link WA kamu*\nhttps://wa.me/${msg.from.replace(
    "@c.us",
    ""
  )}\n*Atau*\napi.whatsapp.com/send?phone=${msg.from.replace("@c.us", "")}`;
  client.sendMessage(msg.from, link);
};

module.exports = linkWa;
