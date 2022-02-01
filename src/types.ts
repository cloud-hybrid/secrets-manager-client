import { SecretsManagerClient, GetSecretValueCommand, GetSecretValueCommandInput, GetSecretValueResponse } from "@aws-sdk/client-secrets-manager";

const AWS = {
    Client: SecretsManagerClient,
    Get: GetSecretValueCommand
};

type Client = SecretsManagerClient;

interface INI {
    accessKeyId: string;
    secretAccessKey: string;
    profile: string;
}

interface Types {
    Client: Client;
    Get: GetSecretValueCommandInput;
    INI: INI;
}

interface Shape {
    id?: string | undefined;
    creation?: Date | undefined;
    name?: string | undefined;
    binary?: any | undefined;
    secret?: string | undefined;
    version?: string | undefined;
    stages?: string[] | undefined;
}

class Secret implements Shape {
    id;
    creation;
    name;
    binary;
    secret;
    version;
    stages;

    constructor (response?: GetSecretValueResponse) {
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

export { AWS, Secret };

export type { Types};

export default AWS;
