"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Credential = void 0;
const tslib_1 = require("tslib");
const os_1 = tslib_1.__importDefault(require("os"));
const process_1 = tslib_1.__importDefault(require("process"));
const util_1 = tslib_1.__importDefault(require("util"));
const credential_provider_node_1 = require("@aws-sdk/credential-provider-node");
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
    id = process_1.default.env["AWS_ACCESS_KEY_ID"];
    key = process_1.default.env["AWS_SECRET_ACCESS_TOKEN"];
    region = process_1.default.env["AWS_DEFAULT_REGION"];
    service;
    profile;
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
    user = os_1.default.userInfo();
    settings;
    /// Debugging, Potential Usage via Container or EC2 Runtime(s)
    environment = {
        "AWS_SHARED_CREDENTIALS_FILE": [process_1.default.env["AWS_SHARED_CREDENTIALS_FILE"], Boolean(process_1.default.env["AWS_SHARED_CREDENTIALS_FILE"])],
        "AWS_CONFIG_FILE": [process_1.default.env["AWS_CONFIG_FILE"], Boolean(process_1.default.env["AWS_CONFIG_FILE"])],
        "AWS_DEFAULT_REGION": [process_1.default.env["AWS_DEFAULT_REGION"], Boolean(process_1.default.env["AWS_DEFAULT_REGION"])],
        "AWS_ACCESS_KEY_ID": [process_1.default.env["AWS_ACCESS_KEY_ID"], Boolean(process_1.default.env["AWS_ACCESS_KEY_ID"])],
        "AWS_SECRET_ACCESS_TOKEN": [process_1.default.env["AWS_SECRET_ACCESS_TOKEN"], Boolean(process_1.default.env["AWS_SECRET_ACCESS_TOKEN"])]
    };
    constructor(profile) {
        this.profile = profile;
        this.settings = (0, credential_provider_node_1.defaultProvider)({
            profile: this.profile
        });
    }
    static async initialize(profile = "default", debug = false) {
        const instance = new Credential(profile);
        await instance.hydrate();
        (debug) && console.debug("[Debug] Credential Instance" + ":", util_1.default.inspect(this, { showHidden: true, depth: Infinity }));
        return instance;
    }
    /***
     * Initialize Client via Environment or Profile Credentials
     *
     * @returns {Promise<void>}
     */
    async hydrate(debug = false) {
        await this.settings;
        (debug) && console.debug("[Debug] Credential Instance" + ":", util_1.default.inspect(this, { showHidden: true, depth: Infinity }));
    }
}
exports.Credential = Credential;
exports.default = Credential;
