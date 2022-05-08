"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ = void 0;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const $ = client_secrets_manager_1.SecretsManagerClient;
exports.$ = $;
