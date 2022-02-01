import FS from "fs";
import OS from "os";
import Path from "path";
import Process from "process";

import { Provider, Credentials } from "@aws-sdk/types";

import { Types } from "./types.js";

import { fromIni, fromEnv } from "@aws-sdk/credential-providers";

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
    public service?: Service;

    public readonly profile: string;

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

    private readonly user = OS.userInfo();
    private readonly credentials: string;
    private readonly configuration: string;
    private readonly valid: boolean;

    /// Debugging, Potential Usage via Container or EC2 Runtime(s)
    /// private environment = {
    ///     "AWS_SHARED_CREDENTIALS_FILE": [Process.env["AWS_SHARED_CREDENTIALS_FILE"], Boolean(Process.env["AWS_SHARED_CREDENTIALS_FILE"])],
    ///     "AWS_CONFIG_FILE": [Process.env["AWS_CONFIG_FILE"], Boolean(Process.env["AWS_CONFIG_FILE"])],
    ///     "AWS_DEFAULT_REGION": [Process.env["AWS_DEFAULT_REGION"], Boolean(Process.env["AWS_DEFAULT_REGION"])],
    ///     "AWS_ACCESS_KEY_ID": [Process.env["AWS_ACCESS_KEY_ID"], Boolean(Process.env["AWS_ACCESS_KEY_ID"])],
    ///     "AWS_SECRET_ACCESS_TOKEN": [Process.env["AWS_SECRET_ACCESS_TOKEN"], Boolean(Process.env["AWS_SECRET_ACCESS_TOKEN"])]
    /// }

    private readonly ini: Configuration;

    /*** Escape Hatch */
    private readonly env: Configuration;

    private id?: string = Process.env["AWS_ACCESS_KEY_ID"];
    private key?: string = Process.env["AWS_SECRET_ACCESS_TOKEN"];

    public constructor(profile: string) {
        this.user = OS.userInfo({ encoding: "utf-8" });
        this.credentials = Process.env["AWS_SHARED_CREDENTIALS_FILE"] || Path.join(this.user.homedir, ".aws", "credentials");
        this.configuration = Process.env["AWS_CONFIG_FILE"] || Path.join(this.user.homedir, ".aws", "config");

        this.profile = profile;

        const configuration = {
            profile: this.profile,
            filepath: this.credentials,
            configFilepath: this.configuration
        };

        this.valid = FS.existsSync(this.configuration);

        this.env = fromEnv();

        this.ini =  fromIni( { ... configuration});
    }

    protected async hydrate (environment?: boolean) {
        (environment) && await this.env();
        await this.ini().then(($) => {
            this.id = $.accessKeyId;
            this.key = $.secretAccessKey;
        });
    }

    public static async initialize (profile: string = "default") {
        const instance = new Credential(profile);

        await instance.hydrate();

        return instance;
    }
}

type Service = Types["Client"] | null;
type Configuration = Provider<Credentials>;

export { Credential };
export type { Configuration };
export default Credential;
