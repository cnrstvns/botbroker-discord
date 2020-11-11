require('dotenv').config();
const { selectBot, productNotFound, selectColor, selectId, selectImage } = require('./utils');
const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = process.env.PREFIX;

client.on("ready", () => {
    console.log("Bot connected to Discord.");
})

client.on("message", async(message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if(command == "botbroker"){
        const bot = selectBot(args[0]);
        if(bot == "Product Not Found"){
            await message.channel.send(productNotFound());
        }
        else{
            const botColor = selectColor(bot);
            const botImage = selectImage(bot);
            const botId = selectId(bot);
            
        }
    }
})

client.login(process.env.TOKEN);