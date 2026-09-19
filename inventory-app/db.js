const state = {
  categories: [
    {
      id: 1,
      name: 'Electronics',
      description: 'Devices and gadgets for home and office.',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Office Supplies',
      description: 'Daily essentials for business operations.',
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Furniture',
      description: 'Functional furniture and storage.',
      created_at: new Date().toISOString(),
    },
  ],
  items: [
    {
      id: 1,
      name: 'Laptop Pro 14',
      sku: 'LAP-001',
      description: 'Ultra-light business laptop',
      price: '1299.99',
      quantity: 12,
      category_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'USB-C Hub',
      sku: 'USB-204',
      description: '7-port connectivity hub',
      price: '49.99',
      quantity: 34,
      category_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Ergonomic Office Chair',
      sku: 'CHA-781',
      description: 'High-back chair with lumbar support',
      price: '219.50',
      quantity: 8,
      category_id: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: 4,
      name: 'Notebook Pack',
      sku: 'OFF-310',
      description: 'A4 ruled bullet notebooks',
      price: '18.75',
      quantity: 80,
      category_id: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      name: 'Standing Desk',
      sku: 'FUR-112',
      description: 'Electric adjustable desk',
      price: '499.00',
      quantity: 5,
      category_id: 3,
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      name: 'Wireless Mouse',
      sku: 'MOU-333',
      description: 'Low-latency ergonomic mouse',
      price: '29.95',
      quantity: 42,
      category_id: 1,
      created_at: new Date().toISOString(),
    },
  ],
  nextCategoryId: 4,
  nextItemId: 7,
};

function getCategorySummary() {
  return state.categories.map((category) => {
    const itemCount = state.items.filter((item) => item.category_id === category.id).length;
    return {
      ...category,
      item_count: itemCount,
    };
  });
}

async function query(text, params = []) {
  const sql = String(text).replace(/\s+/g, ' ').trim();
  const upper = sql.toUpperCase();

  if (upper.startsWith('SELECT C.*, COUNT(I.ID) AS ITEM_COUNT')) {
    return { rows: getCategorySummary().sort((a, b) => a.name.localeCompare(b.name)) };
  }

  if (upper.startsWith('SELECT * FROM CATEGORIES WHERE ID =')) {
    const [id] = params;
    return { rows: state.categories.filter((category) => category.id === Number(id)) };
  }

  if (upper.startsWith('SELECT * FROM ITEMS WHERE CATEGORY_ID =')) {
    const [categoryId] = params;
    return {
      rows: state.items
        .filter((item) => item.category_id === Number(categoryId))
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  }

  if (upper.startsWith('INSERT INTO CATEGORIES')) {
    const [name, description] = params;
    const category = {
      id: state.nextCategoryId,
      name: String(name),
      description: description === null || description === undefined ? null : String(description),
      created_at: new Date().toISOString(),
    };
    state.categories.push(category);
    state.nextCategoryId += 1;
    return { rows: [{ id: category.id }] };
  }

  if (upper.startsWith('UPDATE CATEGORIES SET NAME =')) {
    const [name, description, id] = params;
    const category = state.categories.find((entry) => entry.id === Number(id));
    if (category) {
      category.name = String(name);
      category.description = description === null || description === undefined ? null : String(description);
    }
    return { rows: [] };
  }

  if (upper.startsWith('SELECT ID FROM ITEMS WHERE CATEGORY_ID =')) {
    const [categoryId] = params;
    const item = state.items.find((entry) => entry.category_id === Number(categoryId));
    return { rows: item ? [{ id: item.id }] : [] };
  }

  if (upper.startsWith('DELETE FROM CATEGORIES WHERE ID =')) {
    const [id] = params;
    state.categories = state.categories.filter((category) => category.id !== Number(id));
    return { rows: [] };
  }

  if (upper.startsWith('SELECT I.*, C.NAME AS CATEGORY_NAME FROM ITEMS I JOIN CATEGORIES C ON C.ID = I.CATEGORY_ID ORDER BY I.NAME ASC')) {
    return {
      rows: state.items
        .map((item) => ({
          ...item,
          category_name: state.categories.find((category) => category.id === item.category_id)?.name || null,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  }

  if (upper.startsWith('SELECT I.*, C.NAME AS CATEGORY_NAME FROM ITEMS I JOIN CATEGORIES C ON C.ID = I.CATEGORY_ID WHERE I.ID =')) {
    const [id] = params;
    const item = state.items.find((entry) => entry.id === Number(id));
    if (!item) return { rows: [] };
    return {
      rows: [{
        ...item,
        category_name: state.categories.find((category) => category.id === item.category_id)?.name || null,
      }],
    };
  }

  if (upper.startsWith('SELECT * FROM CATEGORIES ORDER BY NAME ASC')) {
    return { rows: [...state.categories].sort((a, b) => a.name.localeCompare(b.name)) };
  }

  if (upper.startsWith('INSERT INTO ITEMS')) {
    const [name, sku, description, price, quantity, category_id] = params;
    const item = {
      id: state.nextItemId,
      name: String(name),
      sku: String(sku),
      description: description === null || description === undefined ? null : String(description),
      price: String(price),
      quantity: Number(quantity),
      category_id: Number(category_id),
      created_at: new Date().toISOString(),
    };
    state.items.push(item);
    state.nextItemId += 1;
    return { rows: [{ id: item.id }] };
  }

  if (upper.startsWith('SELECT * FROM ITEMS WHERE ID =')) {
    const [id] = params;
    return { rows: state.items.filter((item) => item.id === Number(id)) };
  }

  if (upper.startsWith('UPDATE ITEMS SET NAME =')) {
    const [name, sku, description, price, quantity, category_id, id] = params;
    const item = state.items.find((entry) => entry.id === Number(id));
    if (item) {
      item.name = String(name);
      item.sku = String(sku);
      item.description = description === null || description === undefined ? null : String(description);
      item.price = String(price);
      item.quantity = Number(quantity);
      item.category_id = Number(category_id);
    }
    return { rows: [] };
  }

  if (upper.startsWith('DELETE FROM ITEMS WHERE ID =')) {
    const [id] = params;
    state.items = state.items.filter((item) => item.id !== Number(id));
    return { rows: [] };
  }

  if (upper.startsWith('TRUNCATE TABLE ITEMS')) {
    state.items = [];
    state.nextItemId = 1;
    return { rows: [] };
  }

  if (upper.startsWith('TRUNCATE TABLE CATEGORIES')) {
    state.categories = [];
    state.nextCategoryId = 1;
    return { rows: [] };
  }

  throw new Error(`Unsupported in-memory query: ${sql}`);
}

const client = {
  async query(text, params) {
    return query(text, params || []);
  },
  release() {},
  end() {},
};

const pool = {
  async connect() {
    return client;
  },
  async end() {},
};

module.exports = { query, pool, state };
