import * as SDK from "@aws-sdk/client-secrets-manager";
import type { Shape, Output } from "./types.js";
declare const AWS: {
    Client: typeof SDK.SecretsManagerClient;
    create: typeof SDK.CreateSecretCommand;
    list: typeof SDK.ListSecretsCommand;
    get: typeof SDK.GetSecretValueCommand;
    rotate: typeof SDK.RotateSecretCommand;
    cancel: typeof SDK.CancelRotateSecretCommand;
    delete: typeof SDK.DeleteSecretCommand;
    describe: typeof SDK.DescribeSecretCommand;
    tag: typeof SDK.TagResourceCommand;
    random: typeof SDK.GetRandomPasswordCommand;
    update: typeof SDK.UpdateSecretCommand;
    untag: typeof SDK.UntagResourceCommand;
};
declare class Secret implements Shape {
    id?: string | undefined;
    creation?: Date | undefined;
    name?: string | undefined;
    binary?: any | undefined;
    secret?: string | undefined;
    version?: string | undefined;
    stages?: string[] | undefined;
    constructor(response?: Output["Get"]);
    /*** Serialize Secret.secret into JSON */
    serialize(): any;
}
declare class Secrets extends Array {
    protected total?: number;
    token?: string | null;
    constructor(response?: Output["List"]);
}
export { AWS, Secret, Secrets };
export default AWS;
