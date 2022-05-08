import OS from "os";
import Process from "process";
import Utility from "util";

import { Provider, Credentials } from "@aws-sdk/types";

import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { CredentialProvider } from "@aws-sdk/types";

import { Types } from "./types.js";

/***
 * Client Credentials
 * ---
 *
 * Creates a credential provider function that reads from a shared credentials file at ~/.aws/credentials and a shared
 * configuration file at ~/.aws/config.
 *
 * Both files are expected to be INI formatted with section names corresponding to
 * profiles.
 *
 * Sections in the credentials file are treated as profile names, whereas profile sections in the config file
 * must have the format of[profile profile-name], except for the default profile.
 *
 * @example
 * import { Credentials } from "credentials";
 * const credentials = await Credentials.initialize();
 * console.log(credentials);
 *
 */

class Credential {
    id?: string | null = Process.env["AWS_ACCESS_KEY_ID"];
    key?: string | null = Process.env["AWS_SECRET_ACCESS_TOKEN"];
    region?: string | null = Process.env["AWS_DEFAULT_REGION"];

    public service?: Service;

    readonly profile: string;

    /***
     * Returns information about the currently effective user. On POSIX platforms, this is typically a subset of the
     * password file. The returned object includes the username, uid, gid, shell, and homedir. On Windows, the uid
     * and gid fields are -1, and shell is null. The value of homedir returned by os.userInfo() is provided by the
     * operating system. This differs from the result of os.homedir(), which queries environment variables for the home
     * directory before falling back to the operating system response.
     *
     * Throws a SystemError if a user has no username or homedir.
     *
     */

    readonly user = OS.userInfo();

    readonly settings: CredentialProvider;

    /// Debugging, Potential Usage via Container or EC2 Runtime(s)
    private environment = {
        "AWS_SHARED_CREDENTIALS_FILE": [ Process.env["AWS_SHARED_CREDENTIALS_FILE"], Boolean( Process.env["AWS_SHARED_CREDENTIALS_FILE"] ) ],
        "AWS_CONFIG_FILE": [ Process.env["AWS_CONFIG_FILE"], Boolean( Process.env["AWS_CONFIG_FILE"] ) ],
        "AWS_DEFAULT_REGION": [ Process.env["AWS_DEFAULT_REGION"], Boolean( Process.env["AWS_DEFAULT_REGION"] ) ],
        "AWS_ACCESS_KEY_ID": [ Process.env["AWS_ACCESS_KEY_ID"], Boolean( Process.env["AWS_ACCESS_KEY_ID"] ) ],
        "AWS_SECRET_ACCESS_TOKEN": [ Process.env["AWS_SECRET_ACCESS_TOKEN"], Boolean( Process.env["AWS_SECRET_ACCESS_TOKEN"] ) ]
    };

    protected constructor( profile: string ) {
        this.profile = profile;
        this.settings = defaultProvider( {
            profile: this.profile
        } );
    }

    public static async initialize( profile: string = "default", debug: boolean = false ) {
        const instance = new Credential( profile );

        await instance.hydrate();

        ( debug ) && console.debug( "[Debug] Credential Instance" + ":", Utility.inspect( this, { showHidden: true, depth: Infinity } ) );

        return instance;
    }

    /***
     * Initialize Client via Environment or Profile Credentials
     *
     * @returns {Promise<void>}
     */

    protected async hydrate( debug: boolean = false ) {
        await this.settings;

        ( debug ) && console.debug( "[Debug] Credential Instance" + ":", Utility.inspect( this, { showHidden: true, depth: Infinity } ) );
    }
}

type Service = Types["Client"] | null;
type Configuration = Provider<Credentials>;

export { Credential };

export default Credential;

export type { Configuration };
