$(document).ready(function () {
    var socket = io();
    socket.emit('msg_perso', {room: $(".title")[0].innerText});
    socket.on('get_players', function (data) {
        $("#block_players").html("");
        for (var indice in data.players) {
            $("#block_players").append("<div class='players_name'>" + data.players[indice] + "</div>");
        }
    });
    $("#bottom_right").click(function () {
        socket.emit('game_start', {room: $(".title")[0].innerText});
    });
    function end_deck(card) {
        var tab = card.split("_");
        if (tab[0] == 'rouge') {
            switch(tab[1]){
                case '1': $("#deck_end").append("<button id='red1' class='card_deck' value='" + card + "'></button>");
                    break;
                case '2': $("#deck_end").append("<button id='red2' class='card_deck' value='" + card + "'></button>");
                    break;
                case '3': $("#deck_end").append("<button id='red3' class='card_deck' value='" + card + "'></button>");
                    break;
                case '4': $("#deck_end").append("<button id='red4' class='card_deck' value='" + card + "'></button>");
                    break;
                case '5': $("#deck_end").append("<button id='red5' class='card_deck' value='" + card + "'></button>");
                    break;
                case '6': $("#deck_end").append("<button id='red6' class='card_deck' value='" + card + "'></button>");
                    break;
                case '7': $("#deck_end").append("<button id='red7' class='card_deck' value='" + card + "'></button>");
                    break;
                case '8': $("#deck_end").append("<button id='red8' class='card_deck' value='" + card + "'></button>");
                    break;
                case '9': $("#deck_end").append("<button id='red9' class='card_deck' value='" + card + "'></button>");
                    break;
                case '0': $("#deck_end").append("<button id='red0' class='card_deck' value='" + card + "'></button>");
                    break;
                case 'inverse': $("#deck_end").append("<button id='red_inverse' class='card_deck' value='" + card + "'></button>");
                    break;
                case 'skip': $("#deck_end").append("<button id='red_skip' class='card_deck' value='" + card + "'></button>");
                    break;
                case '+2': $("#deck_end").append("<button id='red_2' class='card_deck' value='" + card + "'></button>");
                    break;

                    break;
            }
        }
        else if (tab[0] == 'vert') {
            switch(tab[1]){
                case '1': $("#deck_end").append("<button id='green1' class='card_deck' value='" + card + "'></button>");
                    break;
                case '2': $("#deck_end").append("<button id='green2' class='card_deck' value='" + card + "'></button>");
                    break;
                case '3': $("#deck_end").append("<button id='green3' class='card_deck' value='" + card + "'></button>");
                    break;
                case '4': $("#deck_end").append("<button id='green4' class='card_deck' value='" + card + "'></button>");
                    break;
                case '5': $("#deck_end").append("<button id='green5' class='card_deck' value='" + card + "'></button>");
                    break;
                case '6': $("#deck_end").append("<button id='green6' class='card_deck' value='" + card + "'></button>");
                    break;
                case '7': $("#deck_end").append("<button id='green7' class='card_deck' value='" + card + "'></button>");
                    break;
                case '8': $("#deck_end").append("<button id='green8' class='card_deck' value='" + card + "'></button>");
                    break;
                case '9': $("#deck_end").append("<button id='green9' class='card_deck' value='" + card + "'></button>");
                    break;
                case '0': $("#deck_end").append("<button id='green0' class='card_deck' value='" + card + "'></button>");
                    break;
                case 'inverse': $("#deck_end").append("<button id='green_inverse' class='card_deck' value='" + card + "'></button>");
                    break;
                case 'skip': $("#deck_end").append("<button id='green_skip' class='card_deck' value='" + card + "'></button>");
                    break;
                case '+2': $("#deck_end").append("<button id='green_2' class='card_deck' value='" + card + "'></button>");
                    break;


            }
        }
        else if (tab[0] == 'jaune') {
            switch (tab[1]) {
                case '1':
                    $("#deck_end").append("<button id='yellow1' class='card_deck' value='" + card + "'></button>");
                    break;
                case '2':
                    $("#deck_end").append("<button id='yellow2' class='card_deck' value='" + card + "'></button>");
                    break;
                case '3':
                    $("#deck_end").append("<button id='yellow3' class='card_deck' value='" + card + "'></button>");
                    break;
                case '4':
                    $("#deck_end").append("<button id='yellow4' class='card_deck' value='" + card + "'></button>");
                    break;
                case '5':
                    $("#deck_end").append("<button id='yellow5' class='card_deck' value='" + card + "'></button>");
                    break;
                case '6':
                    $("#deck_end").append("<button id='yellow6' class='card_deck' value='" + card + "'></button>");
                    break;
                case '7':
                    $("#deck_end").append("<button id='yellow7' class='card_deck' value='" + card + "'></button>");
                    break;
                case '8':
                    $("#deck_end").append("<button id='yellow8' class='card_deck' value='" + card + "'></button>");
                    break;
                case '9':
                    $("#deck_end").append("<button id='yellow9' class='card_deck' value='" + card + "'></button>");
                    break;
                case '0':
                    $("#deck_end").append("<button id='yellow0' class='card_deck' value='" + card + "'></button>");
                    break;
                case 'inverse':
                    $("#deck_end").append("<button id='yellow_inverse' class='card_deck' value='" + card + "'></button>");
                    break;
                case 'skip':
                    $("#deck_end").append("<button id='yellow_skip' class='card_deck' value='" + card + "'></button>");
                    break;
                case '+2':
                    $("#deck_end").append("<button id='yellow_2' class='card_deck' value='" + card + "'></button>");
                    break;


            }
        }
        else if (tab[0] == 'bleu') {
            switch (tab[1]) {
                case '1':
                    $("#deck_end").append("<button id='blue1' class='card_deck' value='" + card + "'></button>");
                    break;
                case '2':
                    $("#deck_end").append("<button id='blue2' class='card_deck' value='" + card + "'></button>");
                    break;
                case '3':
                    $("#deck_end").append("<button id='blue3' class='card_deck' value='" + card + "'></button>");
                    break;
                case '4':
                    $("#deck_end").append("<button id='blue4' class='card_deck' value='" + card + "'></button>");
                    break;
                case '5':
                    $("#deck_end").append("<button id='blue5' class='card_deck' value='" + card + "'></button>");
                    break;
                case '6':
                    $("#deck_end").append("<button id='blue6' class='card_deck' value='" + card + "'></button>");
                    break;
                case '7':
                    $("#deck_end").append("<button id='blue7' class='card_deck' value='" + card + "'></button>");
                    break;
                case '8':
                    $("#deck_end").append("<button id='blue8' class='card_deck' value='" + card + "'></button>");
                    break;
                case '9':
                    $("#deck_end").append("<button id='blue9' class='card_deck' value='" + card + "'></button>");
                    break;
                case '0':
                    $("#deck_end").append("<button id='blue0' class='card_deck' value='" + card + "'></button>");
                    break;
                case 'inverse':
                    $("#deck_end").append("<button id='blue_inverse' class='card_deck' value='" + card + "'></button>");
                    break;
                case 'skip':
                    $("#deck_end").append("<button id='blue_skip' class='card_deck' value='" + card + "'></button>");
                    break;
                case '+2':
                    $("#deck_end").append("<button id='blue_2' class='card_deck' value='" + card + "'></button>");
                    break;


            }
        }
        else if (tab[0] == 'neutre') {
            switch (tab[1]) {
                case 'joker':
                    $("#deck_end").append("<button id='joker' class='card_deck' value='" + card + "'></button>");
                    break;
                case '+4':
                    $("#deck_end").append("<button id='neutre_4' class='card_deck' value='" + card + "'></button>");
                    break;
            }
        }
    }
    function generate_card(card) {
        var tab = card.split("_");
        if (tab[0] == 'rouge') {
            switch(tab[1]){
                case '1': $("#card_container").append("<button id='red1' class='card' value='" + card + "'></button>");
                    break;
                case '2': $("#card_container").append("<button id='red2' class='card' value='" + card + "'></button>");
                    break;
                case '3': $("#card_container").append("<button id='red3' class='card' value='" + card + "'></button>");
                    break;
                case '4': $("#card_container").append("<button id='red4' class='card' value='" + card + "'></button>");
                    break;
                case '5': $("#card_container").append("<button id='red5' class='card' value='" + card + "'></button>");
                    break;
                case '6': $("#card_container").append("<button id='red6' class='card' value='" + card + "'></button>");
                    break;
                case '7': $("#card_container").append("<button id='red7' class='card' value='" + card + "'></button>");
                    break;
                case '8': $("#card_container").append("<button id='red8' class='card' value='" + card + "'></button>");
                    break;
                case '9': $("#card_container").append("<button id='red9' class='card' value='" + card + "'></button>");
                    break;
                case '0': $("#card_container").append("<button id='red0' class='card' value='" + card + "'></button>");
                    break;
                case 'inverse': $("#card_container").append("<button id='red_inverse' class='card' value='" + card + "'></button>");
                    break;
                case 'skip': $("#card_container").append("<button id='red_skip' class='card' value='" + card + "'></button>");
                    break;
                case '+2': $("#card_container").append("<button id='red_2' class='card' value='" + card + "'></button>");
                    break;

                    break;
            }
        }
        else if (tab[0] == 'vert') {
            switch(tab[1]){
                case '1': $("#card_container").append("<button id='green1' class='card' value='" + card + "'></button>");
                    break;
                case '2': $("#card_container").append("<button id='green2' class='card' value='" + card + "'></button>");
                    break;
                case '3': $("#card_container").append("<button id='green3' class='card' value='" + card + "'></button>");
                    break;
                case '4': $("#card_container").append("<button id='green4' class='card' value='" + card + "'></button>");
                    break;
                case '5': $("#card_container").append("<button id='green5' class='card' value='" + card + "'></button>");
                    break;
                case '6': $("#card_container").append("<button id='green6' class='card' value='" + card + "'></button>");
                    break;
                case '7': $("#card_container").append("<button id='green7' class='card' value='" + card + "'></button>");
                    break;
                case '8': $("#card_container").append("<button id='green8' class='card' value='" + card + "'></button>");
                    break;
                case '9': $("#card_container").append("<button id='green9' class='card' value='" + card + "'></button>");
                    break;
                case '0': $("#card_container").append("<button id='green0' class='card' value='" + card + "'></button>");
                    break;
                case 'inverse': $("#card_container").append("<button id='green_inverse' class='card' value='" + card + "'></button>");
                    break;
                case 'skip': $("#card_container").append("<button id='green_skip' class='card' value='" + card + "'></button>");
                    break;
                case '+2': $("#card_container").append("<button id='green_2' class='card' value='" + card + "'></button>");
                    break;


            }
        }
        else if (tab[0] == 'jaune') {
            switch (tab[1]) {
                case '1':
                    $("#card_container").append("<button id='yellow1' class='card' value='" + card + "'></button>");
                    break;
                case '2':
                    $("#card_container").append("<button id='yellow2' class='card' value='" + card + "'></button>");
                    break;
                case '3':
                    $("#card_container").append("<button id='yellow3' class='card' value='" + card + "'></button>");
                    break;
                case '4':
                    $("#card_container").append("<button id='yellow4' class='card' value='" + card + "'></button>");
                    break;
                case '5':
                    $("#card_container").append("<button id='yellow5' class='card' value='" + card + "'></button>");
                    break;
                case '6':
                    $("#card_container").append("<button id='yellow6' class='card' value='" + card + "'></button>");
                    break;
                case '7':
                    $("#card_container").append("<button id='yellow7' class='card' value='" + card + "'></button>");
                    break;
                case '8':
                    $("#card_container").append("<button id='yellow8' class='card' value='" + card + "'></button>");
                    break;
                case '9':
                    $("#card_container").append("<button id='yellow9' class='card' value='" + card + "'></button>");
                    break;
                case '0':
                    $("#card_container").append("<button id='yellow0' class='card' value='" + card + "'></button>");
                    break;
                case 'inverse':
                    $("#card_container").append("<button id='yellow_inverse' class='card' value='" + card + "'></button>");
                    break;
                case 'skip':
                    $("#card_container").append("<button id='yellow_skip' class='card' value='" + card + "'></button>");
                    break;
                case '+2':
                    $("#card_container").append("<button id='yellow_2' class='card' value='" + card + "'></button>");
                    break;


            }
        }
        else if (tab[0] == 'bleu') {
            switch (tab[1]) {
                case '1':
                    $("#card_container").append("<button id='blue1' class='card' value='" + card + "'></button>");
                    break;
                case '2':
                    $("#card_container").append("<button id='blue2' class='card' value='" + card + "'></button>");
                    break;
                case '3':
                    $("#card_container").append("<button id='blue3' class='card' value='" + card + "'></button>");
                    break;
                case '4':
                    $("#card_container").append("<button id='blue4' class='card' value='" + card + "'></button>");
                    break;
                case '5':
                    $("#card_container").append("<button id='blue5' class='card' value='" + card + "'></button>");
                    break;
                case '6':
                    $("#card_container").append("<button id='blue6' class='card' value='" + card + "'></button>");
                    break;
                case '7':
                    $("#card_container").append("<button id='blue7' class='card' value='" + card + "'></button>");
                    break;
                case '8':
                    $("#card_container").append("<button id='blue8' class='card' value='" + card + "'></button>");
                    break;
                case '9':
                    $("#card_container").append("<button id='blue9' class='card' value='" + card + "'></button>");
                    break;
                case '0':
                    $("#card_container").append("<button id='blue0' class='card' value='" + card + "'></button>");
                    break;
                case 'inverse':
                    $("#card_container").append("<button id='blue_inverse' class='card' value='" + card + "'></button>");
                    break;
                case 'skip':
                    $("#card_container").append("<button id='blue_skip' class='card' value='" + card + "'></button>");
                    break;
                case '+2':
                    $("#card_container").append("<button id='blue_2' class='card' value='" + card + "'></button>");
                    break;


            }
        }
        else if (tab[0] == 'neutre') {
            switch (tab[1]) {
                case 'joker':
                    $("#card_container").append("<button id='joker' class='card' value='" + card + "'></button>");
                    break;
                case '+4':
                    $("#card_container").append("<button id='neutre_4' class='card' value='" + card + "'></button>");
                    break;
            }
        }
    }
    socket.on('send_hand', function (data) {
        for (var key in data.hand) {
            generate_card(data.hand[key]);
            $("#bottom_right").remove();
        }
        $(".card").click(function () {
            var value = $(this).attr("value");
            socket.emit('play_card', {room: $(".title")[0].innerText, card: value, player: socket.id});
        });
        $("body").append("<h3 id='pioche_title'>Clikez sur le paquet pour piocher une carte</h3><div id=\"pioche\"></div>");
        $("#pioche").click(function () {
            socket.emit('pioche_card', {room: $(".title")[0].innerText, player: socket.id});
        });
    });
    socket.on('card_used', function (data) {
        $("#card_container").html("");
        var hand = data.hand.split(',');
        for (var key in hand) {
            generate_card(hand[key]);
        }
        console.log(hand.length, hand[0].length);
        if (hand.length == 1 && hand[0].length < 2) {
            console.log('yes');
            socket.emit('game_finish', {room: $(".title")[0].innerText, player: socket.id});
        }
        $(".card").click(function () {
            var value = $(this).attr("value");
            socket.emit('play_card', {room: $(".title")[0].innerText, card: value, player: socket.id});
        });
    });
    socket.on('new_deck_end', function (data) {
        $("#deck_end").html("");
        for (var cle in data.deck_end) {
            end_deck(data.card);
        }
    });
    socket.on('change_player', function (data) {
        $(".players_name").removeClass('player_on');
        $('.players_name').each(function(i, item) {
            if (item.innerText == data.player) {
                $(item).addClass('player_on');
            }
        });
    });
    socket.on('card_players', function (data) {
        $("#card_players").html("");
        for (var key in data.card_players) {
            var player = key;
            var tab = data.card_players[key].split(',');
            var count = tab.length;
            $("#card_players").append("<h1>" + player + "</h1><h3>Carte restante :" + count + "</h3><br/><br/>");
        }
    });
    socket.on('leaving_game', function (data) {
        window.location.href = "http://localhost:3000/";
    });
    socket.on('quit_button', function (data) {
        $("body").append("<button id='quit_game'>Quittez la partie</button>");
        $("#quit_game").click(function () {
            socket.emit('quit_game', {room: $(".title")[0].innerText, player: socket.id});
        });
    });
    socket.on('leaving_player', function (data) {
        $("#block_players").html("");
        for (var indice in data.players) {
            $("#block_players").append("<div class='players_name'>" + data.players[indice] + "</div>");
        }
    });
    socket.on('game_over', function (data) {
       $("body").append("<h1>Winner is : " + data.winner + "</h1>");
        function redi() {
            window.location.href = "http://localhost:3000/";
        };
        window.setTimeout(redi, 3000);
    });

    function closeIt()
    {
        return "ok";
    }
    window.onbeforeunload = closeIt;
});
