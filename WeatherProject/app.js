const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true}))


app.get('/', function(request, res){

    res.sendFile(__dirname + "/index.html");
    
})

app.post("/",(req,res)=>{
    const query = req.body.cityName;
    const apiKey = "62bc8f5e042586fe545da005ea79abde";
    const unit = "metric";
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid='+apiKey+'&units=' + unit;
    https.get(url,(response)=>{

        console.log(response.statusCode);

        response.on('data', (data) => {
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageUrl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';
            res.write("<p1>The weather is currently " + weatherDescription + "</p1>");
            res.write("<h1>The temperature in "+ query +" is " + temp + " degrees celcius</h1>");
            res.write("<img src="+imageUrl+">");
            res.send();



        });

    });
})








app.listen(5000, function(){
    console.log('port 5000');
});
