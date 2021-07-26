window.addEventListener('DOMContentLoaded', init);

let postList = [];

function init() {
    document.getElementById('alert_button').addEventListener('click', send_alert);
    document.getElementById('confirm_button').addEventListener('click', send_confirmation);
    document.getElementById('prompt').addEventListener('click', show_prompt);
    document.getElementById('safer_prompt').addEventListener('click', safer_show_prompt);
}

function send_alert () {
    alert('Hello');
}

function send_confirmation () {
    let co;
    co = confirm('Press confirm');

    document.querySelector('output').innerHTML = `The value returned by the confirm method is : ${co}`;
}

function show_prompt() {
    let uname = prompt('What is your name',"");

    if (uname) {
        document.querySelector('#prompttext').innerHTML = `Prompt result : ${uname}`;
    }
    else {
        document.querySelector('#prompttext').innerHTML = `Prompt result : User didn't enter anything`;
    }
}

function safer_show_prompt() {
    let uname = prompt('What is your name',"");

    if (uname) {
        let clean = DOMPurify.sanitize( uname , {USE_PROFILES: {html: true}} ); 
        document.querySelector('#prompttext').innerHTML = `Prompt result : ${clean}`;
    }
    else {
        document.querySelector('#prompttext').innerHTML = `Prompt result : User didn't enter anything`;
    }
}





