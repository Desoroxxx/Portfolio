var canvas=document.getElementById("canvas"),gl,time,vertexSource,fragmentSource,vertexShader,fragmentShader,program,vertexData,vertexDataBuffer,positionHandle,timeHandle,widthHandle,heightHandle,lastFrame,thisFrame;canvas.width=window.innerWidth,canvas.height=window.innerHeight,gl=canvas.getContext("webgl"),gl||console.error("Unable to initialize WebGL."),time=0,vertexSource=`
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,fragmentSource=`
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
`,window.addEventListener("resize",onWindowResize,!1);function onWindowResize(){canvas.width=window.innerWidth,canvas.height=window.innerHeight,gl.viewport(0,0,canvas.width,canvas.height),gl.uniform1f(widthHandle,window.innerWidth),gl.uniform1f(heightHandle,window.innerHeight)}function compileShader(e,t){var n=gl.createShader(t);if(gl.shaderSource(n,e),gl.compileShader(n),!gl.getShaderParameter(n,gl.COMPILE_STATUS))throw"Shader compile failed with: "+gl.getShaderInfoLog(n);return n}function getAttribLocation(e,t){var n=gl.getAttribLocation(e,t);if(n===-1)throw"Cannot find attribute "+t+".";return n}function getUniformLocation(e,t){var n=gl.getUniformLocation(e,t);if(n===-1)throw"Cannot find uniform "+t+".";return n}vertexShader=compileShader(vertexSource,gl.VERTEX_SHADER),fragmentShader=compileShader(fragmentSource,gl.FRAGMENT_SHADER),program=gl.createProgram(),gl.attachShader(program,vertexShader),gl.attachShader(program,fragmentShader),gl.linkProgram(program),gl.useProgram(program),vertexData=new Float32Array([-1,1,-1,-1,1,1,1,-1]),vertexDataBuffer=gl.createBuffer(),gl.bindBuffer(gl.ARRAY_BUFFER,vertexDataBuffer),gl.bufferData(gl.ARRAY_BUFFER,vertexData,gl.STATIC_DRAW),positionHandle=getAttribLocation(program,"position"),gl.enableVertexAttribArray(positionHandle),gl.vertexAttribPointer(positionHandle,2,gl.FLOAT,!1,2*4,0),timeHandle=getUniformLocation(program,"time"),widthHandle=getUniformLocation(program,"width"),heightHandle=getUniformLocation(program,"height"),gl.uniform1f(widthHandle,window.innerWidth),gl.uniform1f(heightHandle,window.innerHeight),lastFrame=Date.now();function draw(){const e=window.matchMedia(`(prefers-reduced-motion: reduce)`)===!0||window.matchMedia(`(prefers-reduced-motion: reduce)`).matches===!0;thisFrame=Date.now(),e?time+=(thisFrame-lastFrame)/6e3:time+=(thisFrame-lastFrame)/1750,lastFrame=thisFrame,gl.uniform1f(timeHandle,time),gl.drawArrays(gl.TRIANGLE_STRIP,0,4),requestAnimationFrame(draw)}let canDraw=1;draw();const sentences=["making code and things faster and more efficient and simpler and easier to look at and easier to understand.","optimizing things!"];let i=0,counter;setTimeout(deleteText,5e3);function deleteText(){let e=sentences[i].split("");var t=function(){e.length>0?(e.pop(),document.getElementById("text").innerHTML=e.join("")):(i++,writeText()),counter=setTimeout(t,40)};t()}function writeText(){let e=sentences[i].split("");var t=function(){e.length>0?document.getElementById("text").innerHTML+=e.shift():setTimeout(removeProperty,1e3),counter=setTimeout(t,80)};t()}function removeProperty(){document.getElementById("text").style.removeProperty("border-right")}const icons=document.querySelectorAll(".github-icon");function updateIcons(){const e=window.matchMedia(`(prefers-color-scheme: light)`).matches;icons.forEach(t=>t.src=e?"assets/github-mark.svg":"assets/github-mark-white.svg")}window.matchMedia(`(prefers-color-scheme: light)`).addListener(function(){updateIcons()}),updateIcons()