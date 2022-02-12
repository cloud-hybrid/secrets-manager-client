# `secrets-manager-client` #

AWS Secrets Manager Custom User-Agent + Client

## Usage ##

```node
import { Service } from "@cloud-technology/secrets-manager-client";

const client = new Service();

const secret = await client.get( "Organization/Environment/Application/Service/Example" );
```

### Custom Profile Example ###

```node
import { Service } from "@cloud-technology/secrets-manager-client";

const client = new Service("Production");

const secret = await client.get( "Organization/Environment/Application/Service/Example" );
```

### Extended Example(s) ###

```node
import { Parameter } from "@cloud-technology/parameter";
import { Service } from "@cloud-technology/secrets-manager-client";

const $ = new Service();

const name = "Organization/Environment/Application/Service/Example";

const days = 7;
const overwrite = false;
const description = "Secret Parameter Unit Test";

// Note - Values should never be stored, written, or created in code
// Please read-in from a file in production when creating secrets
const secret = JSON.stringify( {
    Key: "Example-Key",
    Value: "Example-Value"
} );

const creation = await $.create( Parameter.create( name ), description, secret, overwrite );

const list = await $.list();
const search = await $.search( "name", name );
const resource = await $.get( Parameter.create( name ) );
const deletion = await $.delete( Parameter.create( name ), days );
```
