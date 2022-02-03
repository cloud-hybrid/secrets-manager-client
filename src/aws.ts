import * as SDK from "@aws-sdk/client-secrets-manager";

import type { Shape, Output, Resource } from "./types.js"

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

/*** Extended, Modified Secret Type */
class Construct implements Resource {
    id?;
    name?;
    description?;
    tags?;
    version;
    access?;
    creation?;
    modification?;
    deletion?;

    constructor(input: Resource) {
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

class Secret implements Shape {
    id?: string | undefined;
    creation?: Date | undefined;
    name?: string | undefined;
    binary?: any | undefined;
    secret?: string | undefined;
    version?: string | undefined;
    stages?: string[] | undefined;

    constructor (response?: Output["Get"]) {
        this.id = response?.ARN;
        this.creation = response?.CreatedDate;
        this.name = response?.Name;
        this.binary = response?.SecretBinary;
        this.secret = response?.SecretString;
        this.version = response?.VersionId;
        this.stages = response?.VersionStages;
    }

    /*** Serialize Secret.secret into JSON */
    public serialize () {
        if (this.secret) {
            try {
                return JSON.parse(this.secret);
            } catch (e) {
                return this.secret;
            }
        } else {
            return null;
        }
    }
}

class Secrets extends Array {
    protected total?: number;
    public token?: string | null;

    constructor(response?: Output["List"]) {
        super();

        (response) && response?.SecretList?.forEach( ($) => {
            const secret = new Construct( {
                id: $.ARN ?? "N/A",
                name: $.Name,
                creation: $.CreatedDate,
                version: $.SecretVersionsToStages ?? {},
                deletion: $.DeletedDate,
                description: $.Description,
                access: $.LastAccessedDate,
                modification: $.LastChangedDate,
                tags: $.Tags
            } );

            this.push( secret );
        } );

        this.token = response?.NextToken ?? null;
        this.total = this.length ?? null;
    }
}

export { AWS, Secret, Secrets };

export default AWS;