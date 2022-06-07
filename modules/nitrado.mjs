'use strict';

import Request from './request.mjs';
import iZurvive from './izurvive.mjs';

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

	players = 
	{
		async online()
		{
			let url = Nitrado.config.api + Nitrado.config.services.base + '/' + process.env.NITRADO_SERVER_ID + '/gameservers';

			let options = {
				headers:
				{
					Authorization: process.env.NITRADO_ACCOUNT_TOKEN
				}
			};
			
			let response = await Request.get( url, options );
				response = JSON.parse( response );

			if ( response?.status == 'success' && response?.data?.gameserver?.query?.player_current && response?.data?.gameserver?.query?.player_max )
			{
				// response.data.gameserver.status: != started
				// response.data.gameserver.query.player_current
				// response.data.gameserver.query.player_max
				// response.data.gameserver.query.version

				return 'ONLINE ' + response.data.gameserver.query.player_current + '/' + response.data.gameserver.query.player_max;
			}
			else
			{
				return 'ONLINE ??/32';
			}
		},

		async list()
		{
			let nitrado = new Nitrado();
			
			let content = await nitrado.files.server_logs();

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
					players_list += this.get_name( line ) + ' ' + this.get_position( line ) + '\n';
				}
			}

			players_list = players_list.replace( /"/g, '\'' ).replace( /\n/g, '\\n' );
			//players_list = players_list.slice(-2000);

			return players_list;
		},

		get_name( line )
		{
			let start = 19; // line.indexOf( '"' );
			let end = line.indexOf( '"', start );
			
			return line.slice( start, end );
		},
	
		get_position( line )
		{
			let start = line.indexOf( 'pos=' ) + 5;
			
			return iZurvive.config.api + iZurvive.config.location.base + line.slice( start, -2 ).replace( /,/g, ';' ).replace( / /g, '' );
		}
	}

	files =
	{
		async server_logs()
		{
			let url = Nitrado.config.api + Nitrado.config.services.base + '/' + process.env.NITRADO_SERVER_ID + '/gameservers/file_server/download?file=/games/' + process.env.NITRADO_ACCOUNT_ID + '/noftp/dayzxb/config/DayZServer_X1_x64.ADM';

			let options = {
				headers:
				{
					Authorization: process.env.NITRADO_ACCOUNT_TOKEN
				}
			};
			
			// BUSCA O LINK DO ARQUIVO
			let response = await Request.get( url, options );
				response = JSON.parse( response );

			if ( response?.status == 'success' && response?.data && response?.data?.token && response?.data?.token?.url )
			{
				return await Request.download( response.data.token.url );
			}
		}
	}
}