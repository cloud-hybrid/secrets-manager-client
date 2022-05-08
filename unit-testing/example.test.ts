import URI from "url";

import HTTPs from "https";

/*** Example Backend Module */

/***
 *
 * @param {string} uri
 * @param {{}} headers
 * @param {Function} resolve
 * @param {Function} reject
 *
 * @constructor
 *
 */

const GET = ( uri: string, headers = {}, resolve: Function, reject: Function ) => {
    const $: { body: Buffer | string | null, data: string } = { body: "", data: "" };

    const options = URI.urlToHttpOptions( new URI.URL( uri ) );

    options.headers = { ... options.headers, ... headers };

    HTTPs.get( options, ( response ) => {
        /// HTTP Redirect(s)
        if ( response.statusCode === 301 || response.statusCode === 302 ) {
            return GET( response.headers.location as string, headers, resolve, reject );
        }

        response.on( "error", ( error ) => {
            reject( error );
        } );

        response.on( "data", ( chunk ) => {
            $.body += Buffer.from( chunk ).toString( "utf-8" );
        } );

        response.on( "end", () => {
            resolve( JSON.parse( String( $.body ) ) );
        } );
    } );
};

const POST = ( uri: string, data: string, headers = {}, resolve: Function, reject: Function ) => {
    const $: { body: string[], data: string } = { body: [], data: "" };

    const options = {
        ... {
            protocol: "https" + ":",
            port: 443,
            rejectUnauthorized: false,
            requestCert: true,
            followAllRedirects: true,
            encoding: "utf-8",
            agent: false,
            method: "POST",
            headers: {
                ... {
                    "Content-Type": "application/json", "Content-Length": Buffer.byteLength( data )
                }, ... headers
            }
        }, ... URI.urlToHttpOptions( new URI.URL( uri ) )
    };

    const request = HTTPs.request( options, ( response ) => {
        if ( response.statusCode === 301 || response.statusCode === 302 ) {
            return POST( response.headers.location as string, data, headers, resolve, reject );
        }

        response.on( "data", ( chunk ) => {
            $.body?.push( Buffer.from( chunk ).toString( "utf-8" ) );
        } );

        response.on( "end", () => {
            try {
                $.data = JSON.parse( $.body.join() );
            } catch ( e ) {
                console.warn( "[Warning] Unable to Parse Body" );
            }
        } );
    } );

    request.on( "error", ( error ) => {
        reject( error );
    } );

    request.on( "close", () => {
        resolve( $ );
    } );

    request.write( data );

    request.end();
};

type Headers = { [$: string]: string };

/***
 *
 * @param {string} url
 * @param {Headers} headers
 *
 * @returns {Promise<{body: string[], data: string}>}
 */

const get = ( url: string, headers: Headers ): Promise<{ body: string[], data: string }> => {
    return new Promise( ( resolve, reject ) => {
        GET( url, headers, resolve, reject );
    } );
};

/***
 *
 * @param {string} url
 * @param {string} data
 * @param {Headers} headers
 *
 * @returns {Promise<{body: string[], data: string}>}
 */

const post = ( url: string, data: string, headers: Headers ): Promise<{ body: string[], data: string }> => {
    return new Promise( ( resolve, reject ) => {
        POST( url, data, headers, resolve, reject );
    } );
};

/*** Unit Testing Starting Point */
for ( let i = 0; i < 25; i++ ) {
    /// 100 iterations are run due to previous issues associated with generating a raw, JSON serializable
    /// string from HTTP response chunks, which should come in as a Base64-encoded Buffer.
    /// Overall, the test(s) should take ~ 20 seconds if =~= 100

    describe( [ "HTTP GET Unit Test", "", [ "(", i, ")" ].join( "" ) ].join( " " ), () => {
        it( [ "Asynchronous Invocation", [ "(", i, ")" ].join( "" ) ].join( " " ), async () => {
            const gettable = await get( [ "https://jsonplaceholder.typicode.com/posts/", i ].join( "" ), {} );

            console.log( "[Log] GET Request", gettable );

            expect( gettable ).toBeTruthy();
        } );
    } );

    describe( [ "HTTP POST Unit Test", "", [ "(", i, ")" ].join( "" ) ].join( " " ), () => {
        it( [ "Asynchronous Invocation", [ "(", i, ")" ].join( "" ) ].join( " " ), async () => {
            const postable = await post( "https://jsonplaceholder.typicode.com/posts", JSON.stringify( {
                title: "title",
                "body": "body",
                userId: i
            } ), {} );

            console.log( "[Log] POST Request", postable );

            expect( postable ).toBeTruthy();
        } );
    } );
}
