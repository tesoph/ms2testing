let sketch = function (p) {

    class Attractor {
        //Our Attractor is a simple object that doesn’t move. We just need a mass and a location.
        constructor(p_) {
            this.p = p_;
            this.location = p.createVector(p.w / 2, p.h / 2);
            this.mass = 100;
            this.velocity = p.createVector(1, 2);
            this.g = 1;
        }

        display() {
            p.stroke(0);
            p.fill(175, 200);
            p.ellipse(this.location.x, this.location.y, 20, 20);
        }

        update() {
            this.location.p.add(this.velocity);
        }

        attract(m) {
            var force = p5.Vector.sub(this.location, m.location);
            var distance = force.mag();
            distance = p.constrain(distance, 5, 25);
            force.normalize();
            //What’s the force’s magnitude?
            var strength = (this.g * this.mass * m.mass) / (distance * distance);
            force.mult(strength);

            //Return the force so that it can be applied!
            return force;
        }

        repel(m) {
            var force = p5.Vector.sub(m.location, this.location);
            var distance = force.mag();
            distance = p.constrain(distance, 5, 25);
            force.normalize();
            //What’s the force’s magnitude?
            var strength = (this.g * this.mass * m.mass) / (distance * distance);
            force.mult(strength);

            //Return the force so that it can be applied!
            return force;
        }

    }

    class Mover {
        constructor(p_, m_, x_, y_, c_) {
            this.p = p_;
            this.color = c_;
            this.location = p.createVector(x_, y_);
            this.velocity = p.createVector(0, 0);
            this.acceleration = p.createVector(-0.001, 0.01);
            this.topspeed = 5;
            this.mass = m_;
            this.radius = this.mass * 10;
        }
        run() {
            this.update();
            this.display();
            this.checkEdges();
        }
        update() {
            //  p.print(p.topseed2);
            this.velocity.add(this.acceleration);
            this.velocity.limit(p.topspeed2);
            this.location.add(this.velocity);
            this.acceleration.mult(0);
        }

        display() {

            //  p.stroke(255);
            p.strokeWeight(p.strokeWidth);
            //fill(this.color);
            //p.fill(p.c);
            if (p.shapeMode == false) {
                p.ellipse(this.location.x, this.location.y, this.radius, this.radius);
            }
            if (p.lines) {
                p.line(p.w / 2, p.h / 2, this.location.x, this.location.y);
            }


            p.fill(255);
        }
        applyForce(force) {
            var f = p5.Vector.div(force, this.mass);
            this.acceleration.add(f);
        }

        checkEdges() {
            //Reverse direction if reaches this.radius distance from edge of sketch
            if (this.location.x > p.w - this.radius) {
                this.velocity.x *= -1;
            } else if (this.location.x < 0 + this.radius) {
                this.velocity.x *= -1;
            }
            if (this.location.y > p.h - this.radius) {
                this.velocity.y *= -1;
            } else if (this.location.y < 0 + this.radius) {
                this.velocity.y *= -1;
            }
        }
    }
    p.moversList = [];
    p.w = 500;
    p.h = 500;
    /*
        p.preload = function () {
            p.mySound = p.loadSound("assets/audio/aiwdily.mp3");
        }*/

    p.setup = function () {
        //Initial value set to false to stop sketch from playing until a user gesture on the page
        p.playing = false;
        p.playingAudioFile = false;
        //creating the sketch canvas with width and height from the parent container
        p.cnv = p.createCanvas(p.w, p.h);

        p.initializeVariables();
        //Array initialised with max (100) number of movers
        //p.numberOfMovers = 100;
        p.initializeMovers();
        //Number of movers then changed to match slider input value

        p.backgroundColor = p.color(0, 0, 0);
        p.background(p.backgroundColor);
        p.backgroundColor.setAlpha(5);
        //Get the mic and attach an fft object to analyse the audio from it
        p.getAudioInput();
        p.displayHighMid = false;
    };

    p.draw = function () {
        //Create a gradual fade effect on the background
        p.fadeBackground();
        p.stroke(p.strokeColor);
        if (p.playing) {
            p.analyzeAudio();
            p.drawBass();
            //  p.moveMovers(p.moversLowMid, p.threshold, p.lowMid);
            p.attractMovers(p.moversLowMid);
            p.repelMovers(p.moversLowMid, p.threshold, p.lowMid);
            if (p.displayHighMid) {
                p.moveMovers(p.moversHighMid, p.threshold, p.highMid);
            }
            for (let i = 0; i < p.numberOfMovers; i++) {
                //  p.attractMovers(p.moversLowMid, i);
                // p.repelMovers(p.moversLowMid, i, p.threshold, p.lowMid);
                // p.moveMovers(p.moversLowMid, i, p.threshold, p.lowMid);
                p.fill(p.myColor);
                //run() contains update, checkedges,and display functions
                p.moversLowMid[i].run();
                if (p.displayHighMid) {
                    p.fill(p.highMidColor);
                    p.moversHighMid[i].run();
                }
            }
            //shape mode
            if (p.shapeMode) {
                p.noFill();
                p.beginShape();
                for (let i = 0; i < p.numberOfMovers; i++) {
                    p.makeShapeMode(i);
                }
                p.endShape();
            }
        }
    };

    p.makeShapeMode = function (i_) {
        //? needs to be in draw()
        let i = i_;
        p.vertex(p.moversLowMid[i].location.x, p.moversLowMid[i].location.y);
    }

    p.initializeVariables = function () {

        p.sensitivity = 100
        p.myColor = p.color(0, 0, 0);
        p.strokeWidth = 1
        p.highMidColor = p.color(5, 5, 5);
        p.lines = true;
        p.shapeMode = true;
        p.topspeed2 = 5;
        p.numberOfMovers = 50;
        p.moversLowMid = [];
        p.moversHighMid = [];
        p.strokeColor = p.color(5, 5, 5);
        let bgCol = "white";
        //myp5.changeBackgroundColor(bgCol);

    }

    p.initializeMovers = function () {
        //? Array of array of movers(?)

        //Use list and weight to bias the size of the movers (more small movers than large one)
        let list = [1, 2, 3, 4, 5];
        let weight = [0.3, 0.4, 0.1, 0.1, 0.1];
        //Make new attractor and movers orientated to canvas center
        p.a = new Attractor(p);
        for (let i = 0; i < 100; i++) {
            //  p.randomMass = p.floor(p.random(1,4));
            //  p.print(p.randomMass);
            p.moversLowMid[i] = new Mover(this, getRandomItem(list, weight), p.w / 2 + p.random(-10, 10), p.h / 2, p.myColor);
            //  p.moversLowMid[i] = new Mover(this, 1, p.w / 2 + p.random(-10, 10), p.h / 2, p.c);
            p.moversHighMid[i] = new Mover(this, 2, p.w / 2 + p.random(-10, 10), p.h / 2, p.highMidColor);
        }
    }

    p.getAudioInput = function () {
        //Audio input comes from the microphone
        p.mic;
        p.mic = new p5.AudioIn()
        p.mic.start();
        //FFT object analyzes the audio input
        p.fft = new p5.FFT();
        p.fft.setInput(p.mic);
        p.peakDetect = new p5.PeakDetect();
        p.peakDetect.update(p.fft);
        //    p.peakDetect.onPeak(p.triggerBeat);
    }

    p.getAudioInput2 = function () {
        //Audio input comes from the microphone
        // p.mic;
        //p.mic = new p5.AudioIn()
        // p.mic.start();
        //FFT object analyzes the audio input
        p.fft = new p5.FFT();
        p.fft.setInput(p.mySound);
        p.mySound.play();
        p.playingAudioFile = true;
    }

    p.changeBackgroundColor = function (bgCol_) {
        if (bgCol_ === "white") {
            p.backgroundColor = p.color(255, 255, 255, 5);
            p.strokeColor = p.color(0, 0, 0);
            return true;
        } else if (bgCol_ === "black") {
            p.backgroundColor = p.color(0, 0, 0, 5);
            p.strokeColor = p.color(255, 255, 255);
            return true;
        } else {
            p.backgroundColor = p.color(255, 255, 255, 5);
            p.strokeColor = p.color(0, 0, 0);
            return false;
        }
    }

    p.fadeBackground = function () {
        //Creating a gradual fade effect on the background by drawing a 100% width and height slightly transparent rectangle on top of the sketch
        p.noStroke();
        p.fill(p.backgroundColor);
        p.rect(0, 0, p.w, p.h);
    }

    p.analyzeAudio = function () {
        p.spectrum = p.fft.analyze();
        p.highMid = p.fft.getEnergy("highMid");
        p.lowMid = p.fft.getEnergy("lowMid");
        // p.treble = p.fft.getEnergy("treble");
        p.bass = p.fft.getEnergy("bass");
        // var mid = fft.getEnergy("mid");
        //Sensitivity value from slider mapped backwards to threshold so that the amplitude can be > threshold
        p.threshold = p.map(p.sensitivity, 30, 170, 170, 30);
    }

    p.drawBass = function () {
        //radius of center ellipse is mapped to the amplitude of the bass frequency
        p.bassMap = p.map(p.bass, 0, 255, 20, 500);
        p.bassStrokeWeight = p.map(p.bass, 0, 255, 0, 10);
        // var bassMap2 = map(bass, 0, 255, 5, 100);
        p.noFill();
        p.strokeWeight(p.bassStrokeWeight);
        p.stroke(p.strokeColor);
        p.ellipse(p.w / 2, p.h / 2, p.bassMap, p.bassMap);
        //fill(255);
        // ellipse(w / 2, h / 2, bassMap2, bassMap2);
    }


    p.attractMovers = function (movers_) {
        let movers = movers_;
        //   let i = i_;
        for (let i = 0; i < p.numberOfMovers; i++) {
            p.t = p.a.attract(movers[i]);
            p.t.normalize();
            p.t.mult(1);
            movers[i].applyForce(p.t);
        }
    }

    p.repelMovers = function (movers_, threshold_, frequencyRange_) {
        //Loop through the array of movers
        let movers = movers_;
        //  let i = i_;
        let threshold = threshold_
        let frequencyRange = frequencyRange_;
        for (let i = 0; i < p.numberOfMovers; i++) {
            if (frequencyRange > threshold) {
                p.t = p.a.repel(movers[i]);
                p.t.normalize();
                p.t.mult(1.05);
                movers[i].applyForce(p.t);
            }
        }
    }

    p.moveMovers = function (movers_, threshold_, frequencyRange_) {
        let threshold = threshold_;
        let movers = movers_;
        let frequencyRange = frequencyRange_;
        p.attractMovers(movers);
        p.repelMovers(movers, threshold, frequencyRange);
    }

    p.togglePlaying = function () {
        //Start Audio context on user gesture
        if (p.getAudioContext().state !== 'running') {
            p.userStartAudio();
        }
        if (p.playing == true) {
            p.playing = false;
            p.noLoop();
        } else {
            p.playing = true;
            p.loop();
        }
    }

    p.toggleLines = function () {
        if (this.checked()) {
            console.log('Checking!');
            p.lines = true;
        } else {
            p.lines = false;
            console.log('Unchecking!');
        }
    }

    p.capture = function () {
        //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
        let r = Math.random().toString(36).substring(7);
        let filename = `Audio-${r}.jpg`;
        //?Which is better
        p.saveCanvas(p.cnv, filename);
        // p.save('myCanvas.jpg');
    }

    p.windowResized = function (w_, h_) {
        if (!isNaN(w_) && !isNaN(h_)) {
            p.w = w_;
            p.h = h_;
        }
        else {
            p.w = 200;
            p.h = 200;
        }
        p.resizeCanvas(p.w, p.h);
        p.initializeMovers();
    }


    // https://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability// Weighted random number generation
    let rand = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    let getRandomItem = function (list, weight) {
        let total_weight = weight.reduce(function (prev, cur, i, arr) {
            return prev + cur;
        });

        let random_num = rand(0, total_weight);
        let weight_sum = 0;

        for (let i = 0; i < list.length; i++) {
            weight_sum += weight[i];
            weight_sum = +weight_sum.toFixed(2);

            if (random_num <= weight_sum) {
                return list[i];
            }
        }
        // end of function
    };
};



var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
p.changeBackgroundColor = function (bgCol_) {
    if (bgCol_ === "white") {
        p.backgroundColor = p.color(255, 255, 255, 5);
        p.strokeColor = p.color(0, 0, 0);
    } else if (bgCol_ === "black") {
        p.backgroundColor = p.color(0, 0, 0, 5);
        p.strokeColor = p.color(255, 255, 255);
    }
}
if (isMobile) {
    //alert("Mobile browser detected!");
    //Conditional script here
}
/*
$( document ).ready(function() {      
    var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

    if (isMobile) {
        alert("Mobile browser detected!");
        //Conditional script here
    }
 });
*/
//https://stackoverflow.com/questions/29209308/window-localstorage-setitem-not-working-on-mobile-phone
//So finally found the solution, I need to set webSettings.setDomStorageEnabled(true); on android code and after this localstorage is working perfectlly.
//webSettings.setDomStorageEnabled(true);

//autoOpen:false stops the confirmation dialog from appearing on page load
//$("#dialog-confirm").dialog({
//  autoOpen: false,
//});

//Get the height and width of the container so to set the canvas width and height 
let sketchContainer = document.getElementById('sketch-container');
let positionInfo = sketchContainer.getBoundingClientRect();
let containerHeight = positionInfo.height;
let containerWidth = positionInfo.width;
console.log("h:" + containerHeight);

//Enable popovers everywhere
$(function () {
    $('[data-toggle="popover"]').popover()
})

/*
//Popovers (doesn't work -conflict between jquery UI js and bootstrap js)
$(function () {
    $('[data-toggle="popover"]').popover()
})
$('.popover-dismiss').popover({
    trigger: 'focus'
})
*/

//Create sketch and attach it to #container div
var myp5 = new p5(sketch, document.getElementById("sketch-container"));

window.onload = function () {

    sketchContainer.addEventListener('click', play);

    function play() {
        let playButton = document.getElementById("play");
        if (myp5.playing) {
            playButton.style.display = "inline";
        } else {
            playButton.style.display = "none";
        }
        myp5.togglePlaying();
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    //New getUserMedia() request kills existing stream track
    //If your application grabs media streams from multiple getUserMedia()  requests, you are likely in for problems with iOS. From my testing, the issue can be summarized as follows: if getUserMedia()  requests a media type requested in a previous getUserMedia() , the previously requested media track’s muted  property is set to true, and there is no way to programmatically unmute it. Data will still be sent along a peer connection, but it’s not of much use to the other party with the track muted! This limitation is currently expected behavior on iOS. https://webrtchacks.com/guide-to-safari-webrtc/

    $(window).focus(function (e) {
        console.log("focused");
        myp5.getAudioInput();
    });

    function resizeCanvas() {
        let sketchContainer = document.getElementById('sketch-container');
        let positionInfo = sketchContainer.getBoundingClientRect();
        let containerHeight = positionInfo.height;
        let containerWidth = positionInfo.width;
        myp5.windowResized(containerWidth, containerHeight);
    }

    //Set sketch variables according to ui menu settings on load
    // myp5.myColor = $('#lowMidColor').val();
    //myp5.highMidColor = $('#highMidColorPicker').val();
    // myp5.strokeWidth = $("#stroke-weight-picker").val();
    // myp5.sensitivity = $('#sensitivity-slider').val();

    /////////Action buttons/////////
    //Settings button (Opens settings menu)
    $("#settings").on("click", function () {
        //   $("#toggler").toggle("slide", {}, 100);
        $("#toggler").toggle();
    });

    //Make settings menu draggable
    // $("#gui").draggable();

    //Camera button
    $("#camera").on("click", function () {

        myp5.capture();

    });

    //More information button
    $('#informationButton').on('click', function () {
        // let vis = record if settings menu was open when more information button was clicked.
        let vis = $("#toggler").is(":visible");
        let hid = $("#toggler").is(":hidden");
        //Show the modal
        if ($("#information-modal").is(":hidden")) {
            $('#information-modal').modal('show');
        }
        //Pause sketch while modal is showing.
        myp5.noLoop();
        //If settings menu was open, hide it.
        if (vis) {
            $("#toggler").hide();
        }
        $('#information-modal').on('hidden.bs.modal', function () {
            //if the settings menu was open when more information button was clicked, show it again.
            //?Always is true? Except the first time.
            if (vis && !hid) {
                $("#toggler").show();
            }
            //Play sketch when modal is closed.
            myp5.loop();
        });
    });

    //Settings button (Opens settings menu)
    $("#fullScreenButton").on("click", function () {
        //?On Android samsung internet browser launches into fullscreen when opened
        //https://davidwalsh.name/fullscreen
        function launchIntoFullscreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
        let sketchContainer = document.getElementById("sketch-container");
        launchIntoFullscreen(sketchContainer);
    });

    /////////Settings Menu//////////
    //For changing sketch variables 

    $("#close-settings").on("click", function () {
        $("#toggler").toggle("slide", {}, 100);
    });

    $("#audio-input-mode").on("click", function () {
        if (!myp5.playingAudioFile) {
            myp5.getAudioInput2();
        }
    });

    //Background Color radio
    $('input[type="radio"]').on('click change', function (e) {
        let bgCol = document.querySelector('input[name="backgroundColorRadio"]:checked').value;
        myp5.changeBackgroundColor(bgCol);
    });

    //Display lines checkbox
    document.getElementById("linesCheckbox").onchange = function () {
        if (this.checked) {
            myp5.lines = true;
        } else {
            myp5.lines = false;
        }
    }

    //Shape mode checkbox
    document.getElementById("shapeCheckbox").onchange = function () {
        if (this.checked == true) {
            myp5.shapeMode = true;
        } else {
            myp5.shapeMode = false;
        }
    }

    //To get the sensitivity value from the slider before input
    //  myp5.sensitivity = document.getElementById('sensitivity-slider').value;
    //Sensitivity slider
    let sensitivitySlider = document.getElementById("sensitivity-slider");
    sensitivitySlider.oninput = function () {
        myp5.sensitivity = this.value;
    }

    //To keep the movers moving
    // var intervalID = setInterval(randomizeSensitivity, 5000);
    /* let randomSensitivity = (function (sens_) {
         let min = 1;
         let max = 4;
         let sens = sens_
         let randomNumber = Math.floor(Math.random() * (max - min)) + min;
         let randomSensitivity_ = sens + randomNumber;
         console.log("r" + randomSensitivity_);
         return randomSensitivity_;
     })();
 
     let intervalID = setInterval(randomSensitivity, 5000, myp5.sensitivity);
 */

    //randomizeSensitivty to replicate moving the sensitivity slider, which seems to help if the movers get stuck.
    let intervalID = setInterval(randomizeSensitivity, 5000);
    function randomizeSensitivity() {
        let min = 1;
        let max = 5;
        let sens_ = myp5.sensitivty;
        let randomNumber = Math.floor(Math.random() * (max - min)) + min;
        let randomSensitivity = sens_ + randomNumber;
        myp5.sensitvity = randomSensitivity;
        // console.log("new sensitivity:" + myp5.sensitivity);
    }

    //Stroke Weight slider
    let SWslider = document.getElementById("stroke-weight-picker");
    SWslider.oninput = function () {
        myp5.strokeWidth = this.value;
    }

    //Low mid movers color picker
    let lowMidColor = document.getElementById("lowMidColor");
    lowMidColor.oninput = function () {
        myp5.myColor = this.value;
    }

    //High mid movers color picker
    let highMidColorPicker = document.getElementById("highMidColorPicker");
    highMidColorPicker.oninput = function () {
        myp5.highMidColor = this.value;
    }

    //Display high mid movers checkbox
    document.getElementById("highMidCheckbox").onchange = function () {
        if (this.checked == true) {
            myp5.displayHighMid = true;
        } else {
            myp5.displayHighMid = false;
        }
    }

    //Topspeed slider
    let topspeedSlider = document.getElementById("topspeed-slider");
    topspeedSlider.oninput = function () {
        myp5.topspeed2 = Math.floor(topspeedSlider.value);
    }
    //No. of movers
    let numMovers = document.getElementById("number-of-movers");
    numMovers.oninput = function () {
        myp5.numberOfMovers = Math.floor(numMovers.value);
    }

}

//? Doesn't seem to be working 
if ("onpagehide" in window) {
    // window.addEventListener("pageshow", myLoadHandler, false);
    window.addEventListener("pagehide", myUnloadHandler, false);
} else {
    // window.addEventListener("load", myLoadHandler, false);
    window.addEventListener("unload", myUnloadHandler, false);
    window.addEventListener("beforeunload", myUnloadHandler, false);
}

function myUnloadHandler(evt) {
    if (evt.persisted) {
        sessionStorage.removeItem('hideAlert2');
        return;
    }
    sessionStorage.removeItem('hideAlert2');

}
//Code from: https://stackoverflow.com/questions/9943220/how-to-delete-a-localstorage-item-when-the-browser-window-tab-is-closed#targetText=Using%20vanilla%20JavaScript%20you%20could,the%20close%20window%2Ftab%20action.
//when browser closed - remove local storage item from image save dialog confirmation

$(window).on("unload", function (e) {
    // localStorage.removeItem('hideAlert2');
});

//https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}



/*

    p.attractMovers2 = function (movers_, i_) {
        let movers = movers_;
        let i = i_;
        p.t = p.a.attract(movers[i]);
        p.t.normalize();
        p.t.mult(0.9);
        movers[i].applyForce(p.t);

    }

    p.repelMovers2 = function (movers_, i_, threshold_, frequencyRange_) {
        //Loop through the array of movers
        let movers = movers_;
        let i = i_;
        let threshold = threshold_
        let frequencyRange = frequencyRange_;

        if (frequencyRange > threshold) {
            p.t = p.a.repel(movers[i]);
            p.t.normalize();
            p.t.mult(1.1);
            movers[i].applyForce(p.t);
        }

    }

     p.moveMovers2 = function (movers_, i_, threshold_, frequencyRange_) {
        let i = i_;
        let t= threshold_
        let m= movers_;
       let fr = frequencyRange_;
        //Loop through the array of movers
        p.attractMovers2(p.moversLowMid, i);
        p.repelMovers2(p.moversLowMid, i, t,fr);
    }
*/