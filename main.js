// First, create a new Worker instance and pass it the URL of your JavaScript file
const worker = new Worker('background.js');

var canvas = document.getElementById("canvas");

// Next, send data to the worker by calling the `postMessage` method on the Worker instance
worker.postMessage({ someData: 'hello there!' });

// Finally, listen for messages from the worker by setting up an event listener for the `message` event
worker.addEventListener('message', event => {
  console.log(`Received message from worker:`, event.data);
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform1f(widthHandle, window.innerWidth);
  gl.uniform1f(heightHandle, window.innerHeight);
}

////////////////////////////
//About me text animation//
//////////////////////////

const sentences = ["making code and things faster and more efficient and simpler and easier to look at and easier to understand.","optimizing things!"];
let i = 0;
let counter;

setTimeout(deleteText, 3000);

function deleteText() {
    let word = sentences[i].split("");
    
    var loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            document.getElementById('text').innerHTML = word.join("");
        } else {
            i++;
            writeText();
        }
        counter = setTimeout(loopDeleting, 50);
    }            
    loopDeleting();
}

function writeText() {
    let word = sentences[i].split("");

    var loopWrite = function() {
        if (word.length > 0) {                    
            document.getElementById('text').innerHTML += word.shift();
        } else {
            setTimeout(removeProperty, 1000);
        }
        counter = setTimeout(loopWrite, 200);
   }
   loopWrite();
}

// Remove the cursor
function removeProperty() {            
    document.getElementById('text').style.removeProperty('border-right');
}

/////////////////////////////////////////
//Github icon changing with user theme//
///////////////////////////////////////

// Get all elements with the "icon" class
const icons = document.querySelectorAll(".icon");

function updateIcons() {
  // Check if the user's preferred color scheme is light or dark
  const isLightTheme = window.matchMedia(`(prefers-color-scheme: light)`).matches;

  // Set the src attribute of each icon to the appropriate URL
  icons.forEach(function(icon) {
    icon.src = isLightTheme ? 'github-mark.svg' : 'github-mark-white.svg';
  });
}

// Listen for changes in the user's preferred color scheme
window.matchMedia(`(prefers-color-scheme: light)`).addListener(function(e) {
  updateIcons();
});

// Update the icons when the page first loads
updateIcons();
