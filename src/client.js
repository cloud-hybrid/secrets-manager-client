"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const tslib_1 = require("tslib");
const process_1 = tslib_1.__importDefault(require("process"));
const credential_js_1 = require("./credential.js");
const sha256_js_1 = require("@aws-crypto/sha256-js");
const aws_js_1 = require("./aws.js");
const util_1 = tslib_1.__importDefault(require("util"));
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
class Client extends credential_js_1.Credential {
    commands = aws_js_1.AWS;
    constructor(profile) {
        super(profile);
    }
    /***
     * AWS Secrets Manager Function(s)
     *
     * @returns {string[]}
     */
    methods() {
        return Object.keys(this.commands);
    }
    async initialize(debug = false) {
        await this.hydrate();
        this.service = new aws_js_1.AWS.Client({
            tls: true,
            sha256: sha256_js_1.Sha256,
            apiVersion: "2017-10-17",
            credentials: this.settings,
            customUserAgent: "Cloud-Technology-API",
            region: process_1.default.env?.["AWS_DEFAULT_REGION"] ?? "us-east-2"
        });
        (debug) && console.debug("[Debug] Client Instance" + ":", util_1.default.inspect(this, { showHidden: true, depth: Infinity }));
        return this;
    }
}
exports.Client = Client;
exports.default = Client;
