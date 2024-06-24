const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user (Admin only)
app.post('/register', (req, res) => {
  const { name, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO users (name, password) VALUES (?, ?)';
  db.query(sql, [name, hashedPassword], (err, result) => {
    if (err) throw err;
    res.send({ message: 'User registered successfully' });
  });
});

// Login
app.post('/login', (req, res) => {
  const { name, password } = req.body;
  const sql = 'SELECT * FROM users WHERE name = ?';
  db.query(sql, [name], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }
    const user = result[0];
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  });
});

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
};

app.get('/user', authMiddleware, (req, res) => {
  const sql = 'SELECT name FROM users WHERE id = ?';
  db.query(sql, [req.userId], (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

// CRUD operations for users
app.get('/users', authMiddleware, (req, res) => {
  const sql = 'SELECT id, name FROM users';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.post('/users', authMiddleware, (req, res) => {
  const { name, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO users (name, password) VALUES (?, ?)';
  db.query(sql, [name, hashedPassword], (err, result) => {
    if (err) throw err;
    res.send({ message: 'User added successfully' });
  });
});

app.put('/users/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { name, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = 'UPDATE users SET name = ?, password = ? WHERE id = ?';
  db.query(sql, [name, hashedPassword, id], (err, result) => {
    if (err) throw err;
    res.send({ message: 'User updated successfully' });
  });
});

app.delete('/users/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send({ message: 'User deleted successfully' });
  });
});

// Protected route example
app.get('/protected', authMiddleware, (req, res) => {
  res.send({ message: 'This is a protected route' });
});

// API Endpoints for Products
app.get('/products', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get('/products/:id', (req, res) => {
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

app.post('/products', (req, res) => {
  const sql = 'INSERT INTO products SET ?';
  db.query(sql, req.body, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.put('/products/:id', (req, res) => {
  const sql = 'UPDATE products SET ? WHERE id = ?';
  db.query(sql, [req.body, req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.delete('/products/:id', (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Get all available stocks
app.get('/inventory', authMiddleware, (req, res) => {
  const sql = 'SELECT * FROM available_stocks';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Add new stock
app.post('/inventory', authMiddleware, (req, res) => {
  const { product_type, size, price_per_unit, quantity } = req.body;
  const sql = 'INSERT INTO available_stocks (product_type, size, price_per_unit, quantity) VALUES (?, ?, ?, ?)';
  db.query(sql, [product_type, size, price_per_unit, quantity], (err, result) => {
    if (err) throw err;
    res.send({ message: 'Stock added successfully' });
  });
});

// Update stock
app.put('/inventory/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { product_type, size, price_per_unit, quantity } = req.body;
  const sql = 'UPDATE available_stocks SET product_type = ?, size = ?, price_per_unit = ?, quantity = ? WHERE id = ?';
  db.query(sql, [product_type, size, price_per_unit, quantity, id], (err, result) => {
    if (err) throw err;
    res.send({ message: 'Stock updated successfully' });
  });
});

// Delete stock
app.delete('/inventory/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM available_stocks WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.send({ message: 'Stock deleted successfully' });
  });
});

// Move stock to not in stock
app.post('/inventory/not-in-stock', authMiddleware, (req, res) => {
  const { id, product_type, size, price_per_unit } = req.body;
  const deleteSql = 'DELETE FROM available_stocks WHERE id = ?';
  const insertSql = 'INSERT INTO not_in_stock (product_type, size, price_per_unit) VALUES (?, ?, ?)';
  db.query(deleteSql, [id], (err, result) => {
    if (err) throw err;
    db.query(insertSql, [product_type, size, price_per_unit], (err, result) => {
      if (err) throw err;
      res.send({ message: 'Stock moved to not in stock' });
    });
  });
});

// Get all not in stock items
app.get('/not-in-stock', authMiddleware, (req, res) => {
  const sql = 'SELECT * FROM not_in_stock';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});


// Move stock to sold
app.post('/inventory/sold', authMiddleware, (req, res) => {
  const { id, product_type, size, price_per_unit, quantity, total_price, sale_date } = req.body;

  // Get the current quantity in stock
  const getQuantitySql = 'SELECT quantity FROM available_stocks WHERE id = ?';
  db.query(getQuantitySql, [id], (err, result) => {
    if (err) throw err;

    const currentQuantity = result[0].quantity;
    const newQuantity = currentQuantity - quantity;

    if (newQuantity < 0) {
      return res.status(400).send({ message: 'Insufficient quantity in stock' });
    }

    // Update the available stock
    const updateSql = 'UPDATE available_stocks SET quantity = ? WHERE id = ?';
    db.query(updateSql, [newQuantity, id], (err, result) => {
      if (err) throw err;

      // Insert the sold stock
      const insertSql = 'INSERT INTO sold (product_type, size, price_per_unit, quantity, total_price, sale_date) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertSql, [product_type, size, price_per_unit, quantity, total_price, sale_date], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Stock moved to sold' });
      });
    });
  });
});

// Get all sold items and calculate total price
app.get('/sold', authMiddleware, (req, res) => {
  const sql = 'SELECT * FROM sold';
  db.query(sql, (err, result) => {
    if (err) throw err;

    const totalProfit = result.reduce((acc, item) => acc + item.total_price, 0);
    res.send({ soldItems: result, totalProfit });
  });
});

// Get weekly profit
app.get('/profits/weekly', authMiddleware, (req, res) => {
  const sql = `
    SELECT SUM(total_price) AS total_profit 
    FROM sold 
    WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

// Get monthly profit
app.get('/profits/monthly', authMiddleware, (req, res) => {
  const sql = `
    SELECT SUM(total_price) AS total_profit 
    FROM sold 
    WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

// Get monthly profit for all months
app.get('/profits/monthly-all', authMiddleware, (req, res) => {
  const sql = `
    SELECT DATE_FORMAT(sale_date, '%Y-%m') AS month, SUM(total_price) AS total_profit
    FROM sold
    GROUP BY month
    ORDER BY month;
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Get yearly profit for all years
app.get('/profits/yearly-all', authMiddleware, (req, res) => {
  const sql = `
    SELECT YEAR(sale_date) AS year, SUM(total_price) AS total_profit
    FROM sold
    GROUP BY year
    ORDER BY year;
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
