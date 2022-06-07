import https from 'https';

export class request
{
	static async get( url, options )
	{
		options = options ? options : {};

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
	}

	static async post( url, content, headers )
	{
		const options =
		{
			method: 	'POST',
			headers:
			{
				'Content-Type': 	'application/json',
				'Content-Length':	Buffer.byteLength( content ),
				...headers
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
	}

	static async download( url )
	{
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
	}
}