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

// Middleware to extract tenant ID from JWT token
const tenantMiddleware = (req, res, next) => {
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
    req.tenantId = decoded.tenant_id;
    req.userId = decoded.id;

    // Fetch user modules and add to request
    const sql = 'SELECT modules FROM users WHERE id = ? AND tenant_id = ?';
    db.query(sql, [req.userId, req.tenantId], (err, result) => {
      if (err) {
        console.error('Error fetching user modules:', err);
        return res.status(500).send({ message: 'Error fetching user modules' });
      }
      req.userModules = JSON.parse(result[0].modules);
      next();
    });
  });
};

const generateTenantId = () => {
  return 'tenant_' + Math.random().toString(36).substr(2, 9);
};

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

const moduleMiddleware = (requiredModule) => {
  return (req, res, next) => {
    try {
      // Fetch the user modules from the database if they are not in the request
      if (!req.userModules) {
        const sql = 'SELECT modules FROM users WHERE id = ? AND tenant_id = ?';
        db.query(sql, [req.userId, req.tenantId], (err, result) => {
          if (err) {
            console.error('Error fetching user modules:', err);
            return res.status(500).send({ message: 'Error fetching user modules' });
          }
          req.userModules = JSON.parse(result[0].modules);
          if (!req.userModules.includes(requiredModule)) {
            return res.status(403).send({ message: 'Access denied' });
          }
          next();
        });
      } else {
        // If userModules is already in the request, just check it
        if (!req.userModules.includes(requiredModule)) {
          return res.status(403).send({ message: 'Access denied' });
        }
        next();
      }
    } catch (error) {
      console.error('Error parsing user modules:', error);
      return res.status(500).send({ message: 'Error parsing user modules' });
    }
  };
};

const auditLog = (userId, tenantId, action, details) => {
  const sql = 'INSERT INTO audit_logs (user_id, tenant_id, action, details, timestamp) VALUES (?, ?, ?, ?, ?)';
  const timestamp = new Date();
  db.query(sql, [userId, tenantId, action, details, timestamp], (err, result) => {
    if (err) {
      console.error('Error logging audit:', err);
    }
  });
};

// Register a new user (Admin only)
app.post('/register', (req, res) => {
  const { name, password } = req.body;
  const tenantId = generateTenantId();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const modules = JSON.stringify(['Register', 'Dashboard', 'Products', 'Manage Inventory', 'Manage Stocks', 'All Stocks', 'Sold Stocks', 'Monthly & Yearly Profits', 'Users', 'Audit Logs']); // Default modules for admin
  const userType = 'admin';
  const sql = 'INSERT INTO users (name, password, tenant_id, modules, user_type) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, hashedPassword, tenantId, modules, userType], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error registering user' });
    }
    res.send({ message: 'User registered successfully', tenantId });
  });
});

// Login
app.post('/login', (req, res) => {
  const { tenantId, name, password } = req.body;
  const sql = 'SELECT * FROM users WHERE name = ? AND tenant_id = ?';
  db.query(sql, [name, tenantId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }
    const user = result[0];
    console.log('User found:', user); // Log user details
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, tenant_id: user.tenant_id }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ token, tenantId: user.tenant_id });
    
  });
});





app.get('/user', [authMiddleware, tenantMiddleware], (req, res) => {
  const sql = 'SELECT name, modules FROM users WHERE id = ? AND tenant_id = ?';
  db.query(sql, [req.userId, req.tenantId], (err, result) => {
    if (err) throw err;
    console.log('Fetched user:', result[0]);
    res.send(result[0]);
  });
});

// Endpoint to fetch users with their modules and user type
app.get('/users', [authMiddleware, tenantMiddleware, moduleMiddleware('Users')], (req, res) => {
  const sql = 'SELECT id, name, modules, user_type FROM users WHERE tenant_id = ?';
  db.query(sql, [req.tenantId], (err, result) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send({ message: 'Error fetching users' });
    }
    res.send(result);
  });
});

app.post('/users', [authMiddleware, tenantMiddleware], (req, res) => {
  const { name, password, modules } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userType = 'regular'; // New users added by admin are regular users
  const sql = 'INSERT INTO users (name, password, tenant_id, modules, user_type) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, hashedPassword, req.tenantId, JSON.stringify(modules), userType], (err, result) => {
    if (err) throw err;
    auditLog(req.userId, req.tenantId, 'ADD_USER', `Added user ${name}`);
    res.send({ message: 'User added successfully' });
  });
});

app.put('/users/:id', [authMiddleware, tenantMiddleware], (req, res) => {
  const { id } = req.params;
  const { name, password, modules } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = 'UPDATE users SET name = ?, password = ?, modules = ? WHERE id = ? AND tenant_id = ?';
  db.query(sql, [name, hashedPassword, JSON.stringify(modules), id, req.tenantId], (err, result) => {
    if (err) throw err;
    auditLog(req.userId, req.tenantId, 'UPDATE_USER', `Updated user ${name}`);
    res.send({ message: 'User updated successfully' });
  });
});

