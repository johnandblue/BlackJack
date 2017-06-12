function Player (name) {
	this.name = name;
	this.cards = [];
	this.image = [];
	this.score = [];
	this.points = 0;
	this.ace = 0;
}

var Player1 = new Player ('Player1');
var Dealer1 = new Player ('Dealer1');
var deckArray = [];
var value = 'A23456789TJQK';
var suit = 'CDHS';

// Creating the deck (AC,2C,3C....9S,TS,JS,QS,KS)
function createDeck() {
	for (var i = 0; i < suit.length; i++) {
		for (var j = 0; j < value.length; j++) {
			deckArray.push(value[j]+suit[i]);
		}
	}
};
createDeck();

// Shuffle function Fisher-Yates:
function shuffle (deckArray) {
	var i = 0
	var j = 0
	var temp = null

for (i = deckArray.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = deckArray[i]
    deckArray[i] = deckArray[j]
    deckArray[j] = temp
  }
}
shuffle (deckArray);

// Deal function for "hit"
function hit(number,Player,cover) {
	for (var i = 0; i < number ; i++) {
		Player.cards.push(deckArray.pop());
		console.log(deckArray.length);
		var cover;	
		for (var j = Player.image.length; j < Player.cards.length ; j++) {
			if (cover === 'show') {
				Player.image[j] = "<img src= images/deck/" + Player.cards[j] + ".png>";
				$('#div_' + Player.name).append(Player.image[j]);
			} else if (cover === 'cover') {
				Player.image[j] = "<img src= images/deck/" + Player.cards[j] + ".png>";
				$('#div_' + Player.name).append("<img src= images/deck/back_card.png>");
				}
		}		
	}
}

//Function to add the score of a Player to score Array
function addScore (Player) {
	for (i = Player.score.length; i < Player.cards.length ; i++) {
		Player.score.push(Player.cards[i].charAt(0)); // Creates score Array
	}
}

// Add points to a Player from score Array and add checks Aces
function addPoints (Player) {
	Player.points = 0;
	for (i = 0; i < Player.score.length ; i++) {
		if (Player.score[i] === 'A') {
				Player.points = Player.points += 11;
				Player.ace = Player.ace += 1;
		} else if (Player.score[i] === 'T' || Player.score[i] ===  'J' || Player.score[i] === 'Q' || Player.score[i] === 'K') {
			Player.points = Player.points += 10;
			} else {
				Player.points = Player.points += parseInt(Player.score[i]);
			}		
	}
}

// Check Points 
function checkPoints (Player) {
	if (Player.points === 21) {
		$('#situation').empty().append(' BLACKJACK!   YOU WIN!')
		$('#hit').hide();
		$('#stand').hide();
		$('#restart').show();
	} else if (Player.points < 21) {
		$('#situation').empty().append(' HIT or STAND ')
	} else if ((Player.points > 21) && (Player.ace == 0)) {
		$('#situation').empty().append(' BUST ')
		$('#hit').hide();
		$('#stand').hide();
		$('#restart').show();
	} else if (Player.points > 21 && Player.ace >= 1) {
		Player.points = Player.points - 10
		if (Player.points === 21) {
			$('#situation').empty().append(' 21! WINNER ')
			$('#restart').show();
		} else if (Player.points < 21) {
			$('#situation').empty().append(' HIT or STAND ')
		} else if (Player.points > 21) {
			$('#situation').empty().append(' BUST ')
			$('#hit').hide();
			$('#stand').hide();
			$('#restart').show();
		}
	}
	$('#score' + Player.name).empty().append(Player.points)
};

function compare () { // ON STAND
	if (Player1.points > Dealer1.points) {
		$('#situation').empty().append('PLAYER WINS')
	} else if (Player1.points < Dealer1.points && Dealer1.points <= 21) {
		$('#situation').empty().append('YOU LOSE')
	} else if (Player1.points < Dealer1.points && Dealer1.points > 21) {
		$('#situation').empty().append('YOU WIN! DEALER BUST')
	} else {
		$('#situation').empty().append('DRAW!')
	}
}

// Shows the cover card from the Dealer cards
function showCover () {
	$('img[src="images/deck/back_card.png"]').remove();
	alert(Dealer1.cards)
	Dealer1.image[1] = "<img src= images/deck/" + Dealer1.cards[1] + ".png>";
	$('#div_Dealer1').append(Dealer1.image[1]);
}

// Deal cards to the Dealer
function hitDealer () {
	while (Dealer1.points <= 17) {
		$('#div_cover').empty();
		hit(1,Dealer1,'show');
		addScore(Dealer1);
		addPoints(Dealer1);
		checkPoints(Dealer1);
	}
}

function hitPlayer () {
	$('#hit').click(function() {
	hit(1,Player1,'show');
	addScore(Player1);
	addPoints(Player1);
	checkPoints(Player1);
	})
}



$(document).ready(function () {

	$('#hit').hide();
	$('#stand').hide();
	$('#restart').hide();


	$('#restart').click (function() {
		location.reload();
	})

	$('#dealCards').click(function() {
		$('#dealCards').hide();
		$('#hit').show();
		$('#stand').show();
		hit(2,Player1,'show');
		hit(1,Dealer1,'show');
		$('#div_cover').append("<img src= images/deck/back_card.png>");
		addScore(Player1);
		addPoints(Player1);
		checkPoints(Player1);
		hitPlayer ();
		});

	$('#stand').click(function() {
		$('#hit').hide();
		$('#stand').hide();
		hitDealer();
		compare();
		$('#dealCards').hide();
		$('#restart').show();
	})

});