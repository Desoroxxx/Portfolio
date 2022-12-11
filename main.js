//////////////////////////////////////////////////////////////////////////////
//Background of the site originaly from https://codepen.io/al-ro/pen/oRZLbd//
////////////////////////////////////////////////////////////////////////////

var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// Initialize the GL context
var gl = canvas.getContext('webgl');
if(!gl){
  console.error("Unable to initialize WebGL.");
}

//Time
var time = 0.0;

//************** Shader sources **************

var vertexSource = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

var fragmentSource = `
precision highp float;

uniform float width;
uniform float height;
vec2 resolution = vec2(width, height);

uniform float time;

void main(){

  // Precompute some values that will be used multiple times
  float t = time/6.0;
  float strength = 0.4;
  vec2 pos = gl_FragCoord.xy/resolution.xy;
  pos.y /= resolution.x/resolution.y;
  pos = 4.0*(vec2(0.5) - pos);

  // Vectorize the inner loop
  vec4 k = vec4(1.0, 2.0, 3.0, 4.0);
  vec2 offset = vec2(strength * sin(2.0*t+k.x*1.5 * pos.y)+t*0.5, strength * cos(2.0*t+k.x*1.5 * pos.x));
  pos += offset;
  offset = vec2(strength * sin(2.0*t+k.y*1.5 * pos.y)+t*0.5, strength * cos(2.0*t+k.y*1.5 * pos.x));
  pos += offset;
  offset = vec2(strength * sin(2.0*t+k.z*1.5 * pos.y)+t*0.5, strength * cos(2.0*t+k.z*1.5 * pos.x));
  pos += offset;
  offset = vec2(strength * sin(2.0*t+k.w*1.5 * pos.y)+t*0.5, strength * cos(2.0*t+k.w*1.5 * pos.x));
  pos += offset;

  //Time varying pixel colour
  vec3 col = 0.5 + 0.5*cos(time+pos.xyx+vec3(0,2,4));

  //Gamma
  col = pow(col, vec3(0.4545));

  //Fragment colour
  gl_FragColor = vec4(col,1.0);
}
`;

//************** Utility functions **************

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform1f(widthHandle, window.innerWidth);
  gl.uniform1f(heightHandle, window.innerHeight);
}

//Compile shader and combine with source
function compileShader(shaderSource, shaderType){
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
  	throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
  }
  return shader;
}

//From https://codepen.io/jlfwong/pen/GqmroZ
//Utility to complain loudly if we fail to find the attribute/uniform
function getAttribLocation(program, name) {
  var attributeLocation = gl.getAttribLocation(program, name);
  if (attributeLocation === -1) {
  	throw 'Cannot find attribute ' + name + '.';
  }
  return attributeLocation;
}

function getUniformLocation(program, name) {
  var attributeLocation = gl.getUniformLocation(program, name);
  if (attributeLocation === -1) {
  	throw 'Cannot find uniform ' + name + '.';
  }
  return attributeLocation;
}

//************** Create shaders **************

//Create vertex and fragment shaders
var vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
var fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

//Create shader programs
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

gl.useProgram(program);

//Set up rectangle covering entire canvas 
var vertexData = new Float32Array([
  -1.0,  1.0, 	// top left
  -1.0, -1.0, 	// bottom left
   1.0,  1.0, 	// top right
   1.0, -1.0 	// bottom right
]);

//Create vertex buffer
var vertexDataBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

// Layout of our data in the vertex buffer
var positionHandle = getAttribLocation(program, 'position');

gl.enableVertexAttribArray(positionHandle);
gl.vertexAttribPointer(positionHandle,
  2, 				// position is a vec2 (2 values per component)
  gl.FLOAT, // each component is a float
  false, 		// don't normalize values
  2 * 4, 		// two 4 byte float components per vertex (32 bit float is 4 bytes)
  0 				// how many bytes inside the buffer to start from
  );

//Set uniform handle
var timeHandle = getUniformLocation(program, 'time');
var widthHandle = getUniformLocation(program, 'width');
var heightHandle = getUniformLocation(program, 'height');

gl.uniform1f(widthHandle, window.innerWidth);
gl.uniform1f(heightHandle, window.innerHeight);

var lastFrame = Date.now();
var thisFrame;

function draw(){
	
  const isReduced = window.matchMedia(`(prefers-reduced-motion: reduce)`) === true || window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  //Update time
	thisFrame = Date.now();
  // Check if the user ask for reduced motion
  if (!isReduced) {
    time += (thisFrame - lastFrame)/1750;	
  } else {
    time += (thisFrame - lastFrame)/6000;	
  }
	lastFrame = thisFrame;

	//Send uniforms to program
  gl.uniform1f(timeHandle, time);
  //Draw a triangle strip connecting vertices 0-4
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(draw);
}

let canDraw = 1

draw();

////////////////////////////
//About me text animation//
//////////////////////////

const sentences = ["making code and things faster and more efficient and simpler and easier to look at and easier to understand.","optimizing things!"];
let i = 0;
let counter;

setTimeout(deleteText, 5000);

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
        counter = setTimeout(loopDeleting, 40);
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
        counter = setTimeout(loopWrite, 80);
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
const icons = document.querySelectorAll(".github-icon");

function updateIcons() {
  // Check if the user's preferred color scheme is light or dark
  const isLightTheme = window.matchMedia(`(prefers-color-scheme: light)`).matches;

  // Set the src attribute of each icon to the appropriate URL
  icons.forEach(icon => icon.src = isLightTheme ? 'assets/github-mark.svg' : 'assets/github-mark-white.svg');
}

// Listen for changes in the user's preferred color scheme
window.matchMedia(`(prefers-color-scheme: light)`).addListener(function(e) {
  updateIcons();
});

// Update the icons when the page first loads
updateIcons();
