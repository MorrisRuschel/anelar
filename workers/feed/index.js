"use strict";

import { request } from '../../modules/request.mjs';

class discord
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

	static messages = 
	{
		async send_server_status( message )
		{
			let url = discord.config.api + discord.config.channels.base + discord.config.channels.server_status + discord.config.messages.base;
			
			let headers = 
			{
				Authorization: process.env.DISCORD_BOT_TOKEN
			};
		
			let content = '{"content":"' + message + '"}';
	
			return await request.post( url, content, headers );
		}
	}
}

// Adicionar uma interface
class nitrado
{
	static config = 
	{
		api: 'https://api.nitrado.net',
		services:
		{
			base: '/services'
		},
		notifications:
		{
			base: '/notifications'
		}
	}

	static notifications = 
	{
		async get()
		{
			let url = nitrado.config.api + nitrado.config.services.base + '/' + process.env.NITRADO_SERVER_ID + nitrado.config.notifications.base;

			let options = {
				headers:
				{
					Authorization: process.env.NITRADO_ACCOUNT_TOKEN
				}
			};
			
			let payload = await request.get( url, options );
				payload = JSON.parse( payload );

			return payload;
		}
	} 
}

export const handler = async (event) => {

	let response = {
		statusCode: 200,
		body: JSON.stringify('Error #01. Internal error.'),
	};

	let notifications = await nitrado.notifications.get();

	if ( notifications?.status == 'success' )
	{
		let submit;

		if ( notifications?.data?.notifications?.length > 0 )
		{
			submit = await discord.messages.send_server_status( 'Verificar status na Nitrado' );

			if ( submit?.id > 0 )
			{
				response = {
					statusCode: 200,
					body: JSON.stringify('Success #01. Internal success.'),
				};
			}
			else
			{
				response = {
					statusCode: 200,
					body: JSON.stringify('Error #03. Internal error.'),
				};
			}
		}
		else
		{
			//submit = await discord.messages.send_server_status( 'Sem notificações na Nitrado' );

			response = {
				statusCode: 200,
				body: JSON.stringify('Success #02. Internal success.'),
			};
		}
	}
	else
	{
		response = {
			statusCode: 200,
			body: JSON.stringify('Error #02. Internal error.'),
		};
	}
	
	return response;
};