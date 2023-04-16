const MAIN = "https://easytickets-dashboard.leontm-official.repl.co";
//Datei-Einstellungen
const Discord = require("discord.js");
const http = require("http");
// const fetch = require("@replit/node-fetch");
const editJsonFile = require("edit-json-file");
const { EmbedBuilder, PermissionBitFlags } = require("@discordjs/builders");
const env = require("dotenv").config();
//Server-Einstellungen
const server = http.createServer((req, res) => {
    res.write("Discord-DamnBot");
});
server.listen();
const FARBE = Discord.Colors;
//Datenbank-Einstellungen

//Funktionen
function getDifferenceInDates(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    let ergebnis = diffInMs / (1000 * 60 * 60 * 24);
    if (ergebnis >= 1 && ergebnis < 2) {
      return String(Math.round(ergebnis) + " Tag");
    } else if(ergebnis >= 2) {
      return String(Math.round(ergebnis) + " Tagen");
    } else if (ergebnis < 1) {
      ergebnis = diffInMs / (1000 * 60 * 60);
      if (ergebnis >= 1 && ergebnis < 2) {
          return String(Math.round(ergebnis) + " Stunde");
      } else if (ergebnis >= 2) {
          return String(Math.round(ergebnis) + " Stunden");
      } else if (ergebnis < 1) {
          ergebnis = diffInMs / (1000 * 60);
          if (ergebnis >= 1 && ergebnis <=2) {
              return String(Math.round(ergebnis) + " Minute");
          } else if (ergebnis >= 2) {
              return String(Math.round(ergebnis) + " Minuten");
          } else if (ergebnis < 1) {
              ergebnis = diffInMs / 1000;
              if (ergebnis >=1 && ergebnis < 2) {
                  return String(Math.round(ergebnis) + " Sekunde");
              } else if (ergebnis >= 2) {
                  return String(Math.round(ergebnis) + " Sekunden");
              } else if (ergebnis < 1) {
                  return String(ergebnis + " Millisekunden");
              }
          }
      }
    }
};
function intToString(num) {
    num = num.toString().replace(/[^0-9.]/g, '');
    if (num < 1000) {
        return num;
    }
    let si = [
      {v: 1E3, s: "K"},
      {v: 1E6, s: "M"},
      {v: 1E9, s: "B"},
      {v: 1E12, s: "T"},
      {v: 1E15, s: "P"},
      {v: 1E18, s: "E"}
      ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
        if (num >= si[index].v) {
            break;
        }
    }
    return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
};
//Client-Einstellungen
const client = new Discord.Client(
    {
        partials: [
            Discord.Partials.Channel,
            Discord.Partials.GuildMember,
            Discord.Partials.Message,
            Discord.Partials.Reaction,
            Discord.Partials.ThreadMember,
            Discord.Partials.GuildScheduledEvent
        ],
        intents: [
            Discord.GatewayIntentBits.Guilds,
            Discord.GatewayIntentBits.DirectMessages,
            Discord.GatewayIntentBits.GuildBans,
            Discord.GatewayIntentBits.GuildEmojisAndStickers,
            Discord.GatewayIntentBits.GuildIntegrations,
            Discord.GatewayIntentBits.GuildInvites,
            Discord.GatewayIntentBits.GuildMembers,
            Discord.GatewayIntentBits.GuildMessages,
            Discord.GatewayIntentBits.GuildMessageReactions,
            Discord.GatewayIntentBits.MessageContent,
            Discord.IntentsBitField.Flags.Guilds,
            Discord.IntentsBitField.Flags.GuildBans,
            Discord.IntentsBitField.Flags.DirectMessages,
            Discord.IntentsBitField.Flags.GuildEmojisAndStickers,
            Discord.IntentsBitField.Flags.GuildInvites,
            Discord.IntentsBitField.Flags.GuildMembers,
            Discord.IntentsBitField.Flags.GuildMessages,
            Discord.IntentsBitField.Flags.MessageContent
        ]
    }
);
//Client-Start
client.on("ready", function(){
    console.log("Bot wird gestartet!");
    console.log(`Eingeloggt als ${client.user.tag}`);
    console.log(`Bot gestartet (${Date.now()})`);
    setInterval(() => {
        client.guilds.cache.forEach(g => {
            let id = g.toJSON().id
            fetch(`${MAIN}/api/new/servers/${id}/${JSON.stringify(g.toJSON())}`, {
                method: "GET"
            })
            .then(res => res.json())
            .then(data => {data})
            .catch(err => {
                console.log(err);
            });
        });
    }, 43200000)
});
//Client-Wiederverbinden
client.on("shardReconnecting", function(){
    console.log("Es wird versucht sich erneut mit dem WebSocket zu verbinden!");
});
//Client-Wiederverbunden
client.on("shardResume", function(){
    console.log("Der Bot hat sich wieder verbunden!")
});
//Client-Warnung
client.on("warn", function(info){
    console.log(`Warnung: ${info}`);
});
//Client-Verbindungsabbruch
client.on("shardDisconnect", function(event){
    console.log("Der Bot hat die Verbindung abgebrochen und wird sie nicht mehr eigenständig aufnehmen!");
});
//Client-Fehler
client.on("error", function(error){
    console.log(`Ein Verbindungsfehler ist aufgetreten: ${error}`);
});
client.login(process.env["TOKEN"]);

// Server-Events
client.on("guildCreate", async (guild) => {
    let id = guild.toJSON().id;
    fetch(`${MAIN}/api/servers/new/${id}/${JSON.stringify(guild.toJSON())}`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        data;
    })
    .catch(err => {
        console.error(err);
    })
});
client.on("guildDelete", async (guild) => {
    fetch(`${MAIN}/api/servers/del/${guild.toJSON().id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        data
    })
    .catch(err => {
        console.error(err)
    })
});