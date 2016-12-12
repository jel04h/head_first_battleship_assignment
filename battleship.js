//** General Plan
//** 3 Objects: Controller(user input), Model(ships), and View(display on screen)


//THE VIEW OBJECT ***********************************
var view = {
  //this method takes a string message and displays it in the message display area
  displayMessage: function (msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
    
  },
  //this method takes each hit and displays it in the correct id
  displayHit: function (location) {
    //get a string id that consists of two numbers for the location of the hit or miss
    //use the DOM to get the element with that id
    //set that element's class attribute to "hit" if we're in displayHit, and "miss" if we're in displayMiss.
    
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
    
    
  },
  //this method takes each miss and displays it in the correct id
  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
  
};


//THE MODEL OBJECT *********************************************
var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,
  //ships is a property in the model object
  ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
          { locations: [0, 0, 0], hits: ["", "", ""] },
          { locations: [0, 0, 0], hits: ["", "", ""] }],
  
  //examines each ship and sees if it occupies that location
  //if it does, and mark corresponding item in the hits array and let view know it's been hit, return true
  //if it doesn't, miss, let the view know, and return false
  fire: function (guess) {
    for (var i=0; i<this.numShips; i++) {
      var ship = this.ships[i];
      var locations = ship.locations;
      var index = locations.indexOf(guess);
      
      if (index >=0) { //Searches through the locations for a matching value, it's -1 if it can't find it.
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("You hit my battleship!");
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!!!");
          this.shipsSunk++;
        }
        return true; //ends the function
      }
    }

    //If it's not in the index--it's a miss
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false; //ends the function
  },
  
  isSunk: function(ship) {
    for (var i=0; i<this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false; //not all hits = hit, so it's not sunk
      }
    }
    return true; //isSunk is true!
  },
  
  //GENERATE SHIP LOCATIONS **************************************
  generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },
  
  //GENERATE SHIPS ***********************************************
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row;
    var col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
    } else {
      row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
      col = Math.floor(Math.random() * this.boardSize);
    }
    
    var newShipLocations = [];
    for (var i=0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },
  
  //AVOIDING COLLISIONS *******************************************
  collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
  
};


//THE CONTROLLER OBJECT ********************************************
// (1)Get and Process player's guess(A0, B3, etc). (2)Keep track of the number of guesses. (3)Ask the model to update itself based on the latest guess. (4)Determine when the game is over(that is, when all ships have been sunk).

var controller = {
  guesses: 0,
  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses.");
        var form = document.getElementById("coordinateForm");
        form.setAttribute("class", "none");
      }
    }
  }
};


//REUSABLE PARSEGUESS FUNCTION **************************************
function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  
  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.");
  } else {
    var firstChar = guess.charAt(0); //charAt is a method
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);
    
    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.")
    } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
      alert("Oops, that's off the board!");
    } else {
      return row + column;
    }
  }
  return null;
}


//EVENT HANDLER **********************************************
function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton; //this is a click handler that adds the handleFireButton function to the button
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  
  model.generateShipLocations(); 
}

function handleFireButton() {
  //code to get the value from the form
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  
  guessInput.value = "";
}

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init; //run this when the window is fully loaded
















//**TESTING TESTING **************************************************
//view.displayMiss("00");
//view.displayHit("34");
//view.displayMiss("55");
//view.displayMessage("YOU SUNK MY BATTLESHIP!");

//model.fire("10");

//console.log(parseGuess("A0"));
//console.log(parseGuess("B6"));
//console.log(parseGuess("G3"));
//console.log(parseGuess("H0"));
//console.log(parseGuess("A7"));

//controller.processGuess("A6");
//controller.processGuess("B6");
//controller.processGuess("C6");
//
//controller.processGuess("C4");
//controller.processGuess("D4");
//controller.processGuess("E4");
//
//controller.processGuess("B0");
//controller.processGuess("B1");
//controller.processGuess("B2");
