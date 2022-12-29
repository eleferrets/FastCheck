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

app.get('/owner', (req, res) => {
  res.sendFile(__dirname + '/form.html')
})
app.post('/owner', encodeUrl, (req, res) => {
  console.log('Form request:', req.body)

  // New function that takes element and owner or slug
  // New button that calls results endpoint to increase the page and include Results: page # for slug only, otherwise results for the other
  // Add another message if there is are no results
  // Add mx-auto to card
  // Refactor js file and add spacing to the cards, fields
  // Redo the readme and do the presenting stuff
  const sdk = require('api')('@verbwire/v1.0#hr2s143dl9hbr7s9');
let response = []
let walletAddress = req.body['owner']
let chain = req.body['chain']
sdk.auth(API_KEY);
sdk.get('/nft/data/transactions', 
        {
  				walletAddress, 
  			  chain
				})
  .then(ret =>  { 

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
    response = ret["nft_transactions"]
    console.log(response)
for (const element of response) {
console.log("Hi2")

content = `
<div class="card w-50">
<div class="card-body">
  <h5 class="card-title">Owner: ${walletAddress.toUpperCase()}</h5>
  <p class="card-text">Contact Address: ${element["contractAddress"]}</p>
  <p class="card-text">From: ${element["from"]}</p>
  <p class="card-text">To: ${element["to"]}</p>
  <p class="card-text">Token ID: ${element["tokenID"]}</p>
  <p class="card-text">Token Name: ${element["tokenName"]}</p>
  <p class="card-text">Token Symbol: ${element["tokenSymbol"]}</p>
  <p class="card-text">Token Decimal: ${element["tokenDecimal"]}</p>
  <p class="card-text">Transaction Index: ${element["transactionIndex"]}</p>
  <p class="card-text">Gas: ${element["gas"]}</p>
  <p class="card-text">Gas Price: ${element["gasPrice"]}</p>
  <p class="card-text">Gas Used: ${element["gasgasUsed"]}</p>
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


app.get('/slug', (req, res) => {
    res.sendFile(__dirname + '/form2.html')
  })
  
  app.post('/slug', encodeUrl, (req, res) => {
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
