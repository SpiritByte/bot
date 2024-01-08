
// const { clientId, guildId, token, publicKey } = require('./config.json');
require('dotenv').config()
const APPLICATION_ID = process.env.APPLICATION_ID 
const TOKEN = process.env.TOKEN 
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set'
const GUILD_ID = process.env.GUILD_ID 
const GAME_ID_1 = (process.env.GAME_ID_1).split(" ")


const axios = require('axios')
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');


const app = express();
// app.use(bodyParser.json());

const discord_api = axios.create({
  baseURL: 'https://discord.com/api/',
  timeout: 3000,
  headers: {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
	"Access-Control-Allow-Headers": "Authorization",
	"Authorization": `Bot ${TOKEN}`
  }
});

function coinflip() {
	let number = Math.random();
	if (number < 0.5) {
	    return ("https://tenor.com/view/coinflip-heads-gif-22311983");
	} else {
	    return ("https://tenor.com/view/coinflip-tails-gif-22311991");
	}
}

function privateservers(interaction) {
      const chosenGame = interaction.data.options[0].value;

  let privateServerLinks = [];

  if (chosenGame === 'bss') {
    // Assuming GAME_ID_1 is the base ID for Bee Swarm Simulator
    for (const code of GAME_ID_1) {
      privateServerLinks.push(`https://www.roblox.com/games/1537690962/Bee-Swarm-Simulator?privateServerLinkCode=${code}`);
    }
  } else if (chosenGame === 'other') {
    // Handle other game option, if needed
    for (const code of GAME_ID_1) {
      // Generate links for another game
      privateServerLinks.push(`https://www.example.com/otherGamePrivateServerLink?privateServerLinkCode=${code}`);
    }
  }

  return privateServerLinks;
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
   function log(display) {
	const p = ' has claimed the faucet!'
        let webhook_url = 'https://discord.com/api/webhooks/1082676859063504936/jXVz5xdmLj_f1lso7P15GNwZVIe-9FM4nP6Cli6e3Pip--KmLiP_08hs8-XaGlQwPE_S';

        let params = {
            username: 'Faucet Claim Bot',
	    avatar: 'https://cdn.discordapp.com/attachments/1081352228557832334/1082678653554532432/discord_gambling_server.png',
            content: display.toString() + p,
        };

        return axios({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(params),
            url: webhook_url,
        });
    }

  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    console.log(interaction.data.name)
    if(interaction.data.name == 'coinflip'){
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: coinflip(),
        },
      });
    }

   if (interaction.data.name == 'privateservers'){
      log(interaction.member.user.username);
	   
      return res.send({
        // https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data:{
          content: privateservers(interaction),
        }
      });
    }
  }

});



app.get('/register_commands', async (req,res) =>{
	let slash_commands = [
	  {
	    "name": "coinflip",
	    "description": "Flips a coin!",
	    "options": []
	  },
	  {
	    "name": "privateservers",
	    "description": "Lists all current private servers.",
	    "options": [
	      {
	        "name": "game",
	        "description": "Filter by game.",
	        "type": 3,
	        "required": true,
	        "choices": [
	          {
	            "name": "Bee Swarm Simulator",
	            "value": "bss"
	          },
	          {
	            "name": "Other",
	            "value": "other"
	          }

	        ]
	      }
	    ]
	  }
	]

  try
  {
    // api docs - https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
    let discord_response = await discord_api.put(
      `/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`,
      slash_commands
    )
    console.log(discord_response.data)
    return res.send('commands have been registered')
  }catch(e){
    console.error(e.code)
    console.error(e.response?.data)
    return res.send(`${e.code} error from discord`)
  }
})


app.get('/', async (req,res) =>{
  return res.send('Follow Documentation ')
})


app.listen(8999, () => {

})
