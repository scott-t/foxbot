// local data
const tokens = require('./tokens/live.json');
const setitems = require('./data/setfile.json');

// required modules
const util = require('util')
const Discord = require("discord.js");
const request = require("request");
const cheerio = require('cheerio');
const fs = require('fs');
//const TwitchApi = require('twitch-api');


// local modules
const golden = require('./modules/golden.js');
const luxury = require('./modules/luxury.js');
const status = require('./modules/server.js');
const getset = require('./modules/sets.js');
const help = require('./modules/help.js');
const pledges = require('./modules/pledges.js');
const trials = require('./modules/trials.js');
const log = require('./modules/log.js');
const gettwitch = require('./modules/twitch.js');
const contact = require('./modules/contact.js');
const youtube = require('./modules/youtube.js');
const patchnotes = require('./modules/patchnotes.js');

// logging requests 
const logfile = "logs/requests.log";
const logchannel = "301074654301388800"

// setting up global variables

var bot = new Discord.Client();

var gsDayNames = new Array(
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
);

// functions
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}



// listening for messages
bot.on("message", (msg) => {
    // Set the prefix
    let prefix = "!";
    // Exit and stop if it's not there or another bot
    if (!msg.content.startsWith(prefix)) return;
    if (msg.author.bot) return;

	log(msg, msg.content, fs, logfile, bot);

	
	var responses = {
		"!help" 	: function(){help(bot, msg);}, 
		"!pledges" 	: function(){pledges(bot, msg, request, cheerio);}, 
		"!pledge" 	: function(){pledges(bot, msg, request, cheerio);}, 
		"!dailies" 	: function(){pledges(bot, msg, request, cheerio);}, 
		"!daily" 	: function(){pledges(bot, msg, request, cheerio);}, 
		"!trials" 	: function(){trials(bot, msg, request, cheerio, util);}, 
		"!trial" 	: function(){trials(bot, msg, request, cheerio, util);}, 
		"!golden" 	: function(){golden(bot, msg, gsDayNames, request, cheerio);}, 
		"!luxury" 	: function(){luxury(bot, msg, gsDayNames, request, cheerio);}, 
		"!status" 	: function(){status(bot, msg, request, cheerio);}, 
		"!server" 	: function(){status(bot, msg, request, cheerio);}, 
		"!set" 		: function(){msg.channel.sendMessage("Please call the command with at least some characters of the setname, e.g. !set skel")}, 
	//	"!test" 	: function(){msg.channel.sendMessage("No testing function at the moment ");}, 
	//	"!fox" 		: function(){msg.channel.sendMessage("Yeah, the FoX!");}, 
		"!twitch" 	: function(){gettwitch(bot, msg, tokens["twitch"], util, request);}, 
		"!youtube" 	: function(){youtube(bot, msg, request, youtube);}, 
		"!patch" 	: function(){patchnotes(bot, msg, request, cheerio);}, 
		"!contact" 	: function(){contact(bot, msg);}, 
		};


	// var yyy = pledges(bot, msg, request, cheerio);


	if (responses[msg]) {responses[msg]();
	} else if (msg.content.startsWith(prefix + "set")) {
         getset(bot, msg, setitems);
    } // else {
//          	msg.channel.sendEmbed({
//   				color: 0x800000,
//   				title:"Command not found",
//   				description: " try one of: " + Object.keys(responses).join(", "),
//   				fields: [{
//        				 name: "Your suggestion?",
//        				 value: "If you feel that your command should be implemented into the bot, contact <@218803587491299328>"
//      			 }
//     			]    		
// 			});			
//     }  
        
//currently disabled the unknown command because of other both's interferring

});

// startup
bot.on('ready', () => {
    console.log('Fox Bot initiated!');
    console.log('Running on ' +  bot.guilds.size + ' servers:');
    
    bot.user.setGame("!help for commands");

    var guildNames = bot.guilds.array().map(s=>s.name ).join("; ")
    console.log(guildNames);

});

bot.on('guildCreate', guild => {
	var guildCreate =  guild +  "\t" +  guild.owner + "\tGuild added\t\t";// + msg.createdAt;
	fs.appendFile(logfile, guildCreate , function (err) {});
	console.log(guildCreate);
  	bot.channels.get(logchannel).sendMessage(guildCreate)

});

bot.on('error', error => {
    console.log(error);
  	bot.channels.get(logchannel).sendMessage(error)

    process.exit(1);
});

process.on('unhandledRejection', error => {
  	bot.channels.get(logchannel).sendMessage('-- Warning: unhandled Rejection received')

});

bot.login(tokens["discord"]);