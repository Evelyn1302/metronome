/*
    Project 04
*/


let timer_id = null;
let interval = 25;

self.onmessage = function(web_clock){
    if (web_clock.data == "start"){
        timer_id = setInterval(function(){              // sends "tick" message every 25 ms
            postMessage("tick");
        }, interval)
    }
    else if (web_clock.data.schedule_interval){
        if (timer_id){
            clearInterval(timer_id);
            timer_id = setInterval(function(){
                postMessage("tick");
            }, interval)
        }
    }
    else if (web_clock.data == "stop"){
        clearInterval(timer_id);                        // clears timer id, to stop 'web clock'
        timer_id = null;
    }
};