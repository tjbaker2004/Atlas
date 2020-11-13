const cfg = require('./cfg.json');

const { MongoClient } = require('mongodb');
const client = new MongoClient(cfg.dbUrl);

const fs = require('fs');

const Discord = require('discord.js');
const bot = new Discord.Client();
bot.cmds = new Discord.Collection();

const cmdFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));

let nationsCount = 0;

for (const file of cmdFiles) {
    const cmd = require(`./cmds/${file}`);
    bot.cmds.set(cmd.name, cmd);
}

async function nationCount() {
    try {
        await client.connect();
        console.log('Connected Successfully!!!');
        const db = client.db(cfg.dbName);

        nationsCount = db.collection('nations').countDocuments();

        } catch (err) {
            console.log(err.stack);
    }

    finally {
        await client.close();
    }
}



bot.on('message', msg => {
    if (msg.content.startsWith(cfg.prefix)) {
        cmd = msg.content.slice(1);
        args = cmd.split(" ");
        
        if (args[0] == "register") {
            nationCount();
            bot.cmds.get('register').execute(cmd, args, nationCount);
        }
    }
})

bot.login(cfg.token);