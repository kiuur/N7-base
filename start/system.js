
/*
 * source: https://github.com/kiuur
 * youtube: @kyuurzy
 * gada fitur bjir, add sendiri
*/

require('../setting/config');
const fs = require('fs');
const util = require("util");
const moment = require("moment-timezone");
const {
  spawn,
  exec, 
  execSync 
} = require('child_process');

const { 
  default:
  baileys,
  proto, 
  generateWAMessage,
  generateWAMessageFromContent,
  getContentType, 
  prepareWAMessageMedia
} = require("@whiskeysockets/baileys");
const { ok } = require('assert');

module.exports = client = async (client, m, chatUpdate, store) => {
  try {
    const body = (
      m.mtype === "conversation" ? m.message.conversation :
      m.mtype === "imageMessage" ? m.message.imageMessage.caption :
      m.mtype === "videoMessage" ? m.message.videoMessage.caption :
      m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
      m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
      m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
      m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
      m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
      m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : ""
);
    const sender = m.key.fromMe ? client.user.id.split(":")[0] + "@s.whatsapp.net" || client.user.id : m.key.participant || m.key.remoteJid;
    const senderNumber = sender.split('@')[0];
    const budy = (typeof m.text === 'string' ? m.text : '');
    const prefa = ["", "!", ".", ",", "🐤", "🗿"];
    const prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><™©®Δ^βα¦|/\\©^]/.test(body) ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!™©®Δ^βα¦|/\\©^]/gi) : '.';
    const from = m.key.remoteJid;
    const isGroup = from.endsWith("@g.us");
    const kontributor = JSON.parse(fs.readFileSync('./start/lib/database/owner.json'));

    const botNumber = await client.decodeJid(client.user.id);
    const Access = [botNumber, ...kontributor, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
    const isCmd = body.startsWith(prefix);
    const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const text = q = args.join(" ");
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || '';
    const qmsg = (quoted.msg || quoted);
    const isMedia = /image|video|sticker|audio/.test(mime);

    const groupMetadata = isGroup ? await client.groupMetadata(m.chat).catch((e) => {}) : "";
    const groupOwner = isGroup ? groupMetadata.owner : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";
    const participants = isGroup ? await groupMetadata.participants : "";
    const groupAdmins = isGroup ? await participants.filter((v) => v.admin !== null).map((v) => v.id) : "";
    const groupMembers = isGroup ? groupMetadata.participants : "";
    const isGroupAdmins = isGroup ? groupAdmins.includes(m.sender) : false;
    const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
    const isBotAdmins = isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = isGroup ? groupAdmins.includes(m.sender) : false;

    const { 
      smsg,
      formatSize,
      isUrl,
      generateMessageTag,
      getBuffer,
      getSizeMedia,
      runtime,
      fetchJson,
      sleep 
    } = require('./lib/myfunction');

    const time = moment.tz("Asia/Makassar").format("HH:mm:ss");
    
    if (m.message) {
      console.log('\x1b[30m--------------------\x1b[0m');
      console.log('\x1b[1m\x1b[41m\x1b[97m▢ New Message\x1b[0m');
      console.log('\x1b[42m\x1b[30m' +
    `   ⌬ Tanggal: ${new Date().toLocaleString()} \n` +
    `   ⌬ Pesan: ${m.body || m.mtype} \n` +
    `   ⌬ Pengirim: ${m.pushname} \n` +
    `   ⌬ JID: ${senderNumber}\x1b[0m`
  );

    if (m.isGroup) {
      console.log('\x1b[42m\x1b[30m' +
      `   ⌬ Grup: ${groupName} \n` +
      `   ⌬ GroupJid: ${m.chat}\x1b[0m`
    );
  }

  console.log();
}
  
switch (command) {
  
  case 'menu':{
    m.reply("\n")
  }
  break

  default:
    if (budy.startsWith('>')) {
      if (!Access) return;
      try {
        let evaled = await eval(budy.slice(2));
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
        await m.reply(evaled);
      } catch (err) {
        m.reply(String(err));
      }
    }
        
    if (budy.startsWith('<')) {
      if (!Access) return
        let kode = budy.trim().split(/ +/)[0]
          let teks
            try {
              teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${q}})()`)
            } catch (e) {
              teks = e
            } finally {
              await m.reply(require('util').format(teks))
            }
    }

    if (budy.startsWith('-')) {
      if (!Access) return         
      if (text == "rm -rf *") return m.reply("😹")
        exec(budy.slice(2), (err, stdout) => {
      if (err) return m.reply(`${err}`)
        if (stdout) return m.reply(stdout)  
        })
      }
         
  }
  } catch (err) {
    console.log(require("util").format(err));
  }
};

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file);
  console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
  delete require.cache[file];
  require(file);
});
