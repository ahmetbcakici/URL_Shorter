import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql';

const app = express();
const PORT = 9090 || process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
require('dotenv').config();

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

con.connect(err => {
    if (err) throw err;
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/', (req, res) => {
    const { originalLink } = req.body;
    let shortLink =
        originalLink[originalLink.length - 1] +
        Date.now()
        .toString()
        .substr(9, 4) +
        originalLink[originalLink.length - 2];
    res.json({ shortLink });
});

app.get('/:link_short', (req, res) => {
    const { link_short } = req.params;
    con.query(`SELECT * FROM Links WHERE link_short = '${link_short}'`, function(
        err,
        result,
        fields
    ) {
        if (err) throw err;
        if (result.length > 0) return res.redirect(result[0].link_original);
    });
});

app.listen(PORT, () => console.log(`Working on ${PORT}`));