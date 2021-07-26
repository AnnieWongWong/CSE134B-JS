window.addEventListener('DOMContentLoaded', init);

function init() {
    document.getElementById('alert_button2').addEventListener('click', send_alert2);
    document.getElementById('alert_ok').addEventListener('click', alertOk);
    document.getElementById('confirm_button2').addEventListener('click', send_confirm2);
    document.getElementById('confirm_ok').addEventListener('click', confirmOk);
    document.getElementById('confirm_cancel').addEventListener('click', confirmCancel);
    document.getElementById('prompt2').addEventListener('click', show_prompt2);
    document.getElementById('prompt_ok').addEventListener('click', promptOk);
    document.getElementById('prompt_cancel').addEventListener('click', promptCancel);
}

function send_alert2 () {
    let box;
    box = document.getElementById('alert_pop');
    box.showModal();
}

function alertOk() {
    let box;
    box = document.getElementById('alert_pop');
    box.close();
}

function send_confirm2 () {
    let box;
    box = document.getElementById('confirm_pop');
    box.showModal();
}

function confirmOk() {
    let box;
    box = document.getElementById('confirm_pop');
    document.getElementById('output2').textContent = 'The value returned by the confirm method is : true';
    box.close();
}

function confirmCancel() {
    let box;
    box = document.getElementById('confirm_pop');
    document.getElementById('output2').textContent = 'The value returned by the confirm method is : false';
    box.close();
}

function show_prompt2 () {
    let box;
    box = document.getElementById('prompt_pop');
    box.showModal();
}

function promptOk() {
    let box;
    box = document.getElementById('prompt_pop');
    let uname = document.getElementById('uname').value;
    

    if (uname) {
        let clean = DOMPurify.sanitize( uname , {USE_PROFILES: {html: true}} ); 
        document.querySelector('#prompttext2').innerHTML = `Prompt result : ${clean}`;
    }
    else {
        document.querySelector('#prompttext2').innerHTML = `Prompt result : User didn't enter anything`;
    }
    box.close();
}

function promptCancel() {
    let box;
    box = document.getElementById('prompt_pop');
    document.querySelector('#prompttext2').innerHTML = `Prompt result : User didn't enter anything`;
    box.close();
}