app.delete('/users/:id', [authMiddleware, tenantMiddleware], (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ? AND tenant_id = ?';
  db.query(sql, [id, req.tenantId], (err, result) => {
    if (err) throw err;
    auditLog(req.userId, req.tenantId, 'DELETE_USER', `Deleted user with ID ${id}`);
    res.send({ message: 'User deleted successfully' });
  });
});

// Protected route example
app.get('/protected', [authMiddleware, tenantMiddleware], (req, res) => {
  res.send({ message: 'This is a protected route' });
  auditLog(req.userId, req.tenantId, 'ACCESS_PROTECTED', 'Accessed protected route');
});

// API Endpoints for Products
app.get('/products', [tenantMiddleware, moduleMiddleware('Products')], (req, res) => {
  const sql = 'SELECT * FROM products WHERE tenant_id = ?';
  db.query(sql, [req.tenantId], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get('/products/:id', tenantMiddleware, (req, res) => {
  const sql = 'SELECT * FROM products WHERE id = ? AND tenant_id = ?';
  db.query(sql, [req.params.id, req.tenantId], (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

app.post('/products', tenantMiddleware, (req, res) => {
  const sql = 'INSERT INTO products SET ?';
  const productData = { ...req.body, tenant_id: req.tenantId };
  db.query(sql, productData, (err, result) => {
    if (err) throw err;
    auditLog(req.userId, req.tenantId, 'ADD_PRODUCT', `Added product ${req.body.name}`);
    res.send(result);
  });
});

app.put('/products/:id', tenantMiddleware, (req, res) => {
  const sql = 'UPDATE products SET ? WHERE id = ? AND tenant_id = ?';
  const productData = { ...req.body, tenant_id: req.tenantId };
  db.query(sql, [productData, req.params.id, req.tenantId], (err, result) => {
    if (err) throw err;
    auditLog(req.userId, req.tenantId, 'UPDATE_PRODUCT', `Updated product ${req.params.id}`);
    res.send(result);
  });
});

app.delete('/products/:id', tenantMiddleware, (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ? AND tenant_id = ?';
  db.query(sql, [req.params.id, req.tenantId], (err, result) => {
    if (err) throw err;
    auditLog(req.userId, req.tenantId, 'DELETE_PRODUCT', `Deleted product ${req.params.id}`);
    res.send(result);
  });
});

// Get all available stocks
app.get('/inventory', [authMiddleware, tenantMiddleware, moduleMiddleware('Manage Inventory')], (req, res) => {
  const sql = 'SELECT * FROM available_stocks WHERE tenant_id = ?';
  db.query(sql, [req.tenantId], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Add new stock
app.post('/inventory', [authMiddleware, tenantMiddleware], (req, res) => {
  const { product_type, size, price_per_unit, quantity } = req.body;
  const sql = 'INSERT INTO available_stocks (product_type, size, price_per_unit, quantity, tenant_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [product_type, size, price_per_unit, quantity, req.tenantId], (err, result) => {
    if (err) throw err;
    auditLog(req.userId, req.tenantId, 'ADD_STOCK', `Added stock ${product_type}`);
    res.send({ message: 'Stock added successfully' });
  });
});

// Update stock
app.put('/inventory/:id', [authMiddleware, tenantMiddleware], (req, res) => {
  const { id } = req.params;
  const { product_type, size, price_per_unit, quantity } = req.body;
  const sql = 'UPDATE available_stocks SET product_type = ?, size = ?, price_per_unit = ?, quantity = ? WHERE id = ? AND tenant_id = ?';
  db.query(sql, [product_type, size, price_per_unit, quantity, id, req.tenantId], (err, result) => {
    if (err) throw err;
    auditLog(req.userId, req.tenantId, 'UPDATE_STOCK', `Updated stock ${id}`);
    res.send({ message: 'Stock updated successfully' });
  });
});

// Delete stock
app.delete('/inventory/:id', [authMiddleware, tenantMiddleware], (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM available_stocks WHERE id = ? AND tenant_id = ?';
  db.query(sql, [id, req.tenantId], (err, result) => {
    if (err) throw err;
    auditLog(req.userId, req.tenantId, 'DELETE_STOCK', `Deleted stock ${id}`);
    res.send({ message: 'Stock deleted successfully' });
  });
});

// Move stock to not in stock
app.post('/inventory/not-in-stock', [authMiddleware, tenantMiddleware], (req, res) => {
  const { id, product_type, size, price_per_unit } = req.body;
  const deleteSql = 'DELETE FROM available_stocks WHERE id = ? AND tenant_id = ?';
  const insertSql = 'INSERT INTO not_in_stock (product_type, size, price_per_unit, tenant_id) VALUES (?, ?, ?, ?)';
  db.query(deleteSql, [id, req.tenantId], (err, result) => {
    if (err) throw err;
    db.query(insertSql, [product_type, size, price_per_unit, req.tenantId], (err, result) => {
      if (err) throw err;
      auditLog(req.userId, req.tenantId, 'MOVE_STOCK_NOT_IN_STOCK', `Moved stock ${id} to not in stock`);
      res.send({ message: 'Stock moved to not in stock' });
    });
  });
});

// Get all not in stock items
app.get('/not-in-stock', [authMiddleware, tenantMiddleware, moduleMiddleware('Manage Stocks', 'All Stocks')], (req, res) => {
  const sql = 'SELECT * FROM not_in_stock WHERE tenant_id = ?';
  db.query(sql, [req.tenantId], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Move stock to sold
app.post('/inventory/sold', [authMiddleware, tenantMiddleware, moduleMiddleware('Manage Stocks', 'All Stocks')], (req, res) => {
  const { id, product_type, size, price_per_unit, quantity, total_price, sale_date } = req.body;

  // Get the current quantity in stock
  const getQuantitySql = 'SELECT quantity FROM available_stocks WHERE id = ? AND tenant_id = ?';
  db.query(getQuantitySql, [id, req.tenantId], (err, result) => {
    if (err) throw err;

    const currentQuantity = result[0].quantity;
    const newQuantity = currentQuantity - quantity;

    if (newQuantity < 0) {
      return res.status(400).send({ message: 'Insufficient quantity in stock' });
    }

    // Update the available stock
    const updateSql = 'UPDATE available_stocks SET quantity = ? WHERE id = ? AND tenant_id = ?';
    db.query(updateSql, [newQuantity, id, req.tenantId], (err, result) => {
      if (err) throw err;

      // Insert the sold stock
      const insertSql = 'INSERT INTO sold (product_type, size, price_per_unit, quantity, total_price, sale_date, tenant_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(insertSql, [product_type, size, price_per_unit, quantity, total_price, sale_date, req.tenantId], (err, result) => {
        if (err) throw err;
        auditLog(req.userId, req.tenantId, 'MOVE_STOCK_SOLD', `Moved stock ${id} to sold`);
        res.send({ message: 'Stock moved to sold' });
      });
    });
  });
});

// Get all sold items and calculate total price
app.get('/sold', [authMiddleware, tenantMiddleware, moduleMiddleware('Sold Stocks')], (req, res) => {
  const sql = 'SELECT * FROM sold WHERE tenant_id = ?';
  db.query(sql, [req.tenantId], (err, result) => {
    if (err) throw err;
    const totalProfit = result.reduce((acc, item) => acc + item.total_price, 0);
    res.send({ soldItems: result, totalProfit });
  });
});

// Get weekly profit
app.get('/profits/weekly', [authMiddleware, tenantMiddleware], (req, res) => {
  const sql = `
    SELECT SUM(total_price) AS total_profit 
    FROM sold 
    WHERE tenant_id = ? AND sale_date >= DATE_SUB(CURDATE(), INTERVAL 1 WEEK)
  `;
  db.query(sql, [req.tenantId], (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

// Get monthly profit
app.get('/profits/monthly', [authMiddleware, tenantMiddleware, moduleMiddleware('Monthly & Yearly Profits', 'Sold Stocks')], (req, res) => {
  const sql = `
    SELECT SUM(total_price) AS total_profit 
    FROM sold 
    WHERE tenant_id = ? AND sale_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
  `;
  db.query(sql, [req.tenantId], (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

// Get monthly profit for all months
app.get('/profits/monthly-all', [authMiddleware, tenantMiddleware, moduleMiddleware('Monthly & Yearly Profits')], (req, res) => {
  const sql = `
    SELECT DATE_FORMAT(sale_date, '%Y-%m') AS month, SUM(total_price) AS total_profit
    FROM sold
    WHERE tenant_id = ?
    GROUP BY month
    ORDER BY month;
  `;
  db.query(sql, [req.tenantId], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Get yearly profit for all years
app.get('/profits/yearly-all', [authMiddleware, tenantMiddleware, moduleMiddleware('Monthly & Yearly Profits')], (req, res) => {
  const sql = `
    SELECT YEAR(sale_date) AS year, SUM(total_price) AS total_profit
    FROM sold
    WHERE tenant_id = ?
    GROUP BY year
    ORDER BY year;
  `;
  db.query(sql, [req.tenantId], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Get all audit logs
app.get('/audit-logs', [authMiddleware, tenantMiddleware, moduleMiddleware('Audit Logs')], (req, res) => {
  const sql = `
    SELECT a.id, u.name AS user_name, a.action, a.details, a.timestamp 
    FROM audit_logs a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.tenant_id = ?
    ORDER BY a.timestamp DESC
  `;
  db.query(sql, [req.tenantId], (err, result) => {
    if (err) {
      console.error('Error fetching audit logs:', err);
      return res.status(500).send({ message: 'Error fetching audit logs' });
    }
    res.send(result);
  });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


