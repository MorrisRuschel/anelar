'use strict';

import Request from './request.mjs';

export default class Nitrado
{
	static config = 
	{
		api: 'https://api.nitrado.net',
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
		async exists()
		{
			let url = Nitrado.config.api + Nitrado.config.services.base + '/' + process.env.NITRADO_SERVER_ID + Nitrado.config.notifications.base;

			let options = {
				headers:
				{
					Authorization: process.env.NITRADO_ACCOUNT_TOKEN
				}
			};
			
			let response = await Request.get( url, options );
				response = JSON.parse( response );

			return ( response?.status == 'success' && response?.data?.notifications?.length > 0 );
		}
	} 
}