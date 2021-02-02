const Discord = require('discord.js');
const fs = require('fs');
const path = "./../quotes.json"; //Added to .gitignore
let quotes = require(path);
const config = require("../config.json"); //Added to .gitignore

module.exports = {
    name: "!gq",
    description: "The base command for the bot",

    processCommand: (msg, cmd) => {
        const commandList = ["a", "l", "help"];
        const cmdArgs = cmd.split(" ");
    
        if(commandList.includes(cmdArgs[0])) {
            switch(cmdArgs[0]) {
                case "a": 
                    module.exports.addQuote(msg, cmd.substring(cmd.indexOf(" "), cmd.length));
                    break;
                case "l":
                    module.exports.listQuotes(msg);
                    break;
                case "help":
                    module.exports.help(msg);
            }
        } else {
            msg.channel.send("Unknown command. For help, use *!gq help*");
        }
    },

    addQuote: (msg, quote) => {
        if(quote === "a") {
            msg.reply("Please call again with a quotation to add");
        } else {
            const quoteArgs = quote.split(/(["-])/);

            if(quoteArgs[1] === "\"" && quoteArgs[3] === "\"" && quoteArgs[5] === "-" && quoteArgs[6] !== "" && quoteArgs[6][0] === " ") {
                const quotation = quoteArgs[2];
                const author = quoteArgs[6].substring(1);

                quotes.push({
                    quote: quotation, 
                    author: author
                });

                const embededQuoteMessage = new Discord.MessageEmbed()
                    .setColor('#d78ee4')
                    .setThumbnail('https://i.kym-cdn.com/photos/images/original/000/689/757/270.jpg')
                    .setTitle('Successfully stored your quote!')
                    .setDescription(`"${quotation}" - ${author}`)
                    .setTimestamp()

                msg.reply(embededQuoteMessage);

                msg.client.channels.cache.get(config.textChannelID).send(new Discord.MessageEmbed()
                                                                .setColor('#d78ee4')
                                                                .setTitle(`"${quotation}"`)
                                                                .setDescription(`- ${author}`)
                                                                .setTimestamp()
                                                            );
            } else {
                msg.reply("Invalid quote format!");
            }
        }

        fs.writeFileSync("quotes.json", JSON.stringify(quotes, null, "\t"), error => {
            if(error){
                console.log("There was an error writing the file quotes.json");
                throw error;
            } else {
                console.log("Added new quotation to quotes.json");
            }
        });
    },

    listQuotes: (msg) => {
        if(quotes.length !== 0) {
            let embededQuoteMessage = new Discord.MessageEmbed()
                .setColor('#d78ee4')
                .setThumbnail('https://i.kym-cdn.com/photos/images/original/000/689/757/270.jpg')
                .setTitle('Saved Quotations')
                .setTimestamp();

            quotes.forEach(q => { embededQuoteMessage.addField(`"${q.quote}"`, q.author, false) });

            msg.channel.send(embededQuoteMessage);

            console.log("Listed all quotes from quotes.json");
        } else {
            msg.reply("There are currently no quotes stored. Please use *!gq a* to add some quotes first");
            console.log("Attempted to call list with empty quotes.json");
        }
    },

    help: (msg) => {
        let helpString = "Group Quotes Bot Commands *(Use !gq [command] [parameter] to use bot)* \n *!gq a [\"Quotation\" - Author]* - Adds a quotation to the local file\n *!gq l [Author]* - Lists all the quotations from the specified author. If called with no parameters, all quotations will be listed";
        msg.channel.send(helpString);
    },

    execute(msg) {
        const prefix = "!";

        if(msg.content[0] === prefix) {
            const args = msg.content.substring(msg.content.indexOf(" ") + 1, msg.content.length);

            if(args === "!gq") {
                msg.channel.send("Missing arguments! For help, use *!gq help*");
            } else {
                this.processCommand(msg, args);
            }
        }
    }
}