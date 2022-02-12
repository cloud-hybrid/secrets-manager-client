import Utility from "util";

import { Client } from "./client.js";
import { Secret, Secrets } from "./aws.js";
import { Filters, Input } from "./types.js";

import { Parameter } from "@cloud-technology/parameter";

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
 *
 * const secret = await service.get("Organization/Environment/Application/Resource/Identifier");
 *
 * @example
 * /// List AWS Account Secrets Example
 * import { Service } from "@cloud-technology/secrets-manager-client";
 *
 * const $ = new Service();
 *
 * const list = await service.list();
 *
 * @example
 * /// List Secret(s) via Search, "Name" Query
 * import { Service } from "@cloud-technology/secrets-manager-client";
 *
 * const $ = new Service();
 *
 * const search = await service.search("name", "Organization");
 */

class Service extends Client {
    public constructor(profile: string = "default") { super( profile ); }

    /***
     * List all AWS Account Secret(s)
     *
     * @returns {Promise<Secrets>}
     *
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
     *
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
     * @param {string} parameter
     *
     * @returns {Promise<JSON | String | null>}
     *
     */

    public async get(parameter: Parameter | string): Promise<JSON | String | null> {
        await this.initialize();

        const input: Input["Get"] = ( parameter instanceof Parameter ) ? { SecretId: parameter.string() } : { SecretId: parameter };

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

    /***
     * Create a new Secret
     *
     * @param {Parameter | string} parameter
     * @param {string} description
     * @param {string} secret
     * @param {boolean} overwrite
     *
     * @returns {Promise<Secret>}
     *
     */

    async create(parameter: Parameter | string, description: string, secret: string, overwrite: boolean = false): Promise<Secret> {
        await this.initialize();

        const $ = ( parameter instanceof Parameter) ? parameter : Parameter.create(parameter);

        const organization = $.organization;
        const environment = $.environment;
        const application = $.application;
        const service = $.service;

        const identifier = $.identifier;

        const input: Input["Create"] = {
            Name: $.string("Directory"),
            Description: description,
            ForceOverwriteReplicaSecret: overwrite,
            SecretString: secret,
            Tags: [
                {
                    Key: "Organization",
                    Value: organization
                },
                {
                    Key: "Environment",
                    Value: environment
                },
                {
                    Key: "Application",
                    Value: application
                },
                {
                    Key: "Service",
                    Value: service
                },
                {
                    Key: "Identifier",
                    Value: String(identifier ?? "N/A")
                }
            ]
        };

        const command = new this.commands.create( input );

        const response = await this.service?.send( command ).catch( (error) => {
            throw error;
        } );

        return new Secret(response);
    }

    private static recovery(days: number = 7) {
        if (days < 7 || days > 30) {
            const error = new Error( "Invalid Recovery Input" );
            error.name = "Recovery-Out-of-Range-Exception";
            error.stack = Utility.inspect( error, { colors: true } );

            throw error;
        } else {
            return days;
        }
    }

    /***
     * Delete Secret, with Default Recovery Options
     *
     * @param {Parameter | string} parameter - Parameter, or the ARN or
     * name of the secret to delete
     * @param {number} recovery - The number of days from 7 to 30
     * that Secrets Manager waits before permanently deleting the
     * secret
     *
     * param {boolean} force - Use this parameter with caution.
     * This parameter causes the operation to skip the normal recovery
     * window before the permanent deletion that Secrets Manager would
     * normally impose with the `recovery` parameter
     *
     * @returns {Promise<Secret>}
     *
     */

    async delete(parameter: Parameter | string, recovery: number = 7): Promise<boolean> {
        await this.initialize();

        if ( parameter instanceof Parameter ) {
            const input: Input["Delete"] = {
                SecretId: parameter.string(),
                RecoveryWindowInDays: Service.recovery(recovery),
                ForceDeleteWithoutRecovery: false
            };

            const command = new this.commands.delete( { ... input } );

            const response = await this.service?.send( command ).catch( (error) => {
                throw error;
            } );

            console.log(Utility.inspect(response, { colors: true, showHidden: true, showProxy: true }));

            return true;
        } else {
            const input: Input["Delete"] = {
                SecretId: parameter,
                RecoveryWindowInDays: Service.recovery(recovery),
                ForceDeleteWithoutRecovery: false
            };

            const command = new this.commands.delete( { ... input } );

            const response = await this.service?.send( command ).catch( (error) => {
                throw error;
            } );

            console.log(Utility.inspect(response, { colors: true, showHidden: true, showProxy: true }));

            return true;
        }
    }
}

export { Service };

export default Service;

