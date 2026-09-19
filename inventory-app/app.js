const express = require('express');
const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const itemRoutes = require('./routes/items');
const categoryRoutes = require('./routes/categories');
const dashboardRoutes = require('./routes/dashboard');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', dashboardRoutes);
app.use('/categories', categoryRoutes);
app.use('/items', itemRoutes);

app.use((req, res) => {
  res.status(404).render('notFound', { title: 'Page not found' });
});

app.listen(PORT, () => {
  console.log(`Inventory app listening on port ${PORT}`);
});
