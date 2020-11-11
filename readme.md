# botbroker-discord
botbroker-discord is a discord bot application to integrate the BotBroker v2 API.
Currently it supports all Bot listings, but not groups. It could easily be extended to support groups.
You will need to contact Shrey from BotBroker at 66_shrey on Twitter to acquire an API key.

## Usage
You will need to create .env files in the format of the .example.env files in order for the program to run correctly. Included are Procfiles for Heroku if you're interested in hosting it there. If the buildpack is not detected, use Python for the py folder, and Node for the js folder.

## Deploy
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
This defaults to the Python directory. If you prefer the JS variant, I recommend you fork the repo and change the procfile, then deploy from there.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)