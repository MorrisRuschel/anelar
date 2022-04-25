exports.handler = async (event) => {

    let response = {
        statusCode: 200,
        body: JSON.stringify('Error #01. Internal error.'),
    };
	
	const https = require('https');

	const server_api = 'https://api.nitrado.net';
	const server_id = process.env.SERVER_ID;
	const account_id = process.env.ACCOUNT_ID;

	let options = {
		headers:
		{
			Authorization: process.env.ACCOUNT_TOKEN
		}
	};
	
	const request = https.get
	(
		server_api + '/services/' + server_id + '/gameservers/file_server/list?dir=/games/' + account_id + '/noftp/dayzxb/',
		options,
		(res) =>
		{
			console.log( res );

			res.on
			(
				'data',
				(d) =>
				{
					process.stdout.write(d);
				}
			);
		}
	).on( 'error', (error) => {
		console.log( error );

		response = {
			statusCode: 200,
			body: JSON.stringify('Error #02. Internal error.'),
		};
	});

    response = {
        statusCode: 200,
        body: JSON.stringify('Success #01. Internal success.'),
    };
    return response;
};
