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
	console.log('t1');
		const req = https.request
		(	
			url,
			options,
			(res) =>
			{
				res.setEncoding( 'utf8' );
					console.log('t2');

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
	console.log('t1');
		const req = https.request
		(	
			url,
			options,
			(res) =>
			{
				res.setEncoding( 'utf8' );
					console.log('t2');

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

exports.handler = async (event) => {

	let response = {
		statusCode: 200,
		body: JSON.stringify('Error #01. Internal error.'),
	};

	const server_api = 'https://api.nitrado.net';
	const server_id = process.env.SERVER_ID;
	const account_id = process.env.ACCOUNT_ID;

	let url = server_api + '/services/' + server_id + '/notifications';
	let options = {
		headers:
		{
			Authorization: process.env.ACCOUNT_TOKEN
		}
	};
	
	let request = await do_get( url, options );
		request = JSON.parse( request );

	console.log(request);

	if ( request.status == 'success' && request.data && request.data.notifications && request.data.notifications.length > 0 )
	{
		const discord_webhook_server_status = process.env.DISCORD_WEBHOOK_SERVER_STATUS;

		let url = discord_webhook_server_status;
		//' + request.data.notifications[ 0 ].message + '
		let content = '{"username":"Nitrado Notifications","avatar_url":"https://play-lh.googleusercontent.com/IA3SyOgZX3aHo0jYUH9NlByJbkeDJuDEMsPVBoD3Ol3jLEpcK4yjwqa6UoHCFhEBMMM=s360-rw","content":"teste de mensagem 02"}';

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
	else
	{
		let response = {
			statusCode: 200,
			body: JSON.stringify('Error #02. Internal error.'),
		};
	}
	
	return response;
};
