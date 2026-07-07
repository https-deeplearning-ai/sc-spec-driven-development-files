"use strict";
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
const app_1 = __importDefault(require("../app"));
(0, vitest_1.describe)('GET /', () => {
    (0, vitest_1.it)('returns 200 with the welcome message inside the layout', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.text).toContain('AgentClinic is open for business');
        (0, vitest_1.expect)(res.text).toContain('<header class="container">');
        (0, vitest_1.expect)(res.text).toContain('<main class="container">');
        (0, vitest_1.expect)(res.text).toContain('<footer class="container">');
        (0, vitest_1.expect)(res.text).toContain('href="/styles.css"');
        (0, vitest_1.expect)(res.text).toContain('@picocss/pico@2/css/pico.min.css');
    }));
});
