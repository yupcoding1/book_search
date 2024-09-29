const express = require('express');
const pg = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');



const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
}));

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'librarydb',
  password: 'password',
  port: 5432
});

// JWT secret key
const SECRET_KEY = 'yourSecretKey';

// Middleware for admin-only access
const checkAdmin = (req, res, next) => {
    console.log("arrived at check");
  const token = req.cookies.token;
  console.log(token);
  if (!token) return res.status(403).send('Unauthorized');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err || user.role !== 'admin') return res.status(403).send('Unauthorized');
    req.user = user;
    next();
  });
};

// Register user/admin
app.post('/register', async (req, res) => {
    console.log("reached server")
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username, hashedPassword, role]);
    res.send('User registered');
  } catch (err) {
    res.status(500).send('Error registering user');
  }
});

// Login user/admin
app.post('/login', async (req, res) => {
    
  const { username, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send('Invalid credentials');
  }
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' })
  console.log(token);
  res.cookie('token', token, { httpOnly: true, secure: false });
  console.log(res.cookie);
  res.send('Logged in');
});

// Get all books (accessible by users and admins)
app.get('/books', async (req, res) => {
  const result = await pool.query('SELECT * FROM books');
  res.json(result.rows);
});

// Add a book (admin only)
app.post('/books', checkAdmin, async (req, res) => {
  const { isbn, title, author, year_of_publication, publisher, image_url_s, image_url_m, image_url_l } = req.body;
  try {
    await pool.query('INSERT INTO books (isbn, title, author, year_of_publication, publisher, image_url_s, image_url_m, image_url_l) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
                    [isbn, title, author, year_of_publication, publisher, image_url_s, image_url_m, image_url_l]);
    res.send('Book added');
  } catch (err) {
    console.log(err)
    res.status(500).send('Error adding book');
  }
});

// Delete a book (admin only)
app.delete('/books/:isbn', checkAdmin, async (req, res) => {
  const { isbn } = req.params;
  try {
    await pool.query('DELETE FROM books WHERE isbn = $1', [isbn]);
    res.send('Book deleted');
  } catch (err) {
    res.status(500).send('Error deleting book');
  }
});

// Start Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// // Check user role
// app.get('/check-role', (req, res) => {
//     const token = req.cookies.token;
  
//     if (!token) {
//       return res.status(403).send({ role: 'guest' }); // or whatever default role you want to return
//     }
  
//     jwt.verify(token, SECRET_KEY, (err, user) => {
//       if (err) return res.status(403).send({ role: 'guest' }); // Return default role on error
//       res.send({ role: user.role }); // Send the user's role back to the client
//     });
//   });
  
// Update a book (admin only)
app.put('/books/:isbn', checkAdmin, async (req, res) => {
    const { isbn } = req.params;
    const { title, author, year_of_publication, publisher, image_url_s, image_url_m, image_url_l } = req.body;
    try {
      await pool.query(
        'UPDATE books SET title = $1, author = $2, year_of_publication = $3, publisher = $4, image_url_s = $5, image_url_m = $6, image_url_l = $7 WHERE isbn = $8',
        [title, author, year_of_publication, publisher, image_url_s, image_url_m, image_url_l, isbn]
      );
      res.send('Book updated');
    } catch (err) {
      console.log(err);
      res.status(500).send('Error updating book');
    }
  });