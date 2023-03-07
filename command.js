// authenticates you with the API standard library
const lib = require('lib')({token: process.env.TOKEN});

lib.discord.users['@0.2.1'].me.status.update({
  activity_name: `your mom lmfaooo`,
  activity_type: 'WATCHING',
  status: 'ONLINE'
});
