var express = require('express'),
hours = require('./routes/hours');
 
var app = express();
app.use(express.bodyParser());
 
app.get('/hours', hours.findAll);
app.get('/hours/:id', hours.findById);
app.post('/hours', hours.add);
app.put('/hours/:id', hours.update);
app.delete('/hours/:id', hours.delete);

app.listen(3000);
console.log('Listening on port 3000...');