const Discord = require("discord.js");
const config = require("./config.json");
const botCommands = require("./commands")
const bot = new Discord.Client();
const fs = require('fs');
const path = "./quotes.json"; 

bot.commands = new Discord.Collection();

bot.login(config.bot_token);

Object.keys(botCommands).map(key => bot.commands.set(botCommands[key].name, botCommands[key]));

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);

    if(!fs.existsSync(path)) {
        let quoteJSON = [];

        let quoteString = JSON.stringify(quoteJSON);

        fs.writeFile("quotes.json", quoteString, function(error, result) {
            if(error) {
                console.log("There was an error writing the file quotes.json")
            }
            else {
                console.log("Created quotes.json");
            }
        });
    }
});

bot.on('message', msg => {
    const args = msg.content.split(/ +/);
    const command = args.shift().toLowerCase();
    console.info(`Called command: ${command}`);

    if (!bot.commands.has(command)) return;

    try {
        bot.commands.get(command).execute(msg, args);
    }
    catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
});