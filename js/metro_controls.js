/*
    Project 04
*/


const play_button = document.getElementById("play");
const pause_button = document.getElementById("pause");

const minus_one_button = document.getElementById("minus_one");
const minus_five_button = document.getElementById("minus_five");
const plus_one_button = document.getElementById("plus_one");
const plus_five_button = document.getElementById("plus_five");

const tempo_number = document.getElementById("tempo_number");
const note_selection = document.getElementById("note_selection");

play_button.addEventListener("click", () => {
    _play();
});

pause_button.addEventListener("click", () => {
    _pause();
});

minus_one_button.addEventListener("click", () => {
    if (tempo > 30.0){
        tempo -= 1.0;
        tempo_number.innerText = Math.floor(tempo);
    }
});

minus_five_button.addEventListener("click", () => {
    if (tempo >= 35.0){
        tempo -= 5.0;
        tempo_number.innerText = Math.floor(tempo);
    }
});

plus_one_button.addEventListener("click", () => {
    if (tempo < 180.0){
        tempo += 1.0;
        tempo_number.innerText = Math.floor(tempo);
    }
});

plus_five_button.addEventListener("click", () => {
    if (tempo <= 175.0){
        tempo += 5.0;
        tempo_number.innerText = Math.floor(tempo);
    }
});

note_selection.addEventListener("click", () => {
    switch(note_type){
        case 0:
            note_type = 1;
            note_selection.innerText = "Quaver";
            break;
        
        case 1:
            note_type = 2;
            note_selection.innerText = "Crochet";
            break;
        
        case 2:
            note_type = 3;
            note_selection.innerText = "Triplets";
            break;

        case 3:
            note_type = 0;
            note_selection.innerText = "Semi-Quaver";
            break;
    }
});