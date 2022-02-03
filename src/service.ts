import Utility from "util";

import { Client } from "./client.js";
import { Secret, Secrets } from "./aws.js";
import { Filters, Input } from "./types.js";

/***
 * AWS Secrets Manager Service Interface
 * ---
 *
 * While the `Client` defines and wraps the profile + credentials,
 * and initializes the `*.commands` attribute(s), `Service` extends
 * usage to AWS' Secrets-Manager API.
 *
 * @see {@link Client}
 *
 * @example
 * /// Get Secret-String Example
 * import { Service } from "@cloud-technology/secrets-manager-client";
 *
 * const $ = new Service();
 * const service = await $.initialize();
 * const secret = await service.get("Organization/Environment/Application/Resource/Identifier");
 *
 * @example
 * /// List AWS Account Secrets Example
 * import { Service } from "@cloud-technology/secrets-manager-client";
 *
 * const $ = new Service();
 * const service = await $.initialize();
 * const list = await service.list();
 *
 * @example
 * /// List Secret(s) via Search, "Name" Query
 * import { Service } from "@cloud-technology/secrets-manager-client";
 *
 * const $ = new Service();
 * const service = await $.initialize();
 * const search = await service.search("name", "Organization");
 */

class Service extends Client {
    public constructor(profile: string = "default") { super( profile ); }

    /***
     * List all AWS Account Secret(s)
     *
     * @returns {Promise<Secrets>}
     */

    public async list(): Promise<Secrets> {
        await this.initialize();

        const secrets: Secrets = [];
        const input: Input["List"] = {
            MaxResults: Infinity
        };

        const command = new this.commands.list( input );
        const response = await this.service?.send( command );

        let page = new Secrets(response);

        secrets.push(... page);

        while (page.token) {
            const input: Input["List"] = {
                MaxResults: Infinity,
                NextToken: page.token
            };

            const command = new this.commands.list( input );
            const response = await this.service?.send( command );

            page = new Secrets(response);

            secrets.push(... page);

            if (!page.token) break;
        }

        return secrets;
    }

    /***
     * Query AWS Account Secret(s) According to Filter
     *
     * @param {Filters} filter - Filter via Query-Type
     * @param {string | string[]} value - Value to Query Against
     *
     * @returns {Promise<Secrets>}
     */
    async search(filter: Filters, value?: string | string[]): Promise<Secrets> {
        await this.initialize();

        const secrets: Secrets = [];
        const input = (value) ? {
            MaxResults: Infinity,
            Filters: [
                {
                    Key: filter, Values: (typeof value === "object") ? value : [value]
                }
            ]
        } : {
            MaxResults: Infinity
        };

        const command = new this.commands.list( input );
        const response = await this.service?.send( command );

        let page = new Secrets(response);

        secrets.push(... page);

        while (page.token) {
            const input: Input["List"] = (value) ? {
                MaxResults: Infinity,
                Filters: [
                    {
                        Key: filter, Values: (typeof value === "object") ? value : [value]
                    }
                ], NextToken: page.token
            } : {
                MaxResults: Infinity, NextToken: page.token
            };

            const command = new this.commands.list( input );
            const response = await this.service?.send( command );

            page = new Secrets(response);
            secrets.push(... page);

            if (!page.token) break;
        }

        return secrets;
    }

    /***
     * Retrieve Secrets-Manager Serialized Value(s)
     *
     * @param {string} name
     *
     * @returns {Promise<JSON | String | null>}
     *
     */
    public async get(name: string): Promise<JSON | String | null> {
        await this.initialize();

        const input: Input["Get"] = { SecretId: name };

        const command = new this.commands.get( input );

        const response = await this.service?.send( command ).catch( (error) => {
            if ( error.$metadata.httpStatusCode === 400 ) {
                const error = new Error( "Secret Not Found" );
                error.name = "Secret-Not-Found-Exception";
                error.stack = Utility.inspect( error, { colors: true } );

                throw error;
            } else {
                throw error;
            }
        } );

        const secret = new Secret( response );

        return secret.serialize();
    }
}

export { Service };

export default Service;

