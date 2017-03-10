// set variables for environment
var express = require('express');
var session = require('express-session');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var monk = require('monk');
var sess = undefined;
var couleurs = ["bleu", "vert", "jaune", "rouge"];
var cartes = [];
var hand = [];
var request = require("request");
var games = [];
var player_hand = [];
var count_game = 0;
var count_players = 0;
var tab_clients = [];
var tab_turn = {game: [], count: [], player: []};
var tab_game = {game_name: [], players: [], deck: [], hand_players: [], end_deck: [] };

app.use(function(req,res,next){
    next();
});

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 600000 }, resave: true, saveUninitialized: true }));

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */

app.use(bodyParser.json());


function generate_deck() {
    cartes = [];
    var i = 1;
    couleurs.forEach( function(element, index) {
        while (i < 10) {
            if (i === 1) {
                cartes.push(element + "_" + i);
            }
            else {
                cartes.push(element + "_" + i);
                cartes.push(element + "_" + i);
            }
            i++;
        }
        cartes.push(element + "_+2");
        cartes.push(element + "_+2");
        cartes.push(element + "_inverse");
        cartes.push(element + "_inverse");
        cartes.push(element + "_skip");
        cartes.push(element + "_skip");
        i = 1;
    });
    cartes.push("neutre_joker");
    cartes.push("neutre_joker");
    cartes.push("neutre_joker");
    cartes.push("neutre_joker");
    cartes.push("neutre_+4");
    cartes.push("neutre_+4");
    cartes.push("neutre_+4");
    cartes.push("neutre_+4");
}
generate_deck();
function get_deck() {
    return cartes;
}
function draw_card() {
    return cartes.splice(Math.random() * cartes.length | 0, 1)[0];
}
function generate_hand() {
    hand = [];
    for (var i = 0; i < 7; i++) {
        var card = draw_card();
        hand.push(card);
    }
}
function get_new_hand() {
    return hand;
}
var id_user;
var tab_users = [];
app.get('/', function(req, res){
    id_user = req.headers.cookie;
    res.sendFile('home.html', {root: './views'});
});
app.get('/show_games', function (req, res) {
    if (sess == undefined) {
        sess = req.session;
    }
    if (sess.login) {
        id_user = req.headers.cookie;
        res.render('index_games',{
            games: tab_game.game_name
        })
    }
    else {
        res.redirect('/');
    }
});
var count_users = 0;
app.get('/new_game', function(req, res){
    res.sendFile('new_game.html', {root: './views'});
});
app.post('/new_game', function(req, res){
    if (sess == undefined) {
        sess = req.session;
    }
    if (sess.login == undefined) {
        sess.login = [];
    }
    if (req.body.game_name != "" && req.body.login != "") {
        sess.currentUser = req.body.login;
        sess.login[count_users] = req.body.login;
        tab_users[req.body.login] = req.headers.cookie;
        count_users++;
        games.push(req.body.game_name);
        res.redirect('/game/'+ req.body.game_name);
    }

});
app.get('/game/:id', function(req, res){
    var nbplayers = req.params.id;
    res.render('game',{
        nbplayers: nbplayers,
        players: tab_game.players[count_game],
        players_hand: player_hand,
        deck: cartes,
        sess: sess.login
    })
});
app.get('/deck', function(req, res) {
    var deck = get_deck();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        deck : deck
    }, null, 3));
});
app.get('/draw_card', function(req, res) {
    var card = draw_card();
    hand.push(card);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        card : card
    }, null, 3));
});
app.get('/generate_deck', function(req, res) {
    generate_deck();
    var deck = get_deck();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        deck : deck
    }, null, 3));
});
app.get('/new_hand', function(req, res) {
    hand = [];
    for (var i = 0; i < 7; i++) {
        hand.push(draw_card());
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        hand : hand
    }, null, 3));
});
app.get('/get_hand', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        hand : hand
    }, null, 3));
});



function change_turn(data) {
    tab_turn.count[data.room]++;
    var count = 0;
    for (index in tab_clients[data.room]) {
        if (tab_turn.count[data.room] >= Object.keys(tab_clients[data.room]).length) {
            tab_turn.count[data.room] = 0;
        }
        if (tab_turn.count[data.room] == count) {
            tab_turn.player[data.room] = tab_clients[data.room][index];
            break;
        }
        count++;
    }
}


io.on('connection', function (socket) {
    var req = socket.request;
    socket.on('msg_perso', function (data) {
        socket.join(data.room);
        if (sess != undefined) {
            if (tab_game.players[data.room] == undefined) {
                tab_game.players[data.room] = [];
            }
            for (var indice in sess.login) {
                var check = false;
                if (tab_game.players[data.room].indexOf(sess.login[indice]) == -1) {
                    for (var ii in tab_game.players) {
                        if (tab_game.players[ii].indexOf(sess.login[indice]) >= 0) {
                            check = true
                        }
                    }
                    if (check === false) {
                        tab_game.players[data.room].push(sess.login[indice]);
                        count_players++;
                    }
                }
                io.sockets.in(data.room).emit('get_players', {players: tab_game.players[data.room]});
            }
        }
        if (tab_game.game_name[data.room] == undefined) {
            tab_game.game_name[data.room] = data.room;
            count_game++;
        }
        if (tab_clients[data.room] == undefined) {
            tab_clients[data.room] = [];
        }
        //var clients = io.sockets.clients('room');
        for (var cle in tab_users) {
            if (tab_users[cle] == req.headers.cookie) {
                tab_clients[data.room][cle] = socket.id;
            }
        }
    });
    socket.on('game_start', function (data) {
        if (tab_game.deck[data.room] == undefined) {
            generate_deck();
            tab_game.deck[data.room] = get_deck();
            if (tab_game.hand_players[data.room] == undefined) {
                tab_game.hand_players[data.room] = {};
            }
            for (var key in tab_game.players[data.room]) {
                if (tab_game.hand_players[data.room][tab_game.players[data.room][key]] == undefined) {
                    generate_hand();
                    tab_game.hand_players[data.room][tab_game.players[data.room][key]] = hand.toString();
                }
            }
            var current = req.headers.cookie;
            for (var index in tab_clients[data.room]) {
                for ( key in tab_game.hand_players[data.room]) {
                    if (key == index) {
                        var my_hand = tab_game.hand_players[data.room][key].split(",");
                        io.sockets.to(tab_clients[data.room][index]).emit('send_hand', {hand: my_hand});
                    }
                }
            }
            if (tab_turn.game[data.room] == undefined) {
                tab_turn.game[data.room] = data.room;
            }
            if (tab_turn.count[data.room] == undefined) {
                tab_turn.count[data.room] = 0;
            }
            if (tab_turn.player[data.room] == undefined) {
                var count = 0;
                for (index in tab_clients[data.room]) {
                    if (tab_turn.count[data.room] == count) {
                        tab_turn.player[data.room] = tab_clients[data.room][index];
                    }
                    count++;
                }
            }
            for (var i in tab_clients[data.room]) {
                if (tab_clients[data.room][i] == tab_turn.player[data.room]) {
                    io.sockets.in(data.room).emit('change_player', {player: i});
                }
            }
            io.sockets.in(data.room).emit('quit_button', {player: i});
            delete tab_game.game_name[data.room];
        }
    });
    socket.on('play_card', function (data) {
        var card_tired = 0;
        if (socket.id == tab_turn.player[data.room]) {
            for (var key in tab_clients[data.room]) {
                if (tab_clients[data.room][key] == data.player) {
                    var user = key;
                    for (var cle in tab_game.hand_players[data.room]) {
                        if (cle == user) {
                            var hand = tab_game.hand_players[data.room][cle].split(',');
                            if (hand.indexOf(data.card) >= 0) {
                                var index = hand.indexOf(data.card);
                                hand.splice(index, 1);
                                hand = hand.join();
                                var card_cut = data.card.split("_");
                                var start = card_cut[0];
                                var end = card_cut[1];
                                if (tab_game.end_deck[data.room] == undefined) {
                                    tab_game.end_deck[data.room] = [];
                                    tab_game.hand_players[data.room][cle] = hand;
                                    tab_game.end_deck[data.room].unshift(data.card);
                                    io.sockets.to(socket.id).emit('card_used', {
                                        hand: hand,
                                        card: data.card,
                                        deck_end: tab_game.end_deck[data.room]
                                    });
                                    io.sockets.in(data.room).emit('new_deck_end', {
                                        card: data.card,
                                        deck_end: tab_game.end_deck[data.room]
                                    });
                                    if (end == '+2') {
                                        for (var f in tab_clients[data.room]) {
                                            if (tab_clients[data.room][f] != data.player) {
                                                var us = f;
                                                for (var jj in tab_game.hand_players[data.room]) {
                                                    if (jj == us) {
                                                        var hand = tab_game.hand_players[data.room][jj].split(',');
                                                        for (var c = 0; c < 2; c++) {
                                                            var new_card = tab_game.deck[data.room].splice(Math.random() * tab_game.deck[data.room].length | 0, 1)[0];
                                                            hand.push(new_card);
                                                        }
                                                        tab_game.hand_players[data.room][jj] = hand.toString();
                                                        io.sockets.to(tab_clients[data.room][us]).emit('card_used', {hand: tab_game.hand_players[data.room][jj]});
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else if (data.card == 'neutre_+4') {
                                        for (var f in tab_clients[data.room]) {
                                            if (tab_clients[data.room][f] != data.player) {
                                                var us = f;
                                                for (var jj in tab_game.hand_players[data.room]) {
                                                    if (jj == us) {
                                                        var hand = tab_game.hand_players[data.room][jj].split(',');
                                                        for (var c = 0; c < 4; c++) {
                                                            var new_card = tab_game.deck[data.room].splice(Math.random() * tab_game.deck[data.room].length | 0, 1)[0];
                                                            hand.push(new_card);
                                                        }
                                                        tab_game.hand_players[data.room][jj] = hand.toString();
                                                        io.sockets.to(tab_clients[data.room][us]).emit('card_used', {hand: tab_game.hand_players[data.room][jj]});
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else if (end == "skip") {
                                        change_turn(data);
                                    }
                                    else if (end == "inverse") {
                                        var arr = [];
                                        for (var index in tab_clients[data.room]) {
                                            arr.unshift(index);
                                        }
                                        var new_tab = [];
                                        for (var i in arr) {
                                            for (var index in tab_clients[data.room]) {
                                                if (index == arr[i]) {
                                                    new_tab[index] = tab_clients[data.room][index];
                                                }
                                            }
                                        }
                                        tab_clients[data.room] = new_tab;
                                    }
                                    change_turn(data);
                                    for (var i in tab_clients[data.room]) {
                                        if (tab_clients[data.room][i] == tab_turn.player[data.room]) {
                                            io.sockets.in(data.room).emit('change_player', {player: i});
                                        }
                                    }
                                    io.sockets.in(data.room).emit('card_players', {card_players: tab_game.hand_players[data.room]});
                                    break;
                                }
                                else {
                                    var end_deck = tab_game.end_deck[data.room][0];
                                    var card_cut = data.card.split("_");
                                    var start = card_cut[0];
                                    var end = card_cut[1];
                                    if (end_deck.indexOf(start) >= 0) {
                                        tab_game.hand_players[data.room][cle] = hand;
                                        tab_game.end_deck[data.room].unshift(data.card);
                                        io.sockets.to(socket.id).emit('card_used', {
                                            hand: hand,
                                            card: data.card,
                                            deck_end: tab_game.end_deck[data.room]
                                        });
                                        io.sockets.in(data.room).emit('new_deck_end', {
                                            card: data.card,
                                            deck_end: tab_game.end_deck[data.room]
                                        });
                                        if (end == '+2') {
                                            for (var f in tab_clients[data.room]) {
                                                if (tab_clients[data.room][f] != data.player) {
                                                    var us = f;
                                                    for (var jj in tab_game.hand_players[data.room]) {
                                                        if (jj == us) {
                                                            var hand = tab_game.hand_players[data.room][jj].split(',');
                                                            for (var c = 0; c < 2; c++) {
                                                                var new_card = tab_game.deck[data.room].splice(Math.random() * tab_game.deck[data.room].length | 0, 1)[0];
                                                                hand.push(new_card);
                                                            }
                                                            tab_game.hand_players[data.room][jj] = hand.toString();
                                                            io.sockets.to(tab_clients[data.room][us]).emit('card_used', {hand: tab_game.hand_players[data.room][jj]});
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else if (data.card == 'neutre_+4') {
                                            for (var cle_client in tab_clients[data.room]) {
                                                if (tab_clients[data.room][cle_client] != data.player) {
                                                    var us = cle_client;
                                                    for (var key_hand in tab_game.hand_players[data.room]) {
                                                        if (key_hand == us) {
                                                            var hand = tab_game.hand_players[data.room][key_hand].split(',');
                                                            for (var c = 0; c < 4; c++) {
                                                                var new_card = tab_game.deck[data.room].splice(Math.random() * tab_game.deck[data.room].length | 0, 1)[0];
                                                                hand.push(new_card);
                                                            }
                                                            tab_game.hand_players[data.room][key_hand] = hand.toString();
                                                            io.sockets.to(tab_clients[data.room][us]).emit('card_used', {hand: tab_game.hand_players[data.room][key_hand]});
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else if (end == "skip") {
                                            change_turn(data);
                                        }
                                        else if (end == "inverse") {
                                            var arr = [];
                                            for (var index in tab_clients[data.room]) {
                                                arr.unshift(index);
                                            }
                                            var new_tab = [];
                                            for (var i in arr) {
                                                for (var index in tab_clients[data.room]) {
                                                    if (index == arr[i]) {
                                                        new_tab[index] = tab_clients[data.room][index];
                                                    }
                                                }
                                            }
                                            tab_clients[data.room] = new_tab;
                                        }
                                        change_turn(data);
                                        for (var i in tab_clients[data.room]) {
                                            if (tab_clients[data.room][i] == tab_turn.player[data.room]) {
                                                io.sockets.in(data.room).emit('change_player', {player: i});
                                            }
                                        }
                                        io.sockets.in(data.room).emit('card_players', {card_players: tab_game.hand_players[data.room]});
                                        break;
                                    }
                                    else if (end_deck.indexOf(end) >= 0) {
                                        tab_game.hand_players[data.room][cle] = hand;
                                        tab_game.end_deck[data.room].unshift(data.card);
                                        io.sockets.to(socket.id).emit('card_used', {
                                            hand: hand,
                                            card: data.card,
                                            deck_end: tab_game.end_deck[data.room]
                                        });
                                        io.sockets.in(data.room).emit('new_deck_end', {
                                            card: data.card,
                                            deck_end: tab_game.end_deck[data.room]
                                        });
                                        if (end == '+2') {
                                            for (var f in tab_clients[data.room]) {
                                                if (tab_clients[data.room][f] != data.player) {
                                                    var us = f;
                                                    for (var jj in tab_game.hand_players[data.room]) {
                                                        if (jj == us) {
                                                            var hand = tab_game.hand_players[data.room][jj].split(',');
                                                            for (var c = 0; c < 2; c++) {
                                                                var new_card = tab_game.deck[data.room].splice(Math.random() * tab_game.deck[data.room].length | 0, 1)[0];
                                                                hand.push(new_card);
                                                            }
                                                            tab_game.hand_players[data.room][jj] = hand.toString();
                                                            io.sockets.to(tab_clients[data.room][us]).emit('card_used', {hand: tab_game.hand_players[data.room][jj]});
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else if (data.card == 'neutre_+4') {
                                            for (var c_client in tab_clients[data.room]) {
                                                if (tab_clients[data.room][c_client] != data.player) {
                                                    var us = c_client;
                                                    for (var k_hand in tab_game.hand_players[data.room]) {
                                                        if (k_hand == us) {
                                                            var hand = tab_game.hand_players[data.room][k_hand].split(',');
                                                            for (var c = 0; c < 4; c++) {
                                                                var new_card = tab_game.deck[data.room].splice(Math.random() * tab_game.deck[data.room].length | 0, 1)[0];
                                                                hand.push(new_card);
                                                            }
                                                            tab_game.hand_players[data.room][k_hand] = hand.toString();
                                                            io.sockets.to(tab_clients[data.room][us]).emit('card_used', {hand: tab_game.hand_players[data.room][k_hand]});
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else if (end == "skip") {
                                            change_turn(data);
                                        }
                                        else if (end == "inverse") {
                                            var arr = [];
                                            for (var index in tab_clients[data.room]) {
                                                arr.unshift(index);
                                            }
                                            var new_tab = [];
                                            for (var i in arr) {
                                                for (var index in tab_clients[data.room]) {
                                                    if (index == arr[i]) {
                                                        new_tab[index] = tab_clients[data.room][index];
                                                    }
                                                }
                                            }
                                            tab_clients[data.room] = new_tab;
                                        }
                                        change_turn(data);
                                        for (var i in tab_clients[data.room]) {
                                            if (tab_clients[data.room][i] == tab_turn.player[data.room]) {
                                                io.sockets.in(data.room).emit('change_player', {player: i});
                                            }
                                        }
                                        io.sockets.in(data.room).emit('card_players', {card_players: tab_game.hand_players[data.room]});
                                        break;
                                    }
                                    else if (end_deck == 'neutre_joker') {
                                        tab_game.hand_players[data.room][cle] = hand;
                                        tab_game.end_deck[data.room].unshift(data.card);
                                        io.sockets.to(socket.id).emit('card_used', {
                                            hand: hand,
                                            card: data.card,
                                            deck_end: tab_game.end_deck[data.room]
                                        });
                                        io.sockets.in(data.room).emit('new_deck_end', {
                                            card: data.card,
                                            deck_end: tab_game.end_deck[data.room]
                                        });
                                        if (end == '+2') {
                                            for (var f in tab_clients[data.room]) {
                                                if (tab_clients[data.room][f] != data.player) {
                                                    var us = f;
                                                    for (var jj in tab_game.hand_players[data.room]) {
                                                        if (jj == us) {
                                                            var hand = tab_game.hand_players[data.room][jj].split(',');
                                                            for (var c = 0; c < 2; c++) {
                                                                var new_card = tab_game.deck[data.room].splice(Math.random() * tab_game.deck[data.room].length | 0, 1)[0];
                                                                hand.push(new_card);
                                                            }
                                                            tab_game.hand_players[data.room][jj] = hand.toString();
                                                            io.sockets.to(tab_clients[data.room][us]).emit('card_used', {hand: tab_game.hand_players[data.room][jj]});
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else if (data.card == 'neutre_+4') {
                                            for (var kee in tab_clients[data.room]) {
                                                if (tab_clients[data.room][kee] != data.player) {
                                                    var us = kee;
                                                    for (var ccl in tab_game.hand_players[data.room]) {
                                                        if (ccl == us) {
                                                            var hand = tab_game.hand_players[data.room][ccl].split(',');
                                                            for (var c = 0; c < 4; c++) {
                                                                var new_card = tab_game.deck[data.room].splice(Math.random() * tab_game.deck[data.room].length | 0, 1)[0];
                                                                hand.push(new_card);
                                                            }
                                                            tab_game.hand_players[data.room][ccl] = hand.toString();
                                                            io.sockets.to(tab_clients[data.room][us]).emit('card_used', {hand: tab_game.hand_players[data.room][ccl]});
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else if (end == "skip") {
                                            change_turn(data);
                                        }
                                        else if (end == "inverse") {
                                            var arr = [];
                                            for (var index in tab_clients[data.room]) {
                                                arr.unshift(index);
                                            }
                                            var new_tab = [];
                                            for (var i in arr) {
                                                for (var index in tab_clients[data.room]) {
                                                    if (index == arr[i]) {
                                                        new_tab[index] = tab_clients[data.room][index];
                                                    }
                                                }
                                            }
                                            tab_clients[data.room] = new_tab;
                                        }
                                        change_turn(data);
                                        for (var i in tab_clients[data.room]) {
                                            if (tab_clients[data.room][i] == tab_turn.player[data.room]) {
                                                io.sockets.in(data.room).emit('change_player', {player: i});
                                            }
                                        }
                                        io.sockets.in(data.room).emit('card_players', {card_players: tab_game.hand_players[data.room]});
                                        break;
                                    }
                                    else if (end_deck == 'neutre_+4') {
                                        tab_game.hand_players[data.room][cle] = hand;
                                        tab_game.end_deck[data.room].unshift(data.card);
                                        io.sockets.to(socket.id).emit('card_used', {
                                            hand: hand,
                                            card: data.card,
                                            deck_end: tab_game.end_deck[data.room]
                                        });
                                        io.sockets.in(data.room).emit('new_deck_end', {
                                            card: data.card,
                                            deck_end: tab_game.end_deck[data.room]
                                        });
                                        if (end == '+2') {
                                            for (var f in tab_clients[data.room]) {
                                                if (tab_clients[data.room][f] != data.player) {
                                                    var us = f;
                                                    for (var jj in tab_game.hand_players[data.room]) {
                                                        if (jj == us) {
                                                            var hand = tab_game.hand_players[data.room][jj].split(',');
                                                            for (var c = 0; c < 2; c++) {
                                                                var new_card = tab_game.deck[data.room].splice(Math.random() * tab_game.deck[data.room].length | 0, 1)[0];
                                                                hand.push(new_card);
                                                            }
                                                            tab_game.hand_players[data.room][jj] = hand.toString();
                                                            io.sockets.to(tab_clients[data.room][us]).emit('card_used', {hand: tab_game.hand_players[data.room][jj]});
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else if (data.card == 'neutre_+4') {
                                            for (var keyy in tab_clients[data.room]) {
                                                if (tab_clients[data.room][keyy] != data.player) {
                                                    var us = keyy;
                                                    for (var clee in tab_game.hand_players[data.room]) {
                                                        if (clee == us) {
                                                            var hand = tab_game.hand_players[data.room][clee].split(',');
                                                            for (var c = 0; c < 4; c++) {
                                                                var new_card = tab_game.deck[data.room].splice(Math.random() * tab_game.deck[data.room].length | 0, 1)[0];
                                                                hand.push(new_card);
                                                            }
                                                            tab_game.hand_players[data.room][clee] = hand.toString();
                                                            io.sockets.to(tab_clients[data.room][us]).emit('card_used', {hand: tab_game.hand_players[data.room][clee]});
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else if (end == "skip") {
                                            change_turn(data);
                                        }
                                        else if (end == "inverse") {
                                            var arr = [];
                                            for (var index in tab_clients[data.room]) {
                                                arr.unshift(index);
                                            }
                                            var new_tab = [];
                                            for (var i in arr) {
                                                for (var index in tab_clients[data.room]) {
                                                    if (index == arr[i]) {
                                                        new_tab[index] = tab_clients[data.room][index];
                                                    }
                                                }
                                            }
                                            tab_clients[data.room] = new_tab;
                                        }
                                        change_turn(data);
                                        for (var i in tab_clients[data.room]) {
                                            if (tab_clients[data.room][i] == tab_turn.player[data.room]) {
                                                io.sockets.in(data.room).emit('change_player', {player: i});
                                            }
                                        }
                                        io.sockets.in(data.room).emit('card_players', {card_players: tab_game.hand_players[data.room]});
                                        break;
                                    }
                                    else if (data.card == 'neutre_joker') {
                                        tab_game.hand_players[data.room][cle] = hand;
                                        tab_game.end_deck[data.room].unshift(data.card);
                                        io.sockets.to(socket.id).emit('card_used', {
                                            hand: hand,
                                            card: data.card,
                                            deck_end: tab_game.end_deck[data.room]
                                        });
                                        io.sockets.in(data.room).emit('new_deck_end', {
                                            card: data.card,
                                            deck_end: tab_game.end_deck[data.room]
                                        });
                                        change_turn(data);
                                        for (var i in tab_clients[data.room]) {
                                            if (tab_clients[data.room][i] == tab_turn.player[data.room]) {
                                                io.sockets.in(data.room).emit('change_player', {player: i});
                                            }
                                        }
                                        io.sockets.in(data.room).emit('card_players', {card_players: tab_game.hand_players[data.room]});
                                        break;
                                    }
                                    else if (data.card == 'neutre_+4') {
                                        tab_game.hand_players[data.room][cle] = hand;
                                        tab_game.end_deck[data.room].unshift(data.card);
                                        io.sockets.to(socket.id).emit('card_used', {
                                            hand: hand,
                                            card: data.card,
                                            deck_end: tab_game.end_deck[data.room]
                                        });
                                        io.sockets.in(data.room).emit('new_deck_end', {
                                            card: data.card,
                                            deck_end: tab_game.end_deck[data.room]
                                        });
                                        for (var kk in tab_clients[data.room]) {
                                            if (tab_clients[data.room][kk] != data.player) {
                                                var us = kk;
                                                for (var cc in tab_game.hand_players[data.room]) {
                                                    if (cc == us) {
                                                        var hand = tab_game.hand_players[data.room][cc].split(',');
                                                        for (var c = 0; c < 4; c++) {
                                                            var new_card = tab_game.deck[data.room].splice(Math.random() * tab_game.deck[data.room].length | 0, 1)[0];
                                                            hand.push(new_card);
                                                        }
                                                        tab_game.hand_players[data.room][cc] = hand.toString();
                                                        io.sockets.to(tab_clients[data.room][us]).emit('card_used', {hand: tab_game.hand_players[data.room][cc]});
                                                    }
                                                }
                                            }
                                        }
                                        change_turn(data);
                                        for (var i in tab_clients[data.room]) {
                                            if (tab_clients[data.room][i] == tab_turn.player[data.room]) {
                                                io.sockets.in(data.room).emit('change_player', {player: i});
                                            }
                                        }
                                        io.sockets.in(data.room).emit('card_players', {card_players: tab_game.hand_players[data.room]});
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    });
    socket.on('pioche_card', function (data) {
        if (socket.id == tab_turn.player[data.room]) {
            if (tab_game.deck[data.room].length == 0) {
                if (tab_game.end_deck[data.room] != undefined) {
                    for (var index in tab_game.end_deck[data.room]) {
                        if (index != 0) {
                            tab_game.deck[data.room].push(tab_game.end_deck[data.room][index]);
                            delete tab_game.end_deck[data.room][index];
                        }
                    }
                }
            }
            for (var key in tab_clients[data.room]) {
                if (tab_clients[data.room][key] == data.player) {
                    var user = key;
                    for (var cle in tab_game.hand_players[data.room]) {
                        if (cle == user) {
                            var hand = tab_game.hand_players[data.room][cle].split(',');
                            var new_card = tab_game.deck[data.room].splice(Math.random() * tab_game.deck[data.room].length | 0, 1)[0];
                            hand.push(new_card);
                            tab_game.hand_players[data.room][cle] = hand.toString();
                            io.sockets.to(tab_clients[data.room][user]).emit('card_used', {hand: tab_game.hand_players[data.room][cle]});
                            change_turn(data);
                            for (var i in tab_clients[data.room]) {
                                if (tab_clients[data.room][i] == tab_turn.player[data.room]) {
                                    io.sockets.in(data.room).emit('change_player', {player: i});
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
    });
    socket.on('quit_game', function (data) {
        for (var cle in tab_clients[data.room]) {
            if (tab_clients[data.room][cle] == data.player) {
                for (var key in tab_game.hand_players[data.room]) {
                    if (cle == key) {
                        var username = cle;
                        var tab_hand = tab_game.hand_players[data.room][key].split(",");
                        for (var k in tab_hand) {
                            if (tab_game.end_deck[data.room] == undefined) {
                                tab_game.end_deck[data.room] = [];
                            }
                            tab_game.end_deck[data.room].push(tab_hand[k]);
                        }
                        delete tab_clients[data.room][cle];
                        delete tab_game.hand_players[data.room][key];
                        var check = false;
                        if (Object.keys(tab_game.hand_players[data.room]).length == 0) {
                            delete tab_game.game_name[data.room];
                            delete tab_game.deck[data.room];
                            delete tab_game.end_deck[data.room];
                            delete tab_game.hand_players[data.room];
                            delete tab_game.players[data.room];
                            delete tab_turn.player[data.room];
                            delete tab_turn.game[data.room];
                            delete tab_turn.count[data.room];
                            check = true;
                        }
                        io.sockets.to(data.player).emit('leaving_game', {});
                        var tab = [];
                        for (var t in tab_clients[data.room]) {
                            tab.push(t);
                        }
                        io.sockets.in(data.room).emit('leaving_player', {players: tab});
                        if (sess != undefined) {
                            for (var s in sess.login) {
                                if (sess.login[s] == username) {
                                    delete sess.login[s];
                                }
                            }
                        }
                        if (check === false) {
                            change_turn(data);
                        }
                    }
                }
            }
        }
    });
    socket.on('game_finish', function (data) {
        for (var cle in tab_clients[data.room]) {
            if (tab_clients[data.room][cle] == data.player) {
                for (var key in tab_game.hand_players[data.room]) {
                    if (cle == key) {
                        var username = cle;
                        var tab_hand = tab_game.hand_players[data.room][key].split(",");
                        for (var k in tab_hand) {
                            if (tab_game.end_deck[data.room] == undefined) {
                                tab_game.end_deck[data.room] = [];
                            }
                            tab_game.end_deck[data.room].push(tab_hand[k]);
                        }
                        delete tab_clients[data.room][cle];
                        delete tab_game.hand_players[data.room][key];
                        if (Object.keys(tab_game.hand_players[data.room]).length <= 0) {
                            delete tab_game.game_name[data.room];
                            delete tab_game.deck[data.room];
                            delete tab_game.end_deck[data.room];
                            delete tab_game.hand_players[data.room];
                            delete tab_game.players[data.room];
                        }
                        var tab = [];
                        for (var t in tab_clients[data.room]) {
                            tab.push(t);
                        }
                        if (sess != undefined) {
                            for (var s in sess.login) {
                                if (sess.login[s] == username) {
                                    delete sess.login[s];
                                }
                            }
                        }
                        delete tab_turn.player[data.room];
                        delete tab_turn.game[data.room];
                        delete tab_turn.count[data.room];
                        io.sockets.in(data.room).emit('game_over', {winner: username});
                    }
                }
            }
        }
    });

});


// Set server port
http.listen(3000);
console.log('server is running');
