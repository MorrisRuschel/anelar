'use strict';

import https from 'https';

export default class Request
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
		let content_type = ( content != '' ? { 'Content-Type': 	'application/json'} : {} );

		const options =
		{
			method: 	( headers?.method ? headers?.method : 'POST' ),

			headers:
			{
				'Content-Length':	Buffer.byteLength( content ),
				...content_type,
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