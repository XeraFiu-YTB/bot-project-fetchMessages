const Discord = require('discord.js');
const client = new Discord.Client();
const mysql = require('mysql');

let sum_messages = []
let data = []
var last_id
var ok = true

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async(msg) => {
  if (msg.content === 'back') {
    const sqlClient = mysql.createPool({
      database: "backup_tchoow",
      host: "localhost",
      user: "root",
      password: ""
    })

    var n = 0
    const commands = client.channels.cache.find(c => c.id == 'IdDuChannel')

    while (sum_messages.length <= 99999) {
      const options = { limit: 100 };
      if (last_id) {
          options.before = last_id;
      }

      const messages = await commands.messages.fetch(options);
      sum_messages.push(...messages.array());
      last_id = messages.last().id;

      if (messages.size != 100) {
          console.log('Plus de messages')
      }
      console.log(sum_messages.length)
    }
    console.log("Fin de l'enregistrement des messages")

    sum_messages.forEach(async (msg) => {
      if (msg.content.toLowerCase() == '*profil' && data[n]) {
        for (var l = 0; l < data.length; l++) {
          if (data[l].includes(msg.author.id)) {
            return data.pop([n])
          }
        }
        data[n].push(msg.author.id)

        if (Number(data[n][3])) {
          const request = `INSERT INTO backuppp (id_user, tipeee_name, views_tipeee) VALUES ("${data[n][3]}", "${data[n][1]}", "${data[n][2]}")`
          sqlClient.query(request, (err, result) => {if(err) throw err})
        }
        n++
      }

      if (msg.embeds[0]) {
        if (msg.embeds[0].title == 'Profil') {
          data.push([])
          data[n].push(msg.embeds[0].fields[0].value, msg.embeds[0].fields[1].value, msg.embeds[0].fields[2].value /2)
        }
      }
    })
    
    console.log(data)
  }
});

client.login('-');