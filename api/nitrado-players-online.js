'use strict';

import Nitrado from '../modules/nitrado.mjs';
import Discord from '../modules/discord.mjs';

export const handler = async (event) => {

	let response = {
		statusCode: 200,
		body: JSON.stringify('Error #01. Internal error.'),
	};

	let nitrado = new Nitrado();
	let nitrado_players_online = await nitrado.players.online();
	let nitrado_players_max = await nitrado.players.max();

	let discord = new Discord();
	let discord_channel_name = 'PLAYERS ' + nitrado_players_online + '/' + nitrado_players_max;
	
	if ( await discord.channels.players_online( discord_channel_name ) )
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

	return response;
};