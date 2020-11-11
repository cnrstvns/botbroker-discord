require('dotenv').config();
const got = require('got');
const { MessageEmbed } = require('discord.js');

const BASE_URL = "https://api.botbroker.io/api/v2"
const HEADERS = {
    "x-api-key": process.env.API_KEY
}

const bot_ids = {
    "MekAIO": 97,
    "Nebula Omega": 96,
    "ScottBot": 92,
    "VeloxPreme": 91,
    "Wrath AIO": 49,
    "Sole AIO": 47,
    "Adept Supreme": 30,
    "MekPreme": 24,
    "Swft AIO": 22,
    "Polaris AIO": 18,
    "TohruAIO": 17,
    "Splashforce": 11,
    "Prism AIO": 10,
    "Balkobot": 8,
    "CyberAIO": 6,
    "Project Destroyer": 5,
    "Phantom": 2,
    "Dashe": 4
}

const bot_keywords = {
    "MekAIO": ["mekaio", "mek aio"],
    "Nebula Omega": ["nebula", "nebula omega"],
    "ScottBot": ["scottbot", "scott"],
    "VeloxPreme": ["veloxpreme", "velox"],
    "Wrath AIO": ["wrath aio", "wrath", "wrathaio"],
    "Sole AIO": ["sole aio", "sole"],
    "Adept Supreme": ["adept supreme", "adept"],
    "MekPreme": ["mekpreme", "mek"],
    "Swft AIO": ["swft aio", "swft"],
    "Polaris AIO": ["polaris aio", "polaris"],
    "TohruAIO": ["tohruaio", "tohru"],
    "Splashforce": ["splashforce", "splash", "sf"],
    "Prism AIO": ["prism aio", "prism"],
    "Balkobot": ["balkobot", "balko"],
    "CyberAIO": ["cybersole aio", "cybersole", "cyber", "cyberaio"],
    "Project Destroyer": ["project destroyer", "pd"],
    "Phantom": ["phantom", "ghost"],
    "Dashe": ['dashe']
}

const bot_colors = {
    "MekAIO": "#6185C5",
    "Nebula Omega": "#8D82FA",
    "ScottBot": "#FA8FB6",
    "VeloxPreme": "#1B5194",
    "Wrath AIO": "#2690C2",
    "Sole AIO": "#1B1B2A",
    "Adept Supreme": "#E8CCFD",
    "MekPreme": "#DE3C3D",
    "Swft AIO": "#FF5C5D",
    "Polaris AIO": "#D3C7F5",
    "TohruAIO": "#DB4F58",
    "Splashforce": "#0B0B0B",
    "Prism AIO": "#C26CDB",
    "Balkobot": "#2B3340",
    "CyberAIO": "#56FC82",
    "Project Destroyer": "#D55093",
    "Phantom": "#FED501",
    "Dashe": "#4873B7"
}

const bot_images = {
    "MekAIO": "https://i.imgur.com/LYQO1qo.png",
    "Nebula Omega": "https://i.imgur.com/hPJp35q.png",
    "ScottBot": "https://res.cloudinary.com/dklrin11o/image/twitter_name/w_600/scottbotv1.jpg",
    "VeloxPreme": "https://i.imgur.com/dmKhHKd.jpg",
    "Wrath AIO": "https://i.imgur.com/yBSkNgV.png",
    "Sole AIO": "https://i.imgur.com/AOUoxYF.png",
    "Adept Supreme": "https://i.imgur.com/vFTqsqa.png",
    "MekPreme": "https://i.imgur.com/fcFl3u7.png",
    "Swft AIO": "https://i.imgur.com/RQYnXeq.png",
    "Polaris AIO": "https://res.cloudinary.com/dklrin11o/image/twitter_name/w_600/polarisaio.jpg",
    "TohruAIO": "https://res.cloudinary.com/dklrin11o/image/twitter_name/w_600/tohruaio.jpg",
    "Splashforce": "https://i.imgur.com/br7M061.png",
    "Prism AIO": "https://i.imgur.com/NxL1ajE.png",
    "Balkobot": "https://i.imgur.com/InY7MMU.png",
    "CyberAIO": "https://i.imgur.com/cvdVKqb.png",
    "Project Destroyer": "https://i.imgur.com/pF9aUGu.png",
    "Phantom": "https://i.imgur.com/8satPLU.png",
    "Dashe": "https://i.imgur.com/CV6MWXM.png"
}

const selectBot = botName => {
    let result;
    for(bot in bot_keywords){
        if(bot_keywords[bot].includes(botName)) return bot;
    }
    return "Product Not Found"
}

const selectId = botName => {
    return bot_ids[botName];
}

const selectColor = botName => {
    return bot_colors[botName];
}

const selectImage = botName => {
    return bot_images[botName];
}

const productNotFound = () => {
    return new MessageEmbed()
    .setTitle("Product Not Found")
    .setColor("#04C0FF")
}

const determine = data => {
    if(data.asks.length == 0) return "No Data Available.";
    else {
        const price = data.asks[0].price;
        return `$${price}`
    }
}

const productEmbed = (icon, title, color, image, prices) => {
    const embed = new MessageEmbed()
    .setTitle(title)
    .setColor(color)
    .setThumbnail(image)
    .addFields(Object.keys(prices).map((item) => {
        return {name: item, value: prices[item], inline: false}
    }))
    .setFooter("BotBroker v2", icon); 
    return embed;
}

const fetchAsks = async(botId) => {
    try{
        const { body: renewalBody } = await got(`${BASE_URL}/asks?product_id=${botId}&sort_by=price&order=asc&key_type=renewal`, {
            headers: HEADERS,
            responseType: 'json'
        })
        const renewalData = determine(renewalBody);
        const { body: lifetimeBody } = await got(`${BASE_URL}/asks?product_id=${botId}&sort_by=price&order=asc&key_type=lifetime`, {
            headers: HEADERS,
            responseType: 'json'
        })
        const lifetimeData = determine(lifetimeBody);
        return [renewalData, lifetimeData];
    }
    catch(err){
        return ["Error Fetching Data", "Error Fetching Data"];
    }
}

const fetchBids = async(botId) => {
    try{
        const { body: renewalBody } = await got(`${BASE_URL}/bids?product_id=${botId}&sort_by=price&order=desc&key_type=renewal`, {
            headers: HEADERS,
            responseType: 'json'
        })
        const renewalData = determine(renewalBody);
        const { body: lifetimeBody } = await got(`${BASE_URL}/asks?product_id=${botId}&sort_by=price&order=desc&key_type=lifetime`, {
            headers: HEADERS,
            responseType: 'json'
        })
        const lifetimeData = determine(lifetimeBody);
        return [renewalData, lifetimeData];
    }
    catch(err){
        return ["Error Fetching Data", "Error Fetching Data"];
    }
}

module.exports = {
    selectBot: selectBot,
    selectId: selectId,
    selectColor: selectColor,
    selectImage: selectImage,
    fetchAsks: fetchAsks,
    fetchBids: fetchBids,
    productNotFound: productNotFound,
    productEmbed: productEmbed
}