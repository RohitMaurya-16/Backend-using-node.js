const db = require('../db');

exports.listItems = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT i.*, c.name AS category_name
       FROM items i
       JOIN categories c ON c.id = i.category_id
       ORDER BY i.name ASC`
    );

    res.render('items/list', {
      title: 'Items',
      items: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Server error', message: 'Unable to load items.' });
  }
};

exports.itemDetail = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const result = await db.query(
      `SELECT i.*, c.name AS category_name
       FROM items i
       JOIN categories c ON c.id = i.category_id
       WHERE i.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).render('notFound', { title: 'Item not found' });
    }

    res.render('items/detail', {
      title: result.rows[0].name,
      item: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Server error', message: 'Unable to load item details.' });
  }
};

exports.createItemGet = async (req, res) => {
  try {
    const categories = await db.query('SELECT * FROM categories ORDER BY name ASC');

    res.render('items/form', {
      title: 'Create item',
      item: null,
      categories: categories.rows,
      action: '/items/create',
      errors: [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Server error', message: 'Unable to load form.' });
  }
};

exports.createItemPost = async (req, res) => {
  const { name, sku, description, price, quantity, category_id } = req.body;

  try {
    await db.query(
      `INSERT INTO items (name, sku, description, price, quantity, category_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name.trim(), sku.trim(), description ? description.trim() : null, Number(price), Number(quantity), Number(category_id)]
    );

    res.redirect('/items');
  } catch (error) {
    console.error(error);
    const categories = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.status(400).render('items/form', {
      title: 'Create item',
      item: { name, sku, description, price, quantity, category_id },
      categories: categories.rows,
      action: '/items/create',
      errors: [{ msg: 'Unable to create item. Check required fields and unique SKU.' }],
    });
  }
};

exports.updateItemGet = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const itemResult = await db.query('SELECT * FROM items WHERE id = $1', [id]);
    const categories = await db.query('SELECT * FROM categories ORDER BY name ASC');

    if (itemResult.rows.length === 0) {
      return res.status(404).render('notFound', { title: 'Item not found' });
    }

    res.render('items/form', {
      title: 'Update item',
      item: itemResult.rows[0],
      categories: categories.rows,
      action: `/items/${id}/update`,
      errors: [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Server error', message: 'Unable to load item.' });
  }
};

exports.updateItemPost = async (req, res) => {
  const id = Number(req.params.id);
  const { name, sku, description, price, quantity, category_id, adminPassword } = req.body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    const categories = await db.query('SELECT * FROM categories ORDER BY name ASC');
    const current = await db.query('SELECT * FROM items WHERE id = $1', [id]);
    return res.status(403).render('items/form', {
      title: 'Update item',
      item: current.rows[0],
      categories: categories.rows,
      action: `/items/${id}/update`,
      errors: [{ msg: 'Invalid admin password. Update denied.' }],
    });
  }

  try {
    await db.query(
      `UPDATE items
       SET name = $1, sku = $2, description = $3, price = $4, quantity = $5, category_id = $6
       WHERE id = $7`,
      [name.trim(), sku.trim(), description ? description.trim() : null, Number(price), Number(quantity), Number(category_id), id]
    );

    res.redirect(`/items/${id}`);
  } catch (error) {
    console.error(error);
    const categories = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.status(400).render('items/form', {
      title: 'Update item',
      item: { id, name, sku, description, price, quantity, category_id },
      categories: categories.rows,
      action: `/items/${id}/update`,
      errors: [{ msg: 'Unable to update item. Check your values and unique SKU.' }],
    });
  }
};

exports.deleteItem = async (req, res) => {
  const id = Number(req.params.id);
  const { adminPassword } = req.body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(403).render('error', {
      title: 'Forbidden',
      message: 'Invalid admin password. Deletion denied.',
    });
  }

  try {
    await db.query('DELETE FROM items WHERE id = $1', [id]);
    res.redirect('/items');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Server error',
      message: 'Unable to delete item.',
    });
  }
};
