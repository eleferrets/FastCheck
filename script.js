const { response } = require('express');

const form = document.querySelector("form");
const apiKey = process.env.API_KEY;
const submit = document.querySelector("#submit");
const gallery = document.querySelector(".gallery");

var response = "";
var jsonResponse = "";
var data = "";

form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const value = submit.value.trim();
    if (value == "") hasInput = false;
    else hasInput = true;
    if (!hasInput) {
      gallery.classList.add("hidden");
      moreResults.classList.add("hidden");
      handleSearch(evt);
    } else {
      gallery.classList.remove("hidden");
      moreResults.classList.remove("hidden");
    }
  });
  async function handleSearch(evt) {
    // Get a search result without whitespace and display the data in the search results
    query = submit.value.trim();
    data = await getResponse(searchUrl);
    displaySearchResults(data);
  }
  async function getResponse(movieUrl) {
    // This is the function you need to make external api calls.
    // If the data is wrapped around something, you need to extract the data further.


    	const sdk = require('api')('@verbwire/v1.0#hr2s143dl9hbr7s9');
  

  sdk.auth(apiKey);
  sdk.get('/nft/data/ownershipForSlug', {
    slug: 'azuki',
    chain: 'ethereum',
    limit: '1',
    page: '1',
    sortDirection: 'DESC'
  })
    .then(res =>  response = res)
    .catch(err => console.error(err));

    jsonResponse = await response.json();
    console.log(jsonResponse)
    data = jsonResponse.results;
    return data;
  }
  function displaySearchResults(data) {
    // Pass in each sub object and display them
    data.forEach((el) => {
      gallery.innerHTML += generateHTML(el, el.id);
    });
  }
  window.onload = async function () {
    // run your function here to make it execute as soon as the page loads
    gallery.innerHTML = "";
  };
  function generateHTML(el, id) {
    return ` <div class = "item popup">
          <div> <span><p>&nbsp;${el.vote_average} </p></span> <p class = "movie-title" >${el.title} </p> </div>
          </div>`;
  }