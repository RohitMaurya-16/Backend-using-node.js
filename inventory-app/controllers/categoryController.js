const db = require('../db');

exports.listCategories = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, COUNT(i.id) AS item_count
       FROM categories c
       LEFT JOIN items i ON i.category_id = c.id
       GROUP BY c.id
       ORDER BY c.name ASC`
    );

    res.render('categories/list', {
      title: 'Categories',
      categories: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Server error', message: 'Unable to load categories.' });
  }
};

exports.categoryDetail = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const categoryResult = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    const itemsResult = await db.query(
      `SELECT * FROM items WHERE category_id = $1 ORDER BY name ASC`,
      [id]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(404).render('notFound', { title: 'Category not found' });
    }

    res.render('categories/detail', {
      title: categoryResult.rows[0].name,
      category: categoryResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Server error', message: 'Unable to load category details.' });
  }
};

exports.createCategoryGet = (req, res) => {
  res.render('categories/form', {
    title: 'Create category',
    category: null,
    action: '/categories/create',
    errors: [],
  });
};

exports.createCategoryPost = async (req, res) => {
  const { name, description } = req.body;

  try {
    await db.query(
      'INSERT INTO categories (name, description) VALUES ($1, $2)',
      [name.trim(), description ? description.trim() : null]
    );

    res.redirect('/categories');
  } catch (error) {
    console.error(error);
    res.status(400).render('categories/form', {
      title: 'Create category',
      category: { name, description },
      action: '/categories/create',
      errors: [{ msg: 'Unable to create category. Name may already exist.' }],
    });
  }
};

exports.updateCategoryGet = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).render('notFound', { title: 'Category not found' });
    }

    res.render('categories/form', {
      title: 'Update category',
      category: result.rows[0],
      action: `/categories/${id}/update`,
      errors: [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Server error', message: 'Unable to load category.' });
  }
};

exports.updateCategoryPost = async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, adminPassword } = req.body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    return res.status(403).render('categories/form', {
      title: 'Update category',
      category: result.rows[0],
      action: `/categories/${id}/update`,
      errors: [{ msg: 'Invalid admin password. Update denied.' }],
    });
  }

  try {
    await db.query(
      'UPDATE categories SET name = $1, description = $2 WHERE id = $3',
      [name.trim(), description ? description.trim() : null, id]
    );

    res.redirect(`/categories/${id}`);
  } catch (error) {
    console.error(error);
    res.status(400).render('categories/form', {
      title: 'Update category',
      category: { id, name, description },
      action: `/categories/${id}/update`,
      errors: [{ msg: 'Unable to update category. Name may already exist.' }],
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const id = Number(req.params.id);
  const { adminPassword } = req.body;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(403).render('error', {
      title: 'Forbidden',
      message: 'Invalid admin password. Deletion denied.',
    });
  }

  try {
    const itemCheck = await db.query('SELECT id FROM items WHERE category_id = $1 LIMIT 1', [id]);

    if (itemCheck.rows.length > 0) {
      return res.status(400).render('error', {
        title: 'Category still in use',
        message: 'This category still contains items. Remove or reassign items before deleting the category.',
      });
    }

    await db.query('DELETE FROM categories WHERE id = $1', [id]);
    res.redirect('/categories');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Server error',
      message: 'Unable to delete category.',
    });
  }
};
