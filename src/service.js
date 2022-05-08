"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
const client_js_1 = require("./client.js");
const aws_js_1 = require("./aws.js");
const parameter_1 = require("@cloud-technology/parameter");
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
class Service extends client_js_1.Client {
    constructor(profile = "default") { super(profile); }
    /***
     * List all AWS Account Secret(s)
     *
     * @returns {Promise<Secrets>}
     *
     */
    async list() {
        await this.initialize();
        const secrets = [];
        const input = {
            MaxResults: Infinity
        };
        const command = new this.commands.list(input);
        const response = await this.service?.send(command);
        let page = new aws_js_1.Secrets(response);
        secrets.push(...page);
        while (page.token) {
            const input = {
                MaxResults: Infinity,
                NextToken: page.token
            };
            const command = new this.commands.list(input);
            const response = await this.service?.send(command);
            page = new aws_js_1.Secrets(response);
            secrets.push(...page);
            if (!page.token)
                break;
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
    async search(filter, value) {
        await this.initialize();
        const secrets = [];
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
        const command = new this.commands.list(input);
        const response = await this.service?.send(command);
        let page = new aws_js_1.Secrets(response);
        secrets.push(...page);
        while (page.token) {
            const input = (value) ? {
                MaxResults: Infinity,
                Filters: [
                    {
                        Key: filter, Values: (typeof value === "object") ? value : [value]
                    }
                ], NextToken: page.token
            } : {
                MaxResults: Infinity, NextToken: page.token
            };
            const command = new this.commands.list(input);
            const response = await this.service?.send(command);
            page = new aws_js_1.Secrets(response);
            secrets.push(...page);
            if (!page.token)
                break;
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
    async get(parameter) {
        await this.initialize();
        const input = (parameter instanceof parameter_1.Parameter) ? { SecretId: parameter.string() } : { SecretId: parameter };
        const command = new this.commands.get(input);
        const response = await this.service?.send(command).catch((error) => {
            if (error.$metadata.httpStatusCode === 400) {
                const error = new Error("Secret Not Found");
                error.name = "Secret-Not-Found-Exception";
                error.stack = util_1.default.inspect(error, { colors: true });
                throw error;
            }
            else {
                throw error;
            }
        });
        const secret = new aws_js_1.Secret(response);
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
    async create(parameter, description, secret, overwrite = false) {
        await this.initialize();
        const $ = (parameter instanceof parameter_1.Parameter) ? parameter : parameter_1.Parameter.initialize(parameter);
        const organization = $.organization;
        const environment = $.environment;
        const application = $.application;
        const service = $.service;
        const identifier = $.identifier;
        const input = {
            Name: $.string("Directory"),
            Description: description,
            ForceOverwriteReplicaSecret: overwrite,
            SecretString: secret,
            Tags: (application) ? [
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
                    Value: identifier
                }
            ] : [
                {
                    Key: "Organization",
                    Value: organization
                },
                {
                    Key: "Environment",
                    Value: environment
                },
                {
                    Key: "Service",
                    Value: service
                },
                {
                    Key: "Identifier",
                    Value: identifier
                }
            ]
        };
        const command = new this.commands.create(input);
        const response = await this.service?.send(command).catch((error) => {
            throw error;
        });
        return new aws_js_1.Secret(response);
    }
    static recovery(days = 7) {
        if (days < 7 || days > 30) {
            const error = new Error("Invalid Recovery Input");
            error.name = "Recovery-Out-of-Range-Exception";
            error.stack = util_1.default.inspect(error, { colors: true });
            throw error;
        }
        else {
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
    async delete(parameter, recovery = 7) {
        await this.initialize();
        if (parameter instanceof parameter_1.Parameter) {
            const input = {
                SecretId: parameter.string(),
                RecoveryWindowInDays: Service.recovery(recovery),
                ForceDeleteWithoutRecovery: false
            };
            const command = new this.commands.delete({ ...input });
            const response = await this.service?.send(command).catch((error) => {
                throw error;
            });
            console.log(util_1.default.inspect(response, { colors: true, showHidden: true, showProxy: true }));
            return true;
        }
        else {
            const input = {
                SecretId: parameter,
                RecoveryWindowInDays: Service.recovery(recovery),
                ForceDeleteWithoutRecovery: false
            };
            const command = new this.commands.delete({ ...input });
            const response = await this.service?.send(command).catch((error) => {
                throw error;
            });
            console.log(util_1.default.inspect(response, { colors: true, showHidden: true, showProxy: true }));
            return true;
        }
    }
}
exports.Service = Service;
exports.default = Service;
