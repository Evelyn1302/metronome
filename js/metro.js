/*
    Project 04
*/


let audio_context = null;           // is there any audio context?
let is_playing = false;             // is the metronome playing?

let current_note;                   // note to be handled by the metronome
let tempo = 60.0;                   // initial tempo

const schedule_interval = 25.0;     // how frequent to call the scheduling function, ms
const schedule_duration = 0.1;      // how far ahead to schedule audio, s

let next_note_time = 0.0;           // when to play the next note
let note_type = 2;                  // 0 = semi-quaver, 1 = quaver, 2 = crochet, 3 = triplets
let note_length = 0.05;             // duration of the "beep", s

let notes_in_queue = [];            // notes that have been put into the web audio, ,may or may not be played
let metronome_worker = null;        // the web worker used to fire timer messages


function _next_note(){
    let sec_per_beat = 60.0 / tempo;                // calculates the seconds per crochet beat

    switch (note_type){
        case 0:                                     // if semi-quaver
            next_note_time += 0.25 * sec_per_beat;
            current_note++;

            if (current_note >= 16){
                current_note = 0;                   //reset count to 0
            }
            break;
        
        case 1:                                     // if quaver
            next_note_time += 0.5 * sec_per_beat;
            current_note++;

            if (current_note >= 8){
                current_note = 0;                   //reset count to 0
            }
            break;

        case 2:                                     // if crochet
            next_note_time += sec_per_beat;
            current_note++;

            if (current_note >= 4){
                current_note = 0;                   //reset count to 0
            }
            break;

        case 3:                                     // if triplets
            next_note_time += sec_per_beat / 3;
            current_note++;

            if (current_note >= 12){
                current_note = 0;                   //reset count to 0
            }
            break;
    }
}

function _schedule_note(note_type, beat_number, time){
    //console.log(beat_number);
    notes_in_queue.push( {note: beat_number, time: time} );       // adds the details of the to be schduled note into array
    
    let osc = audio_context.createOscillator();
    osc.connect(audio_context.destination);

    if (beat_number == 0){                                        // first beat of the bar
        osc.frequency.value = 880.0;
    }
    else if ( (beat_number % 2 == 0) || (beat_number % 3 == 0) ){ // if is one of the "crochet" beat
        switch (note_type){
            case 0:                                               // if semi-quaver
                if (beat_number % 4 == 0){                        // if 4, 8, 12
                    osc.frequency.value = 440.0;
                }
                else{
                    osc.frequency.value = 220.0;
                }
                break;

            case 1:                                               // if quaver
                if (beat_number % 2 == 0){                        // if 2, 4, 6
                    osc.frequency.value = 440.0;
                }
                else{
                    osc.frequency.value = 220.0;
                }
                break;
            
            case 2:
                osc.frequency.value = 220.0;
                break;

            case 3:                                               // if triplets
                if (beat_number % 3 == 0){                        // if 3, 6, 9
                    osc.frequency.value = 440.0;
                }
                else{
                    osc.frequency.value = 220.0;
                }
                break;
        }
    }
    else{                                                         // other beats
        osc.frequency.value = 220.0;
    }

    osc.start(time);                        // starts beeping
    osc.stop(time + note_length);           // stops beeping
}

function _scheduler(){
    // while the next note is still within the current lookahead time
    while (next_note_time < audio_context.currentTime + schedule_duration){
        _schedule_note(note_type, current_note, next_note_time);            // schedule the note
        _next_note();                        // proceed to next note
    }
}

function _play(){
    if (audio_context == null){
        audio_context = new AudioContext();
        let buffer = audio_context.createBuffer(1, 1, 22050);       // mono, 1 sample, 22050 Hz sampling rate
        let node = audio_context.createBufferSource();
        node.buffer = buffer;
        node.start(0);

        is_playing = true;                                          // change pause to play
        current_note = 0;                                           // set the beat number to the first beat
        next_note_time = audio_context.currentTime;
        metronome_worker.postMessage("start");                      // start the web clock
    }
}

function _pause(){
    is_playing = false;
    metronome_worker.postMessage("stop");
    audio_context = null;
}

function _init(){
    metronome_worker = new Worker("metro_worker.js");

    metronome_worker.onmessage = function(web_clock) {
        if (web_clock.data == "tick"){                              // if the metronome is started
            _scheduler();
        }
        else{
            console.log("state: " + web_clock.data);
        }
    };

    metronome_worker.postMessage( {"schedule_interval": schedule_interval});
}

window.addEventListener("load", _init);