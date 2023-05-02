const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require("https");
require('dotenv').config();


const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(req, res){
    res.sendFile(__dirname + "/signup.html")
})



app.post('/', function(req, res){
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let email = req.body.email

    console.log(firstName, lastName, email);

    let data = {
        members: [
            {email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }}
        ]
    };

    let jsonData = JSON.stringify(data);
    const url = 'https://us13.api.mailchimp.com/3.0/lists/65cf5eb7de'

    let options = {
        
        method: 'POST',
        
        auth: process.env.AUTH
        
        
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
          res.sendFile(__dirname+"/success.html");
        }else{
          res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
          console.log(JSON.parse(data));
        });
      });
      request.write(jsonData);
      request.end();
    });

app.post('/failure', function(req, res){
    res.redirect('/');
})


app.listen(process.env.PORT || 3000, function(){
    console.log('server is running on port 3000');
})


//dee1fc53c08dd6e66fdf05cbe8a16cc9-us13

//65cf5eb7de

//dee1fc53c08dd6e66fdf05cbe8a16cc9-us13