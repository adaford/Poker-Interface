var App = new Vue({
  el: '#my-vue-app',
  data: {
    deck : ["2C", "2D", "2S", "2H", "3C", "3D", "3S", "3H", "4C", "4D", "4S", "4H", "5C", "5D", "5S", "5H", "6C", "6D", "6S", "6H",
    "7C", "7D", "7S", "7H", "8C", "8D", "8S", "8H", "9C", "9D", "9S", "9H", "10C", "10D", "10S", "10H", "JC", "JD", "JS", "JH",
    "QC", "QD", "QS", "QH", "KC", "KD", "KS", "KH", "AC", "AD", "AS", "AH"],

    chips : {yours : 1000, opps : 1000},
    blinds : {small : 10, big : 20},
    hands : {yours : [], opps : []},
    board : [],
    pot : 0,
    bets : {yours : 0, opps : 0, last : 0},
    player : {turn: true, button : false},
    actionText : {action : "Click New Game", turn : ""},
    allIn : false,
    currentRound : 0,
    nextRound : false,
    invalidRaise : {visibility : "visibility: hidden;"},
    raiseAmount : {visibility : "visibility: hidden;"},

    shuffle : function() {
      this.deck = ["2C", "2D", "2S", "2H", "3C", "3D", "3S", "3H", "4C", "4D", "4S", "4H", "5C", "5D", "5S", "5H", "6C", "6D", "6S", "6H",
      "7C", "7D", "7S", "7H", "8C", "8D", "8S", "8H", "9C", "9D", "9S", "9H", "10C", "10D", "10S", "10H", "JC", "JD", "JS", "JH",
      "QC", "QD", "QS", "QH", "KC", "KD", "KS", "KH", "AC", "AD", "AS", "AH"]

      var i = 0, j = 0, temp = null
      for (i = this.deck.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = this.deck[i]
        this.deck[i] = this.deck[j]
        this.deck[j] = temp
      }
    },

    //convert card to picture on screen
    addPicture : function() {
      document.getElementById('oc1').src = "Cards/" + this.hands.opps[0] + ".jpg"
      document.getElementById('oc2').src = "Cards/" + this.hands.opps[1] + ".jpg"
      document.getElementById('yc1').src = "Cards/" + this.hands.yours[0] + ".jpg"
      document.getElementById('yc2').src = "Cards/" + this.hands.yours[1] + ".jpg"
      for (var i = 1; i <= 5; i++) {
      	if (this.board[i - 1]) {
      		document.getElementById('bc' + i.toString()).style.visibility = "visible"
      		document.getElementById('bc' + i.toString()).src = "Cards/" + this.board[i - 1] + ".jpg"
      	} else {
      		document.getElementById('bc' + i.toString()).style.visibility = "hidden"
      	}
      }
    },

    swapButton : function() {
       this.player.button = !this.player.button
       if (this.player.button == true) {
       	  document.getElementById('button').style.top = "65%"
       } else {
       	  document.getElementById('button').style.top = "15%"
       }
       this.player.turn = !this.player.button
       this.switchTurn()
    }, 

    //gives both players 2 cards
    deal2 : function() {
      this.hands.yours = []
      this.hands.opps = []
      this.board = []
      this.hands.yours.push(this.deck.pop())
      this.hands.yours.push(this.deck.pop())
      this.hands.opps.push(this.deck.pop())
      this.hands.opps.push(this.deck.pop())
      this.addPicture()
    },

    switchTurn : function() {
      this.player.turn = !this.player.turn
      if (this.player.turn) {
        this.actionText.turn = "Your turn!"
      } else {
        this.actionText.turn = "Computer Turn!"
      }
    },

    postBlinds : function() {
      this.bets.last = this.blinds.big - this.blinds.small
      if (this.player.button) {
        this.bets.yours = Math.min(this.blinds.small, this.chips.yours)
        this.chips.yours -= this.bets.yours
        if (this.chips.yours == 0) {this.allIn = true}
        this.bets.opps = Math.min(this.blinds.big, this.chips.opps)
        this.chips.opps -= this.bets.opps
        if (this.chips.opps == 0) {this.allIn = true}
      } else {
        this.bets.opps = Math.min(this.blinds.small, this.chips.opps)
        this.chips.opps -= this.bets.opps
        if (this.chips.opps == 0) {this.allIn = true}
        this.bets.yours = Math.min(this.blinds.big, this.chips.yours)
        this.chips.yours -= this.bets.yours
        if (this.chips.yours == 0) {this.allIn = true}
      }
      if (this.allIn){this.nextRound = true}
    },

    showdown : function() {
      this.chips.yours += this.pot + this.bets.yours + this.bets.opps
    },

    nextHand : function() {
      this.actionText.action = "New Hand"
      this.swapButton()
      this.shuffle()
      this.deal2()
      this.bets = {yours : 0, opps : 0}
      this.pot = 0
      this.currentRound = 0
      this.allIn = false

      this.postBlinds()
      this.waitForAction()
    },

    waitForAction : function() {
      console.log("waiting")
      if (this.allIn) {this.nextRound = true}
      if (!this.nextRound) {
        wait = setTimeout( () => {this.waitForAction()}, 1000)
      } else {
        clearTimeout(wait)
        this.nextRound = false
        var cardsToDeal = 3
        if (this.currentRound != 0) {cardsToDeal = 1}
        this.currentRound += 1   
        if (this.currentRound == 4) {
          this.currentRound = 0
          setTimeout( () => {this.showdown()}, 3000)
          setTimeout( () => {this.nextHand()}, 4000)
        } else {
          this.dealBoard(cardsToDeal)
          this.pot += this.bets.yours + this.bets.opps
          this.bets.yours = 0
          this.bets.opps = 0
          this.bets.last = this.blinds.big - this.blinds.small
          this.player.turn = this.player.button
          this.switchTurn()
          this.actionText.action = "Check or Bet!"
          this.waitForAction()
        }
      }
    },

    //flops x cards to the board
    dealBoard : function(x) {
      for (var i = 0; i < x; i++) {
      	this.board.push(this.deck.pop())
      }
      this.addPicture()
    },

    raiseIsValid : function() {
      var bet = 0
      if (this.player.turn) {bet = Math.min(this.chips.yours + this.bets.yours, document.getElementById('raiseAmount').value)}
      else {bet = Math.min(this.chips.opps + this.bets.opps, document.getElementById('raiseAmount').value)}
      if (this.player.turn && (bet - this.bets.opps >= this.bets.last || bet == this.chips.yours - this.bets.yours)) {
        this.chips.yours -= (bet - this.bets.yours)
        this.bets.yours = bet
        this.invalidRaise.visibility = "visibility: hidden;"
        this.raiseAmount.visibility = "visibility: hidden;"
        return true
      }
      if (!this.player.turn && (bet - this.bets.yours >= this.bets.last || bet == this.chips.opps - this.bets.opps)) {
        this.chips.opps -= (bet - this.bets.opps)
        this.bets.opps = bet
        this.invalidRaise.visibility = "visibility: hidden;"
        this.raiseAmount.visibility = "visibility: hidden;"        
        return true
      }
      this.invalidRaise.visibility = "visibility: visible;"
      return false
    },

    raiseBar : function() {
      if (this.raiseAmount.visibility == "visibility: hidden;") {
        this.raiseAmount.visibility = "visibility: visible;"
        return false
      }
      return true
    }

  }, 

  methods: {
  	newGame: function() {
      //clear timeouts from old games
      var id = window.setTimeout(function() {}, 0);
      while (id--) {
        window.clearTimeout(id);
      }
      this.invalidRaise.visibility = "visibility: hidden;"
      this.raiseAmount.visibility = "visibility: hidden;"
      //randomly choose button
  	  var x = Math.floor(Math.random() * 100) % 2
      if (x == 0) {
         this.player.button = true
      } else {
       	 this.player.button = false
      }
      this.chips = {yours : 1000, opps : 1000}
      this.nextHand()
    },

    act: function(event) {
      switch(event.target.id) {
      case "check":
        if (this.bets.yours != this.bets.opps) {
          this.actionText.action = "Cannot Check!"
          return
        }
        if (this.player.turn) {
        	this.actionText.action = "Player Checks!"
        } else {
        	this.actionText.action = "Computer Checks!"
        }
        if (this.player.button == this.player.turn || this.currentRound == 0) {
          this.nextRound = true
        }
        if (!this.nextRound) {this.switchTurn()}
      break

      case "call":
        if (this.bets.yours == this.bets.opps) {
          this.actionText.action = "Cannot Call!"
          return
        }
        if (this.player.turn) {
          var last = this.bets.yours
          this.bets.yours = Math.min(this.bets.opps, this.chips.yours + this.bets.yours)
          this.chips.yours -= this.bets.yours - last
          this.actionText.action = "Player Calls!"
        } else {
          var last = this.bets.opps
          this.bets.opps = Math.min(this.bets.yours, this.chips.opps + this.bets.opps)
          this.chips.opps -= this.bets.opps - last
          this.actionText.action = "Computer Calls!"
        }
        if (this.bets.yours != this.blinds.big && this.bets.opps != this.blinds.big) {this.nextRound = true}
        if (!this.nextRound) {this.switchTurn()}
      break

      case "raise":
        if (!this.raiseBar()) {return}
        if (this.player.turn) {
            if (!this.raiseIsValid()) {return}
            this.actionText.action = "Player bets " + this.bets.yours.toString()
            this.bets.last = this.bets.yours - this.bets.opps
        } else {
            if (!this.raiseIsValid()) {return}
            this.actionText.action = "Opponent bets " + this.bets.opps.toString()
            this.bets.last = this.bets.opps - this.bets.yours
        }
        if (!this.nextRound) {this.switchTurn()}
      break

      case "fold":
        if (this.player.turn) {
          this.chips.opps += this.pot + this.bets.yours + this.bets.opps
        } else {
          this.chips.yours += this.pot + this.bets.yours + this.bets.opps
        }
        clearTimeout(wait)
        setTimeout( () => {this.nextHand()}, 2000)
      break

      }
      this.invalidRaise.visibility = "visibility: hidden;"
      this.raiseAmount.visibility = "visibility: hidden;"
      if (this.chips.yours == 0 || this.chips.opps == 0) {this.allIn = true}
    }
  }

});




