/**
 * read    GET - Safe, Idempotent, Cachable
 * update  PUT - Idempotent
 * delete  DELETE - Idempotent
 * create  POST
 *
 * https://restfulapi.net/http-methods/
 * https://restfulapi.net/http-status-codes/
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
 * https://restfulapi.net/rest-put-vs-post/
 **/

const port = 8231;
var webSocketPort = port + 1;

const express = require('express');
const app = express();
const fs = require('fs');
const Wordle = require("./model.js");

const cookieParser = require('cookie-parser');
const WebSocketServer = require('ws').Server;

const wordsFilePath = './words.5.txt';

let sharedWordle;
let sharedWordleTarget;

let gameTimer;
let gameTimeRemaining; 

function broadcastTime(wss) {
    
	var jsonTime = {
		time: gameTimeRemaining
	};

    wss.broadcast = function (timeUpdateMessage) {
        for (let ws of this.clients) {
            ws.send(timeUpdateMessage);
        }
    };
	if (gameTimeRemaining >= 0) {
        wss.broadcast(JSON.stringify(jsonTime));
	}
}

function startMultiplayerGame(words, wss) {
    wins = 0;
    losses = 0;
    gameTimeRemaining = 300;

    var jsonGameOver = {
		gameOver: false
	};

    wss.broadcast = function (message) {
        for (let ws of this.clients) {
            ws.send(message);
        }
    };
    wss.broadcast(JSON.stringify(jsonGameOver));


    if (gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => {

        if (gameTimeRemaining >= 0 ) {
            broadcastTime(wss);
		    gameTimeRemaining--;
        } 
        if (gameTimeRemaining == -1) {
            clearInterval(gameTimer);
            endMultiplayerGame(words, wss);
        }
    }, 1000); // Update every second
}

function endMultiplayerGame(words, wss) {
    // Broadcast game end message to all clients

    var jsonGameOver = {
		gameOver: true
	};

    wss.broadcast = function (message) {
        for (let ws of this.clients) {
            ws.send(message);
        }
    };

    wss.broadcast(JSON.stringify(jsonGameOver));
}


function initializeServer(words) {
    const database = {};
    let wins = 0;
    let losses = 0;
    let clients = 0;

    // Initialize WebSocket server
    var wss = new WebSocketServer({ port: webSocketPort });
    wss.broadcast = function (message) {
        for (let ws of this.clients) {
            ws.send(message);
        }
    };

    wss.on('connection', function (ws) {
        var jsonClients = {
            clients: this.clients.size
        };
        var jsonMessage = JSON.stringify(jsonClients);
        wss.broadcast(jsonMessage);
    });

    wss.on('close', function (code, data) {

        var jsonClients = {
            clients: this.clients.size
        };
        var jsonMessage = JSON.stringify(jsonClients);
        wss.broadcast(jsonMessage);
        console.log('disconnected');
    });

    /******************************************************************************
     * middleware
     ******************************************************************************/

    app.use(express.json()); // support json encoded bodies
    app.use(express.urlencoded({ extended: true })); // support encoded bodies
    app.use(cookieParser());

    /******************************************************************************
     * routes
     ******************************************************************************/

    app.get('/cookie', function (req, res) {
        let minute = 60 * 1000;
        res.cookie(cookie_name, 'cookie_value', { maxAge: minute });
        return res.send('cookie has been set!');
    });

    app.get('/deletecookie', function (req, res) {
        res.clearCookie('cookie_name');
        res.send('Cookie deleted');
    });

    app.get('/api/username/', function (req, res) {
        let username;

        if ('username' in req.cookies) {
            username = req.cookies.username;
        } else {
            let wordle = new Wordle(words);
            username = wordle.getUsername();
            res.cookie('username', username, { HttpOnly: true });
            res.cookie('username', username, { secure: true });
        }
        res.status(200);
        res.json({ "username": username });
    });

    app.put('/api/username/:username/newgame', function (req, res) {
        let username = req.params.username;
        let isMultiplay = req.body.is_multiplay;

        if (!(username in database)) {
            let wordle = new Wordle(words);
            wordle.setUsername(username);
            database[username] = wordle;
        }

        if (isMultiplay) {
            wins = 0;
            losses = 0;
            database[username].reset();
            database[username].target = sharedWordleTarget;
            startMultiplayerGame(words, wss);
        } else {
            database[username].reset();
        }
        res.status(200);
        res.json({ "status": "created" });
    });

    app.post('/api/username/:username/guess/:guess', function (req, res) {
        let username = req.params.username;
        let guess = req.params.guess;

        if (!username in database) {
            res.status(409);
            res.json({ "error": `${username} does not have an active game` });
            return;
        }
        var data = database[username].makeGuess(guess);
        res.status(200);
        res.json(data);

        if (data.state == "won") {
            wins++;
        }
        else if (data.state == "lost") {
            losses++;
        }
        var jsonStats = {
            wins: wins,
            losses: losses,
        };
        var jsonMessage = JSON.stringify(jsonStats);
        wss.broadcast(jsonMessage);
    });

    app.listen(port, function () {
        console.log('Example app listening on port ' + port);
    });
}

/******************************************************************************
 * word routines
 ******************************************************************************/

// Read in all words, then start the server
fs.readFile(wordsFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const words = data.split("\n");
    initializeServer(words);
	sharedWordle = new Wordle(words);
	sharedWordleTarget = sharedWordle.target;
});
