import { createDb } from "./index";
import { migrate } from "./migrate";
import { seed } from "./seed";
const db = createDb();
migrate(db);
seed(db);
console.log("Database seeded.");
