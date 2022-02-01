# `secrets-manager-client` #

AWS Secrets Manager Custom User-Agent + Client

## Usage ##

```node
import { Client } from "@cloud-technology/secrets-manager-client";

const service = await Client.initialize();

const secret = await service.get("Organization/Environment/Application/Resource/Identifier");

console.log(secret);
```
