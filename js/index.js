require('dotenv').config();
const { selectBot, productNotFound, selectColor, selectId, selectImage, fetchBids, fetchAsks, productEmbed } = require('./utils');
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
    const icon = message.guild.iconURL;

    if(command == "botbroker"){
        const bot = selectBot(args[0]);
        if(bot == "Product Not Found"){
            await message.channel.send(productNotFound());
        }
        else{
            const botColor = selectColor(bot);
            const botImage = selectImage(bot);
            const botId = selectId(bot);
            const askData = await fetchAsks(botId);
            const bidData = await fetchBids(botId);
            const renewalAsk = askData[0];
            const lifetimeAsk = askData[1];
            const renewalBid = bidData[0];
            const lifetimeBid = bidData[1];
            let priceData = {};
            if (renewalAsk != "No Data Available."){
                priceData["Lowest Ask: Renewal"] = renewalAsk;
            }
            if (renewalBid != "No Data Available."){
                priceData["Highest Bid: Renewal"] = renewalBid;
            }
            if (lifetimeAsk != "No Data Available."){
                priceData["Lowest Ask: Lifetime"] = lifetimeAsk;
            }
            if (lifetimeBid != "No Data Available."){
                priceData["Highest Bid: Lifetime"] = lifetimeBid;
            }
            await message.channel.send(productEmbed(icon, bot, botColor, botImage, priceData));
        }
    }
})

client.login(process.env.TOKEN);