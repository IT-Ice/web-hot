var express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.send('holle ice!');
});

var server = app.listen(3000, () => {
    console.log(`server start at port${server.address().address}`);
});