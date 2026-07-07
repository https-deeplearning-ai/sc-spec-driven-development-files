"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAgents = listAgents;
exports.getAgentById = getAgentById;
const db_1 = __importDefault(require("./db"));
function listAgents() {
    const statement = db_1.default.prepare(`
    SELECT
      id,
      name,
      model_type AS modelType,
      current_status AS currentStatus,
      presenting_complaints AS presentingComplaints
    FROM agents
    ORDER BY id ASC
  `);
    return statement.all();
}
function getAgentById(id) {
    const statement = db_1.default.prepare(`
    SELECT
      a.id,
      a.name,
      a.model_type AS modelType,
      a.current_status AS currentStatus,
      a.presenting_complaints AS presentingComplaints,
      GROUP_CONCAT(al.name, '|') AS ailmentsCsv
    FROM agents a
    LEFT JOIN agent_ailments aa ON aa.agent_id = a.id
    LEFT JOIN ailments al ON al.id = aa.ailment_id
    WHERE a.id = ?
    GROUP BY a.id, a.name, a.model_type, a.current_status, a.presenting_complaints
  `);
    const row = statement.get(id);
    if (!row) {
        return null;
    }
    return {
        id: row.id,
        name: row.name,
        modelType: row.modelType,
        currentStatus: row.currentStatus,
        presentingComplaints: row.presentingComplaints,
        ailments: row.ailmentsCsv
            ? row.ailmentsCsv.split('|').filter((item) => item.length > 0)
            : [],
    };
}
