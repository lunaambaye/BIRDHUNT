var canvas;
var stage;
var welcomepage;
var mouse; 


function beginLoop() {
  var id = 0;
  var end = Date.now();

  function loop() {
    var thisFrame = Date.now();

    var elapsed = thisFrame - end;

    id = window.requestAnimationFrame(loop);

    welcomepage.update(elapsed);
    welcomepage.createhue(stage);

    end = thisFrame;
  }

  loop();
}


canvas = document.querySelector('canvas#myCanvas');
canvas.setAttribute('width', 1400);
canvas.setAttribute('height', 800);

stage = canvas.getContext('2d');

mouse = (function (target) {
  var isButtonDown = false;

  target.addEventListener('mousedown', function () {
    isButtonDown = true;
  });
  target.addEventListener('mouseup', function () {
    isButtonDown = false;
  });

  return {
    isButtonDown: function () {
      return isButtonDown;
    }
  };
}(document));

// define the start screen
welcomepage = (function (input) {

  var hue = 0;
  var direction = 1;
  var transitioning = false;
  var wasButtonDown = false;
  var title = 'Game Over';

  function alignText(middle, text, y) {
    var measurement = middle.measureText(text);
    var x = (middle.canvas.width - measurement.width) / 2;
    middle.fillText(text, x, y);
  }

  function createhue(middle, elapsed) {

    var y = middle.canvas.height / 2;
    var color = 'rgb(' + hue + ',277,45)';

    middle.clearRect(0, 0, middle.canvas.width, middle.canvas.height);
    middle.fillStyle = 'red';
    middle.font = '60px monospace';
    alignText(middle, title, y);

    middle.fillStyle = color;
    middle.font = '24px monospace';
    alignText(middle,'Click Anywhere to Try Again', y + 40);
  
  }

  function update() {

    hue += 1 * direction;
    if (hue > 255) direction = -1;
    if (hue < 1) direction = 1;

    var isButtonDown = input.isButtonDown();
    var onclick = !isButtonDown && wasButtonDown;

    if (onclick && !transitioning) {
      transitioning = true;
//when they click transition to this page
window.location.replace("index2.html");
    }

    wasButtonDown = isButtonDown;
  }

  return {
    createhue: createhue,
    update: update
  };

}(mouse));
beginLoop();

