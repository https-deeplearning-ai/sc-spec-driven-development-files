"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAilments = listAilments;
const db_1 = __importDefault(require("./db"));
function listAilments() {
    const statement = db_1.default.prepare(`
    SELECT
      al.id,
      al.name,
      al.description,
      COUNT(DISTINCT aa.agent_id) AS agentCount
    FROM ailments al
    LEFT JOIN agent_ailments aa ON aa.ailment_id = al.id
    GROUP BY al.id, al.name, al.description
    ORDER BY al.id ASC
  `);
    return statement.all();
}
