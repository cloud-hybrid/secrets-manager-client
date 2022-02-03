import { Credential } from "./credential.js";

import { AWS } from "./aws.js";

/***
 * AWS Secrets Manager Client - Augmented Credential Provider
 * ---
 *
 * Creates a credential provider function that reads from a shared credentials file at ~/.aws/credentials and a shared
 * configuration file at ~/.aws/config.
 *
 * Both files are expected to be INI formatted with section names corresponding to
 * profiles.
 *
 * Sections in the credentials file are treated as profile names, whereas profile sections in the config file
 * must have the format of `[profile profile-name]`, except for the default profile.
 *
 * @example
 * import Utility from "util";
 * import { Secret, Client, Input } from "@cloud-technology/secrets-manager-client";
 *
 * class Service extends Client {
 *     public constructor(profile: string = "default") { super( profile ); }
 *     public async get(name: string): Promise<JSON | String | null> {
 *         await this.initialize();
 *
 *         const input: Input["Get"] = { SecretId: name };
 *
 *         const command = new this.commands.get( input );
 *
 *         const response = await this.service?.send( command ).catch((error) => {
 *             if (error.$metadata.httpStatusCode === 400) {
 *                 const error = new Error("Secret Not Found");
 *                 error.name = "Secret-Not-Found-Exception";
 *                 error.stack = Utility.inspect(error, { colors: true });
 *
 *                 throw error;
 *             } else {
 *                 throw error;
 *             }
 *         })
 *
 *         const secret = new Secret(response);
 *
 *         return secret.serialize();
 *     }
 * }
 *
 * const $ = "Organization/Environment/Application/Resource/Identifier";
 *
 * const instance = new Service("default");
 * const service = await instance.initialize();
 * const secret = await service.get($);
 *
 */

class Client extends Credential {
    commands = AWS;

    public constructor(profile: string) {
        super( profile );
    }

    /***
     * AWS Secrets Manager Function(s)
     *
     * @returns {string[]}
     */
    public methods() {
        return Object.keys( this.commands );
    }

    public async initialize() {
        await this.hydrate();

        this.service = new AWS.Client( {
            tls: true,
            apiVersion: "2017-10-17",
            customUserAgent: "Cloud-Technology-API",
            runtime: "node"
        } );

        return this;
    }
}

export { Client };

export default Client;
