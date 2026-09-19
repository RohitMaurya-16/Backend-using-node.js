const db = require('../db');

async function seedDatabase() {
  try {
    db.state.categories = [];
    db.state.items = [];
    db.state.nextCategoryId = 1;
    db.state.nextItemId = 1;

    const categories = [
      ['Electronics', 'Devices and gadgets for home and office.'],
      ['Office Supplies', 'Daily essentials for business operations.'],
      ['Furniture', 'Functional furniture and storage.'],
    ];

    const categoryInsert = await Promise.all(
      categories.map(([name, description]) =>
        db.query(
          'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id',
          [name, description]
        )
      )
    );

    const categoryIds = categoryInsert.map((result) => result.rows[0].id);

    const items = [
      ['Laptop Pro 14', 'LAP-001', 'Ultra-light business laptop', 1299.99, 12, categoryIds[0]],
      ['USB-C Hub', 'USB-204', '7-port connectivity hub', 49.99, 34, categoryIds[0]],
      ['Ergonomic Office Chair', 'CHA-781', 'High-back chair with lumbar support', 219.5, 8, categoryIds[2]],
      ['Notebook Pack', 'OFF-310', 'A4 ruled bullet notebooks', 18.75, 80, categoryIds[1]],
      ['Standing Desk', 'FUR-112', 'Electric adjustable desk', 499.0, 5, categoryIds[2]],
      ['Wireless Mouse', 'MOU-333', 'Low-latency ergonomic mouse', 29.95, 42, categoryIds[0]],
    ];

    for (const [name, sku, description, price, quantity, categoryId] of items) {
      await db.query(
        `INSERT INTO items (name, sku, description, price, quantity, category_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [name, sku, description, price, quantity, categoryId]
      );
    }

    console.log('Temporary seed data inserted successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  }
}

seedDatabase();
