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

	server = 
	{
		async details()
		{
			let url = Nitrado.config.api + Nitrado.config.services.base + '/' + process.env.NITRADO_SERVER_ID + '/gameservers';

			let options = {
				headers:
				{
					Authorization: process.env.NITRADO_ACCOUNT_TOKEN
				}
			};
			
			let response = await Request.get( url, options );
			return response = JSON.parse( response );
		},

		async status()
		{
			let nitrado = new Nitrado();

			let response = await nitrado.server.details();

			if ( response?.status == 'success' )
			{
				let status = [ 'started', 'restarting', 'stopping' ]; // stopped

				if ( status.indexOf( response?.data?.gameserver?.status ) == -1 )
				{
					return await this.restart();
				}
				else
				{
					return response.data.gameserver.status;
				}
			}
			else
			{
				/*
				needs a throw
				*/
				return 'The application cannot perform a restart server';
			}
		},

		async restart()
		{
			let url = Nitrado.config.api + Nitrado.config.services.base + '/' + process.env.NITRADO_SERVER_ID + '/gameservers/restart';

			let options = {
				headers:
				{
					Authorization: process.env.NITRADO_ACCOUNT_TOKEN
				}
			};
			
			let response = await Request.post( url, options );
				response = JSON.parse( response );

			if ( response?.status == 'success' )
			{
				return response.message;
			}
			else
			{
				/*
				needs a throw
				*/
				return 'The application cannot perform a restart server';
			}
		},
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
		async online() // INT
		{
			let nitrado = new Nitrado();

			let response = await nitrado.server.details();

			if ( response?.status == 'success' && response?.data?.gameserver?.query?.player_current )
			{
				return response.data.gameserver.query.player_current;
			}
			else
			{
				return 0;
			}
		},

		async max() // INT
		{
			let nitrado = new Nitrado();

			let response = await nitrado.server.details();

			if ( response?.status == 'success' && response?.data?.gameserver?.query?.player_max )
			{
				return response.data.gameserver.query.player_max;
			}
			else
			{
				return 0;
			}
		},

		async list()
		{
			let nitrado = new Nitrado();
			
			let content = await nitrado.files.server_logs();
			console.log(content);

			// TODO tratar caso não retorne o arquivo
			let lines = content.split( '\n' ).reverse();
			let found = false;
			let players = [];
		
			for ( let index in lines )
			{
				let line = lines[ index ];
				
				if ( line.indexOf( 'PlayerList' ) > -1 && found )
				{
					break;
				}
	
				if ( line.indexOf( '#####' ) > -1 )
				{
					found = true;
					continue;
				}
				
				if ( found )
				{
					players.push( { 'gamertag': this.get_name( line ), 'position': this.get_position( line ) } );
				}
			}

			return players;
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

			return line.slice( start, -2 ).replace( /,/g, ';' ).replace( / /g, '' );
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