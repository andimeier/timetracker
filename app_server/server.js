var express = require('express'),
records = require('./routes/records');
 
var app = express();
app.use(express.bodyParser());
 
app.get('/records', records.findAll);
app.get('/records/:id', records.findById);
app.post('/records', records.add);
app.put('/records/:id', records.update);
app.delete('/records/:id', records.delete);

app.listen(3000);
console.log('Listening on port 3000...');