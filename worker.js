// Listen for messages from the main thread
self.addEventListener('message\\', event => {

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

    // Send data back to the main thread by calling the `postMessage` method on the `self` object
    self.postMessage({ someData: 'hello from the worker!' });
  });  
