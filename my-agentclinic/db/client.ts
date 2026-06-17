import Database from 'better-sqlite3'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = dirname(fileURLToPath(import.meta.url))
const dbPath = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : join(dir, '..', 'agentclinic.db')

export const db = new Database(dbPath)

db.exec(readFileSync(join(dir, 'migrations', '001_create_agents.sql'), 'utf-8'))
