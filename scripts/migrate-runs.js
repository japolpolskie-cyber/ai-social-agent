const db = require('../db');

const columns = [
  "ALTER TABLE runs ADD COLUMN provider TEXT",
  "ALTER TABLE runs ADD COLUMN prompt TEXT",
  "ALTER TABLE runs ADD COLUMN response TEXT",
  "ALTER TABLE runs ADD COLUMN model TEXT",
  "ALTER TABLE runs ADD COLUMN executionTime INTEGER"
];

for (const sql of columns) {
  try {
    db.exec(sql);
    console.log('Applied:', sql);
  } catch (error) {
    if (error.message.includes('duplicate column name')) {
      console.log('Skipped:', sql);
    } else {
      throw error;
    }
  }
}

console.log('Migration complete.');