const fs = require('fs');
const express = require('express');
const app = express();

// express.json() : Express 可以解讀 JSON String 轉成 JavaScript Object
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // 產生新ID : 抓取最後一筆資料ID + 1
  const newId = tours[tours.length - 1].id + 1;
  // 合併 ID & POST過來的資料 (req.body)
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

const port = 3000;
app.listen(port, () => console.log(`App running on port ${port}`));
