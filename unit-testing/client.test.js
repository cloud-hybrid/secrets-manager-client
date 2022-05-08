"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const util_1 = tslib_1.__importDefault(require("util"));
const parameter_1 = require("@cloud-technology/parameter");
const uuid_1 = require("uuid");
const index_js_1 = require("./../index.js");
const $ = new index_js_1.Service();
describe("Client Usage", () => {
    const Identifier = (0, uuid_1.v4)();
    const secret = JSON.stringify({
        Key: "Example-Key",
        Value: "Example-Value"
    });
    it("Provisioning", async () => {
        const name = ["Organization/Environment/Application/Unit-Test", Identifier].join("/");
        const overwrite = false;
        const description = "Secret Parameter Unit Test";
        const creation = await $.create(parameter_1.Parameter.initialize(name), description, secret, overwrite);
        console.log(util_1.default.inspect(creation, { colors: true, showProxy: true, showHidden: true }));
        expect(creation).toBeTruthy();
    });
    it("Retrieval", async () => {
        const name = ["Organization/Environment/Application/Unit-Test", Identifier].join("/");
        const value = await $.get(parameter_1.Parameter.initialize(name));
        console.log(util_1.default.inspect(value, { colors: true, showProxy: true, showHidden: true }));
        expect(value).toBeTruthy();
    });
    it("Assignment", async () => {
        const name = ["Organization/Environment/Application/Unit-Test", Identifier].join("/");
        const value = await $.get(parameter_1.Parameter.initialize(name));
        console.log(util_1.default.inspect(value, { colors: true, showProxy: true, showHidden: true }));
        expect(value).toStrictEqual({ Key: "Example-Key", Value: "Example-Value" });
        expect(value).toBeTruthy();
    });
    it("List", async () => {
        const list = await $.list();
        console.log(util_1.default.inspect(list, { colors: true, showProxy: true, showHidden: true }));
        expect(list).toBeTruthy();
    });
    it("Search", async () => {
        const name = ["Organization/Environment/Application/Unit-Test", Identifier].join("/");
        const search = await $.search("name", name);
        console.log(util_1.default.inspect(search, { colors: true, showProxy: true, showHidden: true }));
        expect(typeof search).toBe("object");
        expect(search).toBeTruthy();
    });
    it("Decommissioning", async () => {
        const name = ["Organization/Environment/Application/Unit-Test", Identifier].join("/");
        const days = 7;
        const force = false;
        const deletion = await $.delete(parameter_1.Parameter.initialize(name), days);
        console.log(util_1.default.inspect(deletion, { colors: true, showProxy: true, showHidden: true }));
        expect(deletion).toBeTruthy();
    });
});
