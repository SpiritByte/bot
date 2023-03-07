
// const { clientId, guildId, token, publicKey } = require('./config.json');
require('dotenv').config()
const APPLICATION_ID = process.env.APPLICATION_ID 
const TOKEN = process.env.TOKEN 
const PUBLIC_KEY = process.env.PUBLIC_KEY || 'not set'
const GUILD_ID = process.env.GUILD_ID 


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

function main(sus) {
	let number = Math.random();
	 if ( sus === true ) {
		 return 
     	}
	if (number < 0.5) {
	    return ("https://tenor.com/view/coinflip-heads-gif-22311983");
	} else {
	    return ("https://tenor.com/view/coinflip-tails-gif-22311991");
	}
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
   function log(msg) {
	const p = ' has claimed the faucet!'
	const g = interaction.member.displayName
        let webhook_url = 'https://discord.com/api/webhooks/1082676859063504936/jXVz5xdmLj_f1lso7P15GNwZVIe-9FM4nP6Cli6e3Pip--KmLiP_08hs8-XaGlQwPE_S';

        let params = {
            username: 'Faucet Claim Bot',
	    avatar: 'https://cdn.discordapp.com/attachments/1081352228557832334/1082678653554532432/discord_gambling_server.png',
            content: `${interaction.member.nickname}#${interaction.author.tag.split("#").pop()})`,
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
          content: main(),
        },
      });
    }

   if (interaction.data.name == 'faucet'){
	log('test');

      return res.send({
        // https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data:{
          content:"Faucet claimed successfully!! You will receive your gems in at most 1 day."
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
      "name": "faucet",
      "description": "Claims 10 million gems every hour.",
      "options": []
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
