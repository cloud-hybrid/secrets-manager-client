"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secret = exports.Client = exports.Service = void 0;
const index_js_1 = require("./src/index.js");
Object.defineProperty(exports, "Service", { enumerable: true, get: function () { return index_js_1.Service; } });
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return index_js_1.Client; } });
Object.defineProperty(exports, "Secret", { enumerable: true, get: function () { return index_js_1.Secret; } });
exports.default = {
    Service: index_js_1.Service,
    Client: index_js_1.Client,
    Secret: index_js_1.Secret
};
