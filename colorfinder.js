//AI for naming a color out of 135 different colors
//based on a CodingTrain tuorial "ml5.js: Train Your Own Neural Network"
//by Daniel Shiffman https://thecodingtrain.com/Courses/ml5-beginners-guide/6.1-ml5-train-your-own.html
//to Start the training, simply press the Button, after 200 epochs the Program start to guess
//the randmoly generated Backgroundcolor after that it starts to train again, after a while the
//AI gets better and better in guessing
//in the Bottom of the Screen is a diagram, which shows the percentage of every possible color
//in the upper right corner is a box, with the guessed color, so you can easy tell, if the NN is right
//27.11.2019   Marvin

let table;
let zaehler = 1;
let model;
let w = 10;
let epochen = 200;
let ww = 700;
let hh = 700;
let guess = false;

let r = 128;
let g = 128;
let b = 128;

let R;
let G;
let B;
let Farben;

let breiten = [];

function preload() {
  table = loadTable('Farbtabelle.csv', 'csv', 'header');
}

function setup() {
  let optionsD = {
    dataUrl: 'Farbtabelle.csv',
    inputs: ['R', 'G', 'B'],
    outputs: ['Farben'],
    task: 'classification',
    hiddenUnits: 10,
    debug: 'TRUE'
  }
  model = ml5.neuralNetwork(optionsD);
  console.log('ml5 version:', ml5.version);
  createCanvas(ww, hh);
  background(r, g, b);
  startOver();
}
function startOver(){


  trainingButtonZero = createButton('Train the Model from scratch');
  trainingButtonZero.position(20, hh + 20);
  trainingButtonZero.mousePressed(trainingFromZero);

  guessButtonZero = createButton('Guess the color');
  guessButtonZero.position(20, hh + 45);
  guessButtonZero.mousePressed(makeGuess);
}



function makeGuess() {
  guess = true;
  let options = {
    epochs: 1
  }
  model.train(options, whileTraining, trainingFinished);


}



function trainingFromZero() {

  console.log('startet training');
  let options = {
    epochs: epochen
  }
  model.train(options, whileTraining, trainingFinished);

}

function whileTraining(epochs, loss) {

}

function trainingFinished() {
  console.log('finished training.');
  r = floor(random(255));
  g = floor(random(255));
  b = floor(random(255));


  let inputs = {
    R: r,
    G: g,
    B: b
  }
  model.classify(inputs, gotResults)
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  let breite = width / 135;
  background(r, g, b)
  stroke(255);
  fill(255);
  let farbe = results[0].label;
  textSize(32);
  text("I think the Backgroundcolor is " + farbe, 10, 30);
  let schurli = results[0].confidence * 100;
  textSize(32);
  text(schurli + " % sure", 10, 60);

  for (let i = 0; i <= 135; i++) {
    let Sicherheit = results[i].confidence * 100;
    let zeile = table.findRow(results[i].label, 'Farben')
    let rr = zeile.get(1);
    let gg = zeile.get(2);
    let bb = zeile.get(3);
    fill(rr, gg, bb);
    let breite = width / 135;
    noStroke();

    rect(width - (breite * i) - breite, height, breite, -((height - 200) / 100 * Sicherheit));
  }
  let zeileRect = table.findRow(results[0].label, 'Farben')
  let rrRect = zeileRect.get(1);
  let ggRect = zeileRect.get(2);
  let bbRect = zeileRect.get(3);
  fill(rrRect, ggRect, bbRect);
  let Sicherheitsbreite = results[0].confidence * 100 * 2;
  rect(0, 80, 200, 200);
  console.log("Backgroundcolor: R " + r + " G: " + g + " B: " + b);
  console.log("Guessed Color:   R " + rrRect + " G: " + ggRect + " B: " + bbRect);
  //console.log(guess);
  if (guess == false) {
    fill(255);
    text(zaehler * epochen + " Epochs", 10, height - 40);
    let options = {
      epochs: epochen
    }

    model.train(options, whileTraining, trainingFinished);
    zaehler++;
  } else {
    guess = false;
    //console.log(guess);
    startOver();
  }

}
