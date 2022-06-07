'use strict';

import Request from './request.mjs';

export default class Discord
{
	static config =
	{
		api: 'https://discord.com/api/v10',
		channels:
		{
			base: '/channels',
			server_logs: '/966470279092129842',
			server_players: '/966476048952873011'
		},
		messages:
		{
			base: '/messages'
		}
	}

	messages = 
	{
		async send( channel_id, message )
		{
			let url = Discord.config.api + Discord.config.channels.base + channel_id + Discord.config.messages.base;
			
			let headers = 
			{
				Authorization: process.env.DISCORD_BOT_TOKEN
			};
		
			let content = '{"content":"' + message + '"}';
	
			let payload = await Request.post( url, content, headers );
				payload = JSON.parse( payload );
		console.log(payload)
			return ( payload?.id > 0 );
		},

		async send_server_logs( message )
		{
			return await this.send( Discord.config.channels.server_logs, message );
		},

		async send_server_players( message )
		{
			return await this.send( Discord.config.channels.server_players, message );
		}
	}
}