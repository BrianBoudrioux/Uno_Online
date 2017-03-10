var express = require('express');
var app = express();
var router  = express.Router();
var deck_end = [];
var couleurs = ["bleu", "vert", "jaune", "rouge"];
var cartes = [];
var hand = [];
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
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

router.get('/', function(req, res){
    res.sendFile('home.html', {root: './views'});
});
router.get('/new_game', function(req, res){
    res.sendFile('new_game.html', {root: './views'});
});
router.get('/game/:id', function(req, res){
    var nbplayers = req.params.id;
    console.log(nbplayers);
    res.render('game',{
        nbplayers: nbplayers
    })
});
router.get('/deck', function(req, res) {
    var deck = get_deck();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        deck : deck
    }, null, 3));
});
router.get('/draw_card', function(req, res) {
    var card = draw_card();
    hand.push(card);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        card : card
    }, null, 3));
});
router.get('/generate_deck', function(req, res) {
    generate_deck();
    var deck = get_deck();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        deck : deck
    }, null, 3));
});
router.get('/new_hand', function(req, res) {
    hand = [];
    for (var i = 0; i < 7; i++) {
        hand.push(draw_card());
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        hand : hand
    }, null, 3));
});
router.get('/get_hand', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        hand : hand
    }, null, 3));
});

module.exports = router;