let colors = [
//   "BLACK",
//   "LIGHTGRAY", // Comment out if you don't want this layer
//   "MARINERED",
//   "BRIGHTRED",
//   "FLUORESCENTPINK", 
//   "FLUORESCENTORANGE", 
  "SUNFLOWER", 
//   "YELLOW", 
  "MINT", 
//   "GREEN", 
//   "TEAL", 
//   "CORNFLOWER", 
//   "MEDIUMBLUE", 
//   "VIOLET"
];

let layers = [];

let img;
let newImg;
let steps = 0.08; //for thresholding
let shape = 'circle'; //for halftone shape
let frequency = 10; //for halftone frequency
let angle = 45; //for halftone angle
let intensity = 127; //for halftone intensity
let sync = false; //halftone layer sync

//---------------------------------------------
function preload() {
    img = loadImage("photos/IMG_3829.jpeg");
  }
  
//---------------------------------------------
function setup() {
    pixelDensity(1);
    createCanvas(img.width+500, img.height);
    background(255);

    // Create layers based on the colors array above
    for (let i = 0; i < colors.length; i++) {
        layers[i] = new Riso(colors[i]);
    }

}


//---------------------------------------------
function processRiso() {
    console.log("Process normal color separation. Adjust threshold with < and > keys. ");
    clearRiso(); //clear channels
    clear(); // Clear canvas (both required i think)

    newImg = img;

    let images = extractMappedChannels(newImg, steps, true); //change this number to affect fidelity
    // assign images acording to the  colors array length
    for (let i = 0; i < Math.min(images.length, layers.length); i++) {
    layers[i].image(images[i], 0, 0);
    }

    drawRiso();
}

//---------------------------------------------
function processHalftone() {
    console.log("Process halftone. ");
    clearRiso(); //clear channels
    clear(); // Clear canvas (both required i think)

    newImg = img;

    let images = extractMappedChannels(newImg, steps, true); //change this number to affect fidelity
    // assign images acording to the  colors array length
    for (let i = 0; i < Math.min(images.length, layers.length); i++) {
        if(sync == true){ //haltone layers in sync or not
            j = 1;
        } else {
            j = i;
        }
        layers[i].image(halftoneImage(images[i], shape, frequency, angle*j, intensity), 0, 0);
        // layers[i].image(ditherImage(images[i], 'bayer', 100), 0, 0);
    }

    console.log("halftone settings::" + " shape:"+shape + ", frequency:"+frequency + ", angle:"+angle + ", intensity:"+intensity + ", sync:"+sync);
    // layers[0].image(images[0], 0, 0);
    drawRiso();


}

//-----------------------------------------------------------------------------------
//---------KEY PRESS MAPPINGS--------------------------------------------------------
//-----------------------------------------------------------------------------------


function keyPressed() {
    if (key === 'r') {
        console.log("Process color separation. ");
        // clearRiso(); //clear channels
        // clear(); // Clear canvas (both required i think)
        // newImg = img;
        processRiso();
    }
    if (key === 'e') {
        console.log("Exporting... ");
        exportRiso();
      }
      if (key === 'd') {
        console.log("Dither selected. ");
        processDither();
    } 
    if (key === 'h') {
        processHalftone();
    } 
    if (key === 'x') {
        console.log("halftone shape = cross ");
        shape = 'cross';
    } 
    if (key === 'c') {
        console.log("halftone shape = circle ");
        shape = 'circle';
    } 
    if (key === 'o') {
        console.log("halftone shape = ellipse/oval ");
        shape = 'ellipse';
    } 
    if (key === 's') {
        console.log("halftone shape = square ");
        shape = 'square';
    } 
    if (key === 'l') {
        console.log("halftone shape = line ");
        shape = 'line';
    } 
    if (key === 'u') {
        if(sync){
            sync = false;
            console.log("halftone layers unsynced ");
        } else {
            sync = true;
            console.log("halftone layers synced ");
        }
        
        // sync = True;
    } 

    if (key === '`') {
        console.log("reset settings");
        steps = 0.08; //for thresholding
        shape = 'circle'; //for halftone shape
        frequency = 10; //for halftone frequency
        angle = 3.1; //for halftone angle
        intensity = 127; //for halftone intensity
        sync = false; //halftone layer sync
    } 

    //color channel steps
    if (key === ',') {
        if(steps > 0.05){
            steps-=0.01;
            console.log("steps: "+steps);
            // processRiso();
        }
        console.log("steps: "+steps);
    } 

    if (key === '.') {
        if(steps < 0.5){
            steps+=0.01;
            
            // processRiso();
        }
        console.log("steps: "+steps.toFixed(2));
    } 

    //halftone dot frequency
    if (key === '[') {
        if(frequency >= 2){
            frequency-=1;
        }
        console.log("halftone frequency: "+frequency);
    } 

    if (key === ']') {
        if(frequency <= 100){
            frequency+=1;
        }
        console.log("halftone frequency: "+frequency);
    } 

    //halftone angle
    if (key === '-') {
        if(angle >= 0){
        angle -=2;
        }
        console.log("halftone angle: "+ angle);
    } 

    if (key === '=') {
        if(angle <= 180){
            angle +=2;
        }
        console.log("halftone angle: "+ angle);
    }

    //halftone intensity
    if (key === '9') {
        if(intensity >= 0){
        intensity -=2;
        }
        console.log("halftone intensity: "+ intensity);
    } 

    if (key === '0') {
        if(intensity <= 255){
            intensity +=2;
        }
        console.log("halftone intensity: "+ intensity);
    }


}