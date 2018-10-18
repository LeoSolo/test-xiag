'use strict';

const URL = 'http://localhost:3000/';

let LONG_URL = '';
let HASH = '';

const btn = document.getElementById('btn');
const longUrlInput = document.getElementById('longUrlInput');
const answerSpan = document.getElementById('answer');

btn.addEventListener('click', () => {
    LONG_URL = longUrlInput.value;
    validate();
});

function validate() {
    const regular = new RegExp('^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+$');
    if (regular.test(LONG_URL)) {
        errorHandler();
        createHash();
    } else {
        errorHandler(true);
    }
}

function errorHandler(isError) {
    answerSpan.classList = 'alert';
    isError ? (
        longUrlInput.classList.add('error'),
            answerSpan.classList.add('alert-danger'),
            answerSpan.innerHTML = 'Unable to create short URL'
    ) : (
        longUrlInput.classList.remove('error'),
            answerSpan.classList.add('alert-status'),
            answerSpan.innerHTML = 'Loading...'
    )
}

function createHash() {
    HASH = Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5);
    sendRequest();
}

// server

function sendRequest() {
    fetch( URL, {
        method: 'POST',
        headers: {},
        body: JSON.stringify({
            longUrl : LONG_URL,
            hash: HASH
        })
    })
        .then(function(data) {
            answerSpan.classList = 'alert';
            answerSpan.classList.add('alert-success');
            answerSpan.innerHTML = data.statusText;
        })
        .catch(function(error) {
            answerSpan.classList = 'alert';
            answerSpan.classList.add('alert-danger');
            answerSpan.innerHTML = 'Request failed :(';
        })
}