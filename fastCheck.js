const express = require('express')
var parseUrl = require('body-parser')
require('dotenv').config();

const API_KEY = process.env.API_KEY;
const app = express()
let encodeUrl = parseUrl.urlencoded({ extended: false })

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');


var multipart = require('connect-multiparty')
var multipartmiddleware = multipart();

app.get('/image', (req, res) => {
  res.sendFile(__dirname + '/form.html')
})

app.post('/image',multipartmiddleware, (req, res) => { 
  

// axios
var data = new FormData();
data.append('allowPlatformToOperateToken', req.body.allowPlatformToOperateToken);
data.append('chain', req.body.chain);
data.append('recipientAddress', req.body.recipientAddress);
data.append('filePath', fs.createReadStream(req.files.filePath.path));
data.append('name', req.body.name);
data.append('description', req.body.description);

var config = {
  method: 'post',
  url: 'https://api.verbwire.com/v1/nft/mint/quickMintFromFile',
  headers: { 
    'X-API-Key': API_KEY, 
    ...data.getHeaders()
  },
  data : data
};

console.log("data",data);

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
  res.send(JSON.stringify(response.data))
})
.catch(function (error) {
  console.log(error);
});

})

app.get('/url', (req, res) => {
    res.sendFile(__dirname + '/form2.html')
  })
  
  app.post('/url', encodeUrl, (req, res) => {
    console.log('Form request:', req.body)
   
	const sdk = require('api')('@verbwire/v1.0#hr2s143dl9hbr7s9');
  

  sdk.auth(API_KEY);
  sdk.get('/nft/data/ownershipForSlug', {
    slug: 'azuki',
    chain: 'ethereum',
    limit: '1',
    page: '1',
    sortDirection: 'DESC'
  })
    .then(res =>  console.log(`${JSON.stringify(res)}`))
    .catch(err => console.error(err));

  })
app.listen(8080)
