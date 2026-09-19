const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const categoryResult = await db.query(
      `SELECT c.*, COUNT(i.id) AS item_count
       FROM categories c
       LEFT JOIN items i ON i.category_id = c.id
       GROUP BY c.id
       ORDER BY c.name ASC`
    );

    const itemResult = await db.query(
      `SELECT i.*, c.name AS category_name
       FROM items i
       JOIN categories c ON c.id = i.category_id
       ORDER BY i.name ASC
       LIMIT 5`
    );

    res.render('dashboard', {
      title: 'Inventory Dashboard',
      categories: categoryResult.rows,
      items: itemResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Server error',
      message: 'Unable to load dashboard.',
    });
  }
});

module.exports = router;
