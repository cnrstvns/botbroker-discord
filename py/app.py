import os
import discord
import requests
from discord.ext import commands
from json import loads, dumps
from dotenv import load_dotenv

load_dotenv()
client = commands.Bot(command_prefix=os.getenv("PREFIX"))

bot_ids = {
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

bot_keywords = {
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

bot_colors = {
    "MekAIO": 0x6185C5,
    "Nebula Omega": 0x8D82FA,
    "ScottBot": 0xFA8FB6,
    "VeloxPreme": 0x1B5194,
    "Wrath AIO": 0x2690C2,
    "Sole AIO": 0x1B1B2A,
    "Adept Supreme": 0xE8CCFD,
    "MekPreme": 0xDE3C3D,
    "Swft AIO": 0xFF5C5D,
    "Polaris AIO": 0xD3C7F5,
    "TohruAIO": 0xDB4F58,
    "Splashforce": 0x0B0B0B,
    "Prism AIO": 0xC26CDB,
    "Balkobot": 0x2B3340,
    "CyberAIO": 0x56FC82,
    "Project Destroyer": 0xD55093,
    "Phantom": 0xFED501,
    "Dashe": 0x4873B7
}

bot_images = {
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

BASE_URL = "https://api.botbroker.io/api/v2"
HEADERS = {
    "x-api-key": os.getenv("API_KEY")
}

def selectBot(botName):
    for item in bot_keywords:
        if botName in bot_keywords[item]:
            return item
    return "Product Not Found"

def selectId(botName):
    return bot_ids[botName]

def selectColor(botName):
    return bot_colors[botName]

def selectImage(botName):
    return bot_images[botName]

def productNotFound():
    return discord.Embed(title="Product Not Found", color=0x04C0FF)

def productEmbed(ctx, title, color, image, prices):
    embed = discord.Embed(title=title, color=color)
    embed.set_thumbnail(url=image)
    for price in prices:
        embed.add_field(name=price, value=prices[price], inline=False)
    embed.set_footer(icon_url=ctx.guild.icon_url, text="BotBroker v2")
    return embed

def determine(data):
    if data["asks"] == []:
        return "No Data Available."
    else:
        price = data["asks"][0]["price"]
        return f"${price}"

def fetchAsks(bot_id):
    response = requests.get(f"{BASE_URL}/asks?product_id={bot_id}&sort_by=price&order=asc&key_type=renewal", headers=HEADERS)
    renewal_data = determine(loads(response.text))
    response = requests.get(f"{BASE_URL}/asks?product_id={bot_id}&sort_by=price&order=asc&key_type=lifetime", headers=HEADERS)
    lifetime_data = determine(loads(response.text))
    return renewal_data, lifetime_data

def fetchBids(bot_id):
    response = requests.get(f"{BASE_URL}/bids?product_id={bot_id}&sort_by=price&order=desc&key_type=renewal", headers=HEADERS)
    renewal_data = determine(loads(response.text))
    response = requests.get(f"{BASE_URL}/bids?product_id={bot_id}&sort_by=price&order=desc&key_type=lifetime", headers=HEADERS)
    lifetime_data = determine(loads(response.text))
    return renewal_data, lifetime_data

@client.event
async def on_ready():
    print("Bot Connected to Discord")

@client.command(pass_context=True)
async def botbroker(ctx, query):
    bot = selectBot(query)
    if bot == "Product Not Found":
        return await ctx.send(embed=productNotFound())
    bot_id = selectId(bot)
    bot_color = selectColor(bot)
    bot_image = selectImage(bot)
    ask_data = fetchAsks(bot_id)
    bid_data = fetchBids(bot_id)
    renewal_ask = ask_data[0]
    lifetime_ask = ask_data[1]
    renewal_bid = bid_data[0]
    lifetime_bid = bid_data[1]

    price_data = {}
    if renewal_ask != "No Data Available.":
        price_data["Lowest Ask: Renewal"] = renewal_ask
    if renewal_bid != "No Data Available.":
        price_data["Highest Bid: Renewal"] = renewal_bid
    if lifetime_ask != "No Data Available.":
        price_data["Lowest Ask: Lifetime"] = lifetime_ask
    if lifetime_bid != "No Data Available.":
        price_data["Highest Bid: Lifetime"] = lifetime_bid
    await ctx.send(embed=productEmbed(ctx, bot, bot_color, bot_image, price_data))

client.run(os.getenv("DISCORD_TOKEN"))