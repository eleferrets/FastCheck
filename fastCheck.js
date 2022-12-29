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
  let response = []
  let slug = req.body['slug']
  let chain = req.body['chain']
  sdk.auth(API_KEY);
  sdk.get('/nft/data/ownershipForSlug', {
    slug,
    chain,
    limit: '10',
    page: '1',
    sortDirection: 'DESC'
  })
    .then(ret =>  { 
          const fs = require('fs');

    let content = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <title></title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
        <div class="container">
          <h2>Results</h2>`;
          fs.writeFile(__dirname + '/form3.html', content, err => {
            if (err) {
              console.error(err);
            }
            console.log("Hi1")
          });
      response = ret["ownership"]["results"]
      console.log(response)
for (const element of response) {
  console.log("Hi2")

  content = `
  <div class="card w-50">
  <div class="card-body">
    <h5 class="card-title">Slug: ${slug.toUpperCase()}</h5>
    <p class="card-text">Chain: ${element["chain"].charAt(0).toUpperCase() + element["chain"].slice(1)}</p>
    <p class="card-text">Token Count: ${element["tokenCount"]}</p>
    <p class="card-text">Top Bid Amount: ${element["topBidValue"]}</p>
    <p class="card-text">Total Bid Amount: ${element["totalBidValue"]}</p>
  </div>
</div>
  `;
  fs.appendFile(__dirname + '/form3.html', content, err => {
    if (err) {
      console.error(err);
    }
    console.log("Hi3")

  });
}

    content = `</body>
    </html>`;



    fs.appendFile(__dirname + '/form3.html', content, err => {
      if (err) {
        console.error(err);
      }
      console.log("Hi4")

    });
    console.log("Hi5")

    res.redirect('/results');
    })
    .catch(err => console.error(err));
  })
  app.get('/results', (req, res) => {
    res.sendFile(__dirname + '/form3.html')
  })
app.listen(8080)
