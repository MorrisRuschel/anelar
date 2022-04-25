async function do_request( url, options )
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

	let url = server_api + '/services/' + server_id + '/gameservers/file_server/list?dir=/games/' + account_id + '/noftp/dayzxb/';
	let options = {
		headers:
		{
			Authorization: process.env.ACCOUNT_TOKEN
		}
	};
	
	let request = await do_request( url, options );

	console.log(request);
	
	return response;
};
