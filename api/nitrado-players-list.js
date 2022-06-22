'use strict';

import Nitrado from '../modules/nitrado.mjs';
import Discord from '../modules/discord.mjs';
import iZurvive from '../modules/izurvive.mjs';

export const handler = async (event) => {

	let response = {
		statusCode: 200,
		body: JSON.stringify('Error #01. Internal error.'),
	};

	let nitrado = new Nitrado();
	let nitrado_players_list = await nitrado.players.list();

	let message = '**Player List**\\n';

	for ( let player in nitrado_players_list )
	{
		message += player.gamertag + ' ' + iZurvive.config.api + iZurvive.config.location.base + player.position + '\\n';
	}
		//players = players.replace( /"/g, '\'' ).replace( /\n/g, '\\n' );

	let discord = new Discord();
	
	if ( await discord.messages.send_server_players_list( message ) )
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