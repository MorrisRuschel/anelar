import request from '/modules/request';

class discord
{
	config =
	{
		api = 'https://discord.com/api/v10',
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
		async send( channel_id, message )
		{
			let url = this.config.api + this.config.channels.base + this.config.channels.server_status + this.config.messages.base;
			
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
class Nitrado
{
	config = 
	{
		api = 'https://api.nitrado.net',
		services:
		{
			base: '/services'
		},
		notifications:
		{
			base: '/notifications'
		}
	}

	notifications = 
	{
		async get()
		{
			let url = this.config.api + this.config.services.base + '/' + process.env.NITRADO_SERVER_ID + this.config.notifications.base;

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

exports.handler = async (event) => {

	let response = {
		statusCode: 200,
		body: JSON.stringify('Error #01. Internal error.'),
	};

	const nitrado = new Nitrado();
	
	let notifications = nitrado.notifications.get();

	if ( notifications.status == 'success' )
	{
		let submit;

		if ( notifications.data && notifications.data.notifications && notifications.data.notifications.length > 0 )
		{
			submit = await discord.messages.send( 'Verificar status na Nitrado' );
		}
		else
		{
			submit = await discord.messages.send( 'Sem notificações na nitrado' );
		}

		if ( submit.status == 'success' )
		{
			let response = {
				statusCode: 200,
				body: JSON.stringify('Success #01. Internal success.'),
			};
		}
		else
		{
			let response = {
				statusCode: 200,
				body: JSON.stringify('Error #03. Internal error.'),
			};
		}

	}
	else
	{
		let response = {
			statusCode: 200,
			body: JSON.stringify('Error #02. Internal error.'),
		};
	}
	
	return response;
};