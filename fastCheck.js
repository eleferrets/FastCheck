const express = require("express");
var parseUrl = require("body-parser");
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const app = express();
let encodeUrl = parseUrl.urlencoded({ extended: false });

const fs = require("fs");

function generateHTML(req, res, data, url) {
  let slug = req.body["slug"];
  let chain = req.body["chain"];
  let walletAddress = req.body["owner"];
  let slugTog = false;
  let ownerTog = false;
  let response = [];
  let link = "";
  if (url == "slug") {
    slugTog = true;
    link = "http://localhost:8080/slug";
  }
  if (url == "owner") {
    ownerTog = true;
    link = "http://localhost:8080/owner";
  }
  let content = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <title></title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
      <div class="container">`;
  if (slugTog) {
    content += `<h2>Results For ${slug.toUpperCase()} On ${
      chain.charAt(0).toUpperCase() + chain.slice(1)
    } Chain</h2>`;
  } else if (ownerTog) {
    content += `<h2>Results For ${walletAddress.toUpperCase()}</h2>`;
  }
  content += `<a class="btn btn-info" href="${link}" role="button">Back</a>`;

  fs.writeFile(__dirname + "/form3.html", content, (err) => {
    if (err) {
      console.error(err);
    }
  });
  if (slugTog) {
    response = data["ownership"]["results"];
  } else if (ownerTog) {
    response = data["nft_transactions"];
  }
  for (const element of response) {
    if (slugTog) {
      content = `
  <div class="card w-50">
  <div class="card-body">
    <h5 class="card-title">${slug.toUpperCase()}</h5>
    <p class="card-text">Token Count: ${element["tokenCount"]}</p>
    <p class="card-text">Top Bid Amount: ${element["topBidValue"]}</p>
    <p class="card-text">Total Bid Amount: ${element["totalBidValue"]}</p>
  </div>
  </div>
  `;
    } else if (ownerTog) {
      content = `
  <div class="card w-75">
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
    }
    fs.appendFile(__dirname + "/form3.html", content, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  if (!response.length) {
    content = `<p class="text-center">Nothing here!</p>`;
    fs.appendFile(__dirname + "/form3.html", content, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  content = `</body>
  </html>`;

  fs.appendFile(__dirname + "/form3.html", content, (err) => {
    if (err) {
      console.error(err);
    }
  });
  res.redirect("/results");
}

app.get("/owner", (req, res) => {
  res.sendFile(__dirname + "/form.html");
});
app.post("/owner", encodeUrl, (req, res) => {
  console.log("Form request:", req.body);

  // Refactor js file and add spacing to the cards, fields
  // Redo the readme and do the presenting stuff
  const sdk = require("api")("@verbwire/v1.0#hr2s143dl9hbr7s9");
  let response = [];
  let walletAddress = req.body["owner"];
  let chain = req.body["chain"].toLowerCase();
  sdk.auth(API_KEY);
  sdk
    .get("/nft/data/transactions", {
      walletAddress,
      chain,
    })
    .then((ret) => {
      generateHTML(req, res, ret, "owner");
    })
    .catch((err) => console.error(err));
});

app.get("/slug", (req, res) => {
  res.sendFile(__dirname + "/form2.html");
});

app.post("/slug", encodeUrl, (req, res) => {
  console.log("Form request:", req.body);

  const sdk = require("api")("@verbwire/v1.0#hr2s143dl9hbr7s9");
  let slug = req.body["slug"].toLowerCase();
  let chain = req.body["chain"].toLowerCase();
  let limit = req.body["limit"];
  sdk.auth(API_KEY);
  sdk
    .get("/nft/data/ownershipForSlug", {
      slug,
      chain,
      limit,
      page: "1",
      sortDirection: "DESC",
    })
    .then((ret) => {
      generateHTML(req, res, ret, "slug");
    })
    .catch((err) => console.error(err));
});
app.get("/results", (req, res) => {
  res.sendFile(__dirname + "/form3.html");
});

app.listen(8080);
