<div align="center">
    <img alt="verbwire" src="resources/_.gif"/>
</div>

# fastCheck
This simple checking app was built using the Verbwire API. The app lets you check the owners of an NFT using the slug identifier, and the app also allows for checking all the transactions of a specific wallet address in a supported blockchain. The app uses express and two forms that generate a third website to show the results. For more details on using the Verbwire API you can access the full API docs [here](https://docs.verbwire.com/docs)

## Requirements
1. You'll need a Verbwire API Key. You can get a free API key [HERE](https://www.verbwire.com/auth/register)

## Steps to run program locally
1. Checkout the "local" branch
2. Create a .env file and add an entry for API_KEY with your API Key in the form, "YOUR API KEY GOES HERE", with your actual API key. See image in the additional section below.

![image](https://user-images.githubusercontent.com/40572853/210030228-1dcd452d-0a9e-4b94-965d-fad26fa1b5a5.png)

2. From you command prompt, type in *npm i* to install node modules

3. From you command prompt, type in *node fastCheck.js* to start the program 

4. Open your browser and goto localhost:8080/slug to reach the slug search, or localhost:8080/owner to reach the transactions of a specific wallet address. See Additional info section below for screenshots.
![image](https://user-images.githubusercontent.com/40572853/210030341-8297e0c4-3582-43ce-ad68-a2da3bc5d961.png)
![image](https://user-images.githubusercontent.com/40572853/210030355-9c729df0-2eba-4a53-944b-b48a731de38c.png)


## Additional Info:
A new file is regenerated each time a search is performed, so it may take a while for the wallet transactions to show up if there are a lot of transactions.
