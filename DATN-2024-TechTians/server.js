const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Kết nối tới cơ sở dữ liệu
const db = mysql.createConnection({
    host: 'localhost',
    user: 'sa',
    password: '123456',
    database: 'DATN-2024-TechTians'
});

// Kiểm tra kết nối
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Lấy danh sách khách hàng có phân trang
app.get('/api/customers', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Số lượng khách hàng trên mỗi trang
    const offset = (page - 1) * limit;

    db.query('SELECT * FROM Customer LIMIT ?, ?', [offset, limit], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// Tìm kiếm khách hàng
app.get('/api/customers/search', (req, res) => {
    const query = req.query.q;
    db.query('SELECT * FROM Customer WHERE Name LIKE ?', [`%${query}%`], (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// Thêm khách hàng
app.post('/api/customers', (req, res) => {
    const { Name, Email, Phone } = req.body;
    db.query('INSERT INTO Customer (Name, Email, Phone) VALUES (?, ?, ?)', [Name, Email, Phone], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, Name, Email, Phone });
    });
});

// Cập nhật thông tin khách hàng
app.put('/api/customers/:id', (req, res) => {
    const id = req.params.id;
    const { Name, Email, Phone } = req.body;
    db.query('UPDATE Customer SET Name = ?, Email = ?, Phone = ? WHERE CustomerID = ?', [Name, Email, Phone, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, Name, Email, Phone });
    });
});

// Xóa khách hàng
app.delete('/api/customers/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM Customer WHERE CustomerID = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Khách hàng đã bị xóa' });
    });
});

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
