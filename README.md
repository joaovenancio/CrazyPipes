# Crazy Pipes!

Crarzy Pipes is a Phaser3 game inspired by PipeMania.

## Versions

- Latest: [1.0.0](https://github.com/joaovenancio/CrazyPipes/releases/tag/v1.0.0)
- Live version available on: https://venancio.itch.io/crazy-pipes 

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch a development web server |
| `npm run build` | Create a production build in the `dist` folder |
| `npm run dev-nolog` | Launch a development web server without sending anonymous data |
| `npm run build-nolog` | Create a production build in the `dist` folder without sending anonymous data |

## Install Instructions

There is two ways of installing the game:
- Depolying one of the released builds to a server; or
- Creating a development enviroment using Node and running the game files from it

### Using a Release Build

Download the latest release file (`index.zip`) and unpack all of its files to a live server. Acess the provided URL to the server using a browser to start the game.

### Using Node

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development server by running `npm run dev`.

The local development server runs on `http://localhost:8080` by default. Please see the webpack documentation if you wish to change this, or add SSL support.

Once the server is running you can edit any of the files in the `src` folder. Webpack will automatically recompile your code and then reload the browser.

## Deploying to Production

After you run the `npm run build` command, your code will be built into a single bundle and saved to the `dist` folder, along with any other assets your project imported, or stored in the public assets folder.

In order to deploy the game, you will need to upload *all* of the contents of the `index.zip` file (available on the releases tab of the GitHub page) OR all the contents of the `dist` folder (if you are using the source code) to a public facing web server.

## Author Information

- João Vítor Demaria Venâncio 
    -[LinkedIn](https://www.linkedin.com/in/jo%C3%A3o-v%C3%ADtor-ven%C3%A2ncio/)
    -Email: [joaovitordvenancio@gmail.com](joaovitordvenancio@gmail.com)

## Credits

- holizna-cc0-mini-boss.mp3:
    - **Mini Boss** by HoliznaCC0. Available at (https://freemusicarchive.org/music/holiznacc0/retro-gamer-soundtrack/mini-boss/)
    - License: Creative Commons 0

- 371176__samsterbirdies__button-ting.wav:
    - **button ting** by SamsterBirdies. Available at (https://freesound.org/s/371176/)
    - License: Creative Commons 0

- correct-maodin204.wav: 
    - **8bit coin 2** by MaoDin204. Available at (https://freesound.org/s/721807/)
    - License: Creative Commons 0

- wrong-japanyoshithegamer.wav:
    - **8-bit Uh-Oh Sound** by JapanYoshiTheGamer (https://freesound.org/s/361255/)
    - License: Creative Commons 0
