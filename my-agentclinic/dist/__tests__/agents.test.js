"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importStar(require("../app"));
(0, vitest_1.describe)('GET /agents', () => {
    (0, vitest_1.it)('returns 200 with seeded agents in HTML output', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/agents');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.headers['content-type']).toContain('text/html');
        (0, vitest_1.expect)(res.text).toContain('<h2>Agents</h2>');
        (0, vitest_1.expect)(res.text).toContain('Astra');
        (0, vitest_1.expect)(res.text).toContain('Patch');
        (0, vitest_1.expect)(res.text).toContain('Nimbus');
        (0, vitest_1.expect)(res.text).toContain('href="/agents/1"');
        (0, vitest_1.expect)(res.text).toContain('@picocss/pico@2/css/pico.min.css');
    }));
    (0, vitest_1.it)('returns a single agent profile page', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/agents/1');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.headers['content-type']).toContain('text/html');
        (0, vitest_1.expect)(res.text).toContain('<h2>Astra</h2>');
        (0, vitest_1.expect)(res.text).toContain('Linked ailments');
        (0, vitest_1.expect)(res.text).toContain('Context-window claustrophobia');
    }));
    (0, vitest_1.it)('returns 404 when a requested agent id does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/agents/9999');
        (0, vitest_1.expect)(res.status).toBe(404);
        (0, vitest_1.expect)(res.text).toContain('Agent Not Found');
    }));
});
(0, vitest_1.describe)('renderAgentsContent()', () => {
    (0, vitest_1.it)('renders an empty state when no agents are provided', () => {
        const html = (0, app_1.renderAgentsContent)([]);
        (0, vitest_1.expect)(html).toContain('No agents are currently registered.');
    });
});
(0, vitest_1.describe)('renderAgentProfileContent()', () => {
    (0, vitest_1.it)('renders a not-found state when agent is null', () => {
        const html = (0, app_1.renderAgentProfileContent)(null, 77);
        (0, vitest_1.expect)(html).toContain('No agent exists with id 77.');
    });
});
