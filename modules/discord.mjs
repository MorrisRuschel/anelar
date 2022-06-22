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
			// TODO passar essas configs para o github / aws
			server_status: '/966470279092129842',
			server_players_list: '/966476048952873011',
			server_players_online: '/983475044086841344'
		},
		messages:
		{
			base: '/messages'
		}
	}

	channels = 
	{
		async update( channel_id, name )
		{
			let url = Discord.config.api + Discord.config.channels.base + channel_id;
			
			let headers = 
			{
				method: 'PATCH',
				Authorization: process.env.DISCORD_BOT_TOKEN
			};
		
			let content = '{"name":"' + name + '"}';
	
			let payload = await Request.post( url, content, headers );
				payload = JSON.parse( payload );

			return ( payload?.id > 0 );
		},

		async players_online( name )
		{
			return await this.update( Discord.config.channels.server_players_online, name );
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

			return ( payload?.id > 0 );
		},

		async send_server_players_list( message )
		{
			return await this.send( Discord.config.channels.server_players_list, message );
		},

		async send_server_status( message )
		{
			return await this.send( Discord.config.channels.server_status, message );
		}
	}
}