import { Client } from "./client.js";
import { Secret, Secrets } from "./aws.js";
import { Filters } from "./types.js";
import { Parameter } from "@cloud-technology/parameter";
/***
 * AWS Secrets Manager Service Interface
 * ---
 *
 * While the `Client` defines and wraps the profile + credentials,
 * and initializes the `*.commands` attribute(s), `Service` extends
 * usage to AWS' Secrets-Manager API.
 *
 * @see {@link Client}
 *
 * @example
 * /// Get Secret-String Example
 * import { Service } from "@cloud-technology/secrets-manager-client";
 *
 * const $ = new Service();
 *
 * const secret = await service.get("Organization/Environment/Application/Resource/Identifier");
 *
 * @example
 * /// List AWS Account Secrets Example
 * import { Service } from "@cloud-technology/secrets-manager-client";
 *
 * const $ = new Service();
 *
 * const list = await service.list();
 *
 * @example
 * /// List Secret(s) via Search, "Name" Query
 * import { Service } from "@cloud-technology/secrets-manager-client";
 *
 * const $ = new Service();
 *
 * const search = await service.search("name", "Organization");
 */
declare class Service extends Client {
    constructor(profile?: string);
    /***
     * List all AWS Account Secret(s)
     *
     * @returns {Promise<Secrets>}
     *
     */
    list(): Promise<Secrets>;
    /***
     * Query AWS Account Secret(s) According to Filter
     *
     * @param {Filters} filter - Filter via Query-Type
     * @param {string | string[]} value - Value to Query Against
     *
     * @returns {Promise<Secrets>}
     *
     */
    search(filter: Filters, value?: string | string[]): Promise<Secrets>;
    /***
     * Retrieve Secrets-Manager Serialized Value(s)
     *
     * @param {string} parameter
     *
     * @returns {Promise<JSON | String | null>}
     *
     */
    get(parameter: Parameter | string): Promise<JSON | String | null>;
    /***
     * Create a new Secret
     *
     * @param {Parameter | string} parameter
     * @param {string} description
     * @param {string} secret
     * @param {boolean} overwrite
     *
     * @returns {Promise<Secret>}
     *
     */
    create(parameter: Parameter | string, description: string, secret: string, overwrite?: boolean): Promise<Secret>;
    private static recovery;
    /***
     * Delete Secret, with Default Recovery Options
     *
     * @param {Parameter | string} parameter - Parameter, or the ARN or
     * name of the secret to delete
     * @param {number} recovery - The number of days from 7 to 30
     * that Secrets Manager waits before permanently deleting the
     * secret
     *
     * param {boolean} force - Use this parameter with caution.
     * This parameter causes the operation to skip the normal recovery
     * window before the permanent deletion that Secrets Manager would
     * normally impose with the `recovery` parameter
     *
     * @returns {Promise<Secret>}
     *
     */
    delete(parameter: Parameter | string, recovery?: number): Promise<boolean>;
}
export { Service };
export default Service;
