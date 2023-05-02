const express = require('express')
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true}))

app.get('/', function(request, response){
    response.sendFile(__dirname + '/index.html');
})


app.get('/bmicalculator', function(request, response){
    response.sendFile(__dirname + '/bmiCalculator.html');
})

app.post('/', function(request, response) {
    var numberOne = Number(request.body.numberOne);
    var numberTwo = Number(request.body.numberTwo);
    var result = numberOne + numberTwo

    response.send('The result of the calculate is ' + result)
})


app.post('/bmicalculator', function(req, res) {
    var weight = parseFloat(req.body.weight);
    var height = parseFloat(req.body.height);
    var bmi = weight / (height * height);

    res.send('Your BMI is ' + bmi);
})

app.listen(5000, function(){
    console.log('port 5000');
});