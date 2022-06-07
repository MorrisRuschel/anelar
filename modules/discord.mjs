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
			server_status: '/966470279092129842'
		},
		messages:
		{
			base: '/messages'
		}
	}

	messages = 
	{
		async send_server_status( message )
		{
			let url = Discord.config.api + Discord.config.channels.base + Discord.config.channels.server_status + Discord.config.messages.base;
			
			let headers = 
			{
				Authorization: process.env.DISCORD_BOT_TOKEN
			};
		
			let content = '{"content":"' + message + '"}';
	
			let payload = await Request.post( url, content, headers );
				payload = JSON.parse( payload );

			return ( payload?.id > 0 );
		}
	}
}