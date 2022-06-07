'use strict';

import Nitrado from '../modules/nitrado.mjs';
import Discord from '../modules/discord.mjs';

export const handler = async (event) => {

	let response = {
		statusCode: 200,
		body: JSON.stringify('Error #01. Internal error.'),
	};

	let nitrado = new Nitrado();

	if ( await nitrado.notifications.exists() )
	{
		let discord = new Discord();

		if ( await discord.messages.send_server_players( 'Verificar status na Nitrado' ) )
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
				body: JSON.stringify('Error #02. Internal error.'),
			};
		}
	}
	else
	{
		response = {
			statusCode: 200,
			body: JSON.stringify('Success #02. Internal success.'),
		};
	}
	
	return response;
};