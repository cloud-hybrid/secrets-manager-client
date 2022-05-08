import { SecretsManagerClient, CreateSecretCommandInput, ListSecretsCommandInput, GetSecretValueCommandInput, RotateSecretCommandInput, CancelRotateSecretCommandInput, DeleteSecretCommandInput, DescribeSecretCommandInput, TagResourceCommandInput, GetRandomPasswordCommandInput, UntagResourceCommandInput, UpdateSecretCommandInput, GetSecretValueCommandOutput, CreateSecretCommandOutput, ListSecretsCommandOutput, CancelRotateSecretCommandOutput, RotateSecretCommandOutput, DeleteSecretCommandOutput, DescribeSecretCommandOutput, GetRandomPasswordCommandOutput, TagResourceCommandOutput, UpdateSecretCommandOutput, UntagResourceCommandOutput, CancelRotateSecretResponse, CreateSecretResponse, DeleteSecretResponse, DescribeSecretResponse, GetRandomPasswordResponse, GetSecretValueResponse, ListSecretVersionIdsResponse, RotateSecretResponse, UpdateSecretResponse } from "@aws-sdk/client-secrets-manager";
declare const $: typeof SecretsManagerClient;
declare type Client = SecretsManagerClient;
declare type Filters = keyof Query;
interface Query {
    description: string;
    name: string;
    "tag-key": string;
    "tag-value": string;
    "primary-region": string;
    all: any;
}
interface Input {
    Create: CreateSecretCommandInput;
    List: ListSecretsCommandInput;
    Get: GetSecretValueCommandInput;
    Rotate: RotateSecretCommandInput;
    Cancel: CancelRotateSecretCommandInput;
    Delete: DeleteSecretCommandInput;
    Describe: DescribeSecretCommandInput;
    Tag: TagResourceCommandInput;
    Random: GetRandomPasswordCommandInput;
    Update: UpdateSecretCommandInput;
    Untag: UntagResourceCommandInput;
}
interface Output {
    Create: CreateSecretCommandOutput;
    List: ListSecretsCommandOutput;
    Get: GetSecretValueCommandOutput;
    Rotate: RotateSecretCommandOutput;
    Cancel: CancelRotateSecretCommandOutput;
    Delete: DeleteSecretCommandOutput;
    Describe: DescribeSecretCommandOutput;
    Tag: TagResourceCommandOutput;
    Random: GetRandomPasswordCommandOutput;
    Update: UpdateSecretCommandOutput;
    Untag: UntagResourceCommandOutput;
}
interface Response {
    Create: CreateSecretResponse;
    List: ListSecretVersionIdsResponse;
    Get: GetSecretValueResponse;
    Rotate: RotateSecretResponse;
    Cancel: CancelRotateSecretResponse;
    Delete: DeleteSecretResponse;
    Describe: DescribeSecretResponse;
    Random: GetRandomPasswordResponse;
    Update: UpdateSecretResponse;
}
interface INI {
    accessKeyId: string;
    secretAccessKey: string;
    profile: string;
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
interface Types {
    Client: Client;
    INI: INI;
    Input: Input;
    Output: Output;
    Shape: Shape;
}
interface Tag {
    Key?: string;
    Value?: string;
}
/*** The AWS Secret Resource */
interface Resource {
    /*** Secret.ARN */
    id?: string | undefined;
    /*** Secret.CreatedDate */
    creation?: Date | string | undefined;
    /*** Secret.DeletedDate */
    deletion?: Date | string | undefined;
    /*** Secret.Description */
    description?: string | undefined;
    /*** Secret.LastAccessedDate */
    access?: Date | string | undefined;
    /*** Secret.LastChangedDate */
    modification?: Date | string | undefined;
    /*** Secret.Name */
    name?: string | undefined;
    /*** Secret.SecretVersionsToStages */
    version: {
        [key: string]: string[];
    };
    /*** Secret.Tags */
    tags?: Tag[] | undefined;
}
export { $ };
export type { Shape, Input, Output, Types, Tag, Response, Resource, Query, Filters };
export default Client;
