"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secrets = exports.Secret = exports.AWS = void 0;
const tslib_1 = require("tslib");
const SDK = tslib_1.__importStar(require("@aws-sdk/client-secrets-manager"));
const AWS = {
    Client: SDK.SecretsManagerClient,
    create: SDK.CreateSecretCommand,
    list: SDK.ListSecretsCommand,
    get: SDK.GetSecretValueCommand,
    rotate: SDK.RotateSecretCommand,
    cancel: SDK.CancelRotateSecretCommand,
    delete: SDK.DeleteSecretCommand,
    describe: SDK.DescribeSecretCommand,
    tag: SDK.TagResourceCommand,
    random: SDK.GetRandomPasswordCommand,
    update: SDK.UpdateSecretCommand,
    untag: SDK.UntagResourceCommand
};
exports.AWS = AWS;
/*** Extended, Modified Secret Type */
class Construct {
    id;
    name;
    description;
    tags;
    version;
    access;
    creation;
    modification;
    deletion;
    constructor(input) {
        this.id = input.id;
        this.name = input.name;
        this.creation = input.creation;
        this.version = input.version;
        this.deletion = input.deletion;
        this.description = input.description;
        this.access = input.access;
        this.modification = input.modification;
        this.tags = input.tags;
    }
}
class Secret {
    id;
    creation;
    name;
    binary;
    secret;
    version;
    stages;
    constructor(response) {
        this.id = response?.ARN;
        this.creation = response?.CreatedDate;
        this.name = response?.Name;
        this.binary = response?.SecretBinary;
        this.secret = response?.SecretString;
        this.version = response?.VersionId;
        this.stages = response?.VersionStages;
    }
    /*** Serialize Secret.secret into JSON */
    serialize() {
        if (this.secret) {
            try {
                return JSON.parse(this.secret);
            }
            catch (e) {
                return this.secret;
            }
        }
        else {
            return null;
        }
    }
}
exports.Secret = Secret;
class Secrets extends Array {
    total;
    token;
    constructor(response) {
        super();
        (response) && response?.SecretList?.forEach(($) => {
            const secret = new Construct({
                id: $.ARN ?? "N/A",
                name: $.Name,
                creation: $.CreatedDate,
                version: $.SecretVersionsToStages ?? {},
                deletion: $.DeletedDate,
                description: $.Description,
                access: $.LastAccessedDate,
                modification: $.LastChangedDate,
                tags: $.Tags
            });
            this.push(secret);
        });
        this.token = response?.NextToken ?? null;
        this.total = this.length ?? null;
    }
}
exports.Secrets = Secrets;
exports.default = AWS;
