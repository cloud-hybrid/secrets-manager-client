/// <reference types="node" />
import OS from "os";
import { Provider, Credentials } from "@aws-sdk/types";
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
declare class Credential {
    id?: string | null;
    key?: string | null;
    region?: string | null;
    service?: Service;
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
    readonly user: OS.UserInfo<string>;
    readonly settings: CredentialProvider;
    private environment;
    protected constructor(profile: string);
    static initialize(profile?: string, debug?: boolean): Promise<Credential>;
    /***
     * Initialize Client via Environment or Profile Credentials
     *
     * @returns {Promise<void>}
     */
    protected hydrate(debug?: boolean): Promise<void>;
}
declare type Service = Types["Client"] | null;
declare type Configuration = Provider<Credentials>;
export { Credential };
export default Credential;
export type { Configuration };
