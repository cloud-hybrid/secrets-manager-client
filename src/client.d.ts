import { Credential } from "./credential.js";
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
 *
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
declare class Client extends Credential {
    commands: {
        Client: typeof import("@aws-sdk/client-secrets-manager").SecretsManagerClient;
        create: typeof import("@aws-sdk/client-secrets-manager").CreateSecretCommand;
        list: typeof import("@aws-sdk/client-secrets-manager").ListSecretsCommand;
        get: typeof import("@aws-sdk/client-secrets-manager").GetSecretValueCommand;
        rotate: typeof import("@aws-sdk/client-secrets-manager").RotateSecretCommand;
        cancel: typeof import("@aws-sdk/client-secrets-manager").CancelRotateSecretCommand;
        delete: typeof import("@aws-sdk/client-secrets-manager").DeleteSecretCommand;
        describe: typeof import("@aws-sdk/client-secrets-manager").DescribeSecretCommand;
        tag: typeof import("@aws-sdk/client-secrets-manager").TagResourceCommand;
        random: typeof import("@aws-sdk/client-secrets-manager").GetRandomPasswordCommand;
        update: typeof import("@aws-sdk/client-secrets-manager").UpdateSecretCommand;
        untag: typeof import("@aws-sdk/client-secrets-manager").UntagResourceCommand;
    };
    constructor(profile: string);
    /***
     * AWS Secrets Manager Function(s)
     *
     * @returns {string[]}
     */
    methods(): string[];
    initialize(debug?: boolean): Promise<this>;
}
export { Client };
export default Client;
