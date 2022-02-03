# `secrets-manager-client` #

AWS Secrets Manager Custom User-Agent + Client

## Usage ##

```node
import Utility from "util";
import { Secret, Client, Input } from "@cloud-technology/secrets-manager-client";

class Service extends Client {
    public constructor(profile: string = "default") { super(profile); }

    public async get(name: string): Promise<JSON | String | null> {
        await this.initialize();

        const input: Input["Get"] = { SecretId: name };

        const command = new this.commands.get(input);

        const response = await this.service?.send(command).catch((error) => {
            if ( error.$metadata.httpStatusCode === 400 ) {
                const error = new Error("Secret Not Found");
                error.name = "Secret-Not-Found-Exception";
                error.stack = Utility.inspect(error, { colors: true });

                throw error;
            } else {
                throw error;
            }
        })

        const secret = new Secret(response);

        return secret.serialize();
    }
}

const $ = "Organization/Environment/Application/Resource/Identifier";

const instance = new Service("default");
const service = await instance.initialize();
const secret = await service.get($);
```
