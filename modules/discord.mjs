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
			server_logs: '/966470279092129842',
			server_players: '/966476048952873011',
			server_players_online: '/983475044086841344'
		},
		messages:
		{
			base: '/messages'
		}
	}

	channels = 
	{
		// TODO adicionar método de troca de nome de canal

		async players_online( name )
		{
			let url = Discord.config.api + Discord.config.channels.base + Discord.config.channels.server_players_online;
			
			let headers = 
			{
				method: 'PATCH',
				Authorization: process.env.DISCORD_BOT_TOKEN
			};
		
			let content = '{"name":"' + name + '"}';
	
			let payload = await Request.post( url, content, headers );
				payload = JSON.parse( payload );

			return ( payload?.id > 0 );
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

		async send_server_logs( players )
		{
			let message = '**Player List**\\n';

			for ( let player in players )
			{
				message += player.gamertag + ' ' + iZurvive.config.api + iZurvive.config.location.base + player.position + '\\n';
			}
				//players = players.replace( /"/g, '\'' ).replace( /\n/g, '\\n' );

			return await this.send( Discord.config.channels.server_logs, message );
		},

		async send_server_players( message )
		{
			return await this.send( Discord.config.channels.server_players, message );
		}
	}
}