const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const request = require('request');

const app = express();

const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/dashboard', (req, res) => {
    request('https://www.cbr-xml-daily.ru/daily_json.js', (err, response, body) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        const data = JSON.parse(body);
       
        const dataArray = [];
        for (let item in data.Valute) {
            dataArray.push(
                {
                cardId: item,
                name: data.Valute[item].Name,
                nominal: data.Valute[item].Nominal,
                value: data.Valute[item].Value,
                prev: data.Valute[item].Previous,
                toggle: true
            });
        }
        return res.json(JSON.stringify(dataArray));
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.listen(port, () => {
    console.log('App has been started on ' + port);
});
