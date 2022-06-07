async function do_post( url, content )
{
	const https = require( 'https' );

	const options =
	{
		method: 	'POST',
		headers:
		{
			'Content-Type': 	'application/json',
			'Content-Length':	Buffer.byteLength( content )
		}
	};

	return new Promise((resolve, reject) => {
		const req = https.request
		(	
			url,
			options,
			(res) =>
			{
				res.setEncoding( 'utf8' );

				let response2 = '';

				res.on
				(
					'data',
					( chunk ) =>
					{
						response2 += chunk;
					}
				);
				res.on
				(
					'end',
					() =>
					{
						resolve( response2 );
					}
				);

			}
		).on
		(
			'error',
			(error) =>
			{
				console.error( error );
			}
		);

		req.write( content );
		req.end();
	});
};

async function do_get( url, options )
{
	const https = require( 'https' );

	options = options ? options : {};

	/*const options =
	{
		hostname:	'www.domain.com.br',
		port:		443,
		path:		'/',
		method: 	'GET',
		headers:
		{
			'Content-Type': 	'application/json'
		}
	};*/

	return new Promise((resolve, reject) => {
	
		const req = https.request
		(	
			url,
			options,
			(res) =>
			{
				res.setEncoding( 'utf8' );

				let response2 = '';

				res.on
				(
					'data',
					( chunk ) =>
					{
						response2 += chunk;
					}
				);
				res.on
				(
					'end',
					() =>
					{
						resolve( response2 );
					}
				);

			}
		).on
		(
			'error',
			(error) =>
			{
				console.error( error );
			}
		);

		req.end();
	});
};

async function do_download( url )
{
	const https = require( 'https' );

	/*const options =
	{
		hostname:	'www.domain.com.br',
		port:		443,
		path:		'/',
		method: 	'GET',
		headers:
		{
			'Content-Type': 	'application/json'
		}
	};*/

	return new Promise((resolve, reject) => {
		const req = https.request
		(	
			url,
			(res) =>
			{
				res.setEncoding( 'utf8' );

				let response2 = '';

				res.on
				(
					'data',
					( chunk ) =>
					{
						response2 += chunk;
					}
				);
				res.on
				(
					'end',
					() =>
					{
						resolve( response2 );
					}
				);

			}
		).on
		(
			'error',
			(error) =>
			{
				console.error( error );
			}
		);

		req.end();
	});
};

class discord
{
	get_players_list( content )
	{
		let lines = content.split( '\n' ).reverse();
		let found = false;
		
		let players_list = '**Player List**\n';
	
		for ( let index in lines )
		{
			let line = lines[ index ];
			
			if ( line.indexOf( 'PlayerList' ) > -1 && found )
			{
				//found = false;
				break;
			}

			if ( line.indexOf( '#####' ) > -1 )
			{
				found = true;
				continue;
			}
			
			if ( found )
			{
				players_list += this.get_player( line ) + '\n';
			}
		}
		
		return players_list;
	}
	
	get_player( line )
	{
		let player_name = this.get_player_name( line );
		let player_position = this.get_player_position( line );
		
		return player_name + ' ' + player_position;
	}

	get_player_name( line )
	{
		let start = 19; // line.indexOf( '"' );
		let end = line.indexOf( '"', start );
		
		return line.slice( start, end );
	}

	get_player_position( line )
	{
		let start = line.indexOf( 'pos=' ) + 5;
		
		return 'https://www.izurvive.com/#location=' + line.slice( start, -2 ).replace( /,/g, ';' ).replace( / /g, '' );
	}
};

exports.handler = async (event) => {

	let response = {
		statusCode: 200,
		body: JSON.stringify('Error #01. Internal error.'),
	};

	const server_api = 'https://api.nitrado.net';
	const server_id = process.env.NITRADO_SERVER_ID;
	const account_id = process.env.NITRADO_ACCOUNT_ID;

	let url = server_api + '/services/' + server_id + '/gameservers/file_server/download?file=/games/' + account_id + '/noftp/dayzxb/config/DayZServer_X1_x64.ADM';
	let options = {
		headers:
		{
			Authorization: process.env.NITRADO_ACCOUNT_TOKEN
		}
	};
	
	// BUSCA O LINK DO ARQUIVO
	let request = await do_get( url, options );
		request = JSON.parse( request );

	if ( request && request.status == 'success' )
	{
		if ( request.data && request.data.token && request.data.token.url )
		{
			let download = await do_download( request.data.token.url );
			let discord2 = new discord;
			
			let players_list = discord2.get_players_list( download );
				players_list = players_list.replace( /"/g, '\'' ).replace( /\n/g, '\\n' );
				players_list = players_list.slice(-2000);
				
				//download = download.replace( /"/g, '\'' ).replace( /\n/g, '\\n' );
				//download = download.slice(-2000);

			let url = process.env.DISCORD_WEBHOOK_SERVER_LOG;

			let content = '{"username":"MrBot","avatar_url":"https://www.pngall.com/wp-content/uploads/2016/03/Minecraft-Zombie-PNG.png","content":"' + players_list + '"}';
			console.log(content);
			
			let submit = await do_post( url, content );
			console.log(submit);
	
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
