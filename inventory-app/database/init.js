const db = require('../db');

async function initDatabase() {
  try {
    db.state.categories = db.state.categories || [];
    db.state.items = db.state.items || [];
    console.log('Temporary in-memory inventory store initialized.');
  } catch (error) {
    console.error('Temporary store initialization failed:', error);
    process.exitCode = 1;
  }
}

initDatabase();
