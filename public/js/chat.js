const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('#sendTxt');
const $messageFormButton = $messageForm.querySelector('#sendBtn');

const $userForm = document.querySelector('#user-form');
const $userFormButton = $userForm.querySelector('#userBtn');
const $userFormInput = $messageForm.querySelector('#userTxt');

const $messages = document.querySelector('#messages');
const $content = document.querySelector('#content');
const $footer = document.querySelector('#footer');
const $greet = document.querySelector('#greet');
const $sticky = $footer.offsetBottom;

const createMessage = (elementIdName, messageTxt, elementToAppend) => {
    element = document.createElement('p');
    element.setAttribute('id', elementIdName);
    msgTxt = document.createTextNode(messageTxt);
    element.appendChild(msgTxt);
    elementToAppend.appendChild(element);
};

const switchToMessageForm = () => {
    $userFormButton.setAttribute('disabled', 'disabled');
    $userForm.style.display = 'none';
    $greet.style.display = 'block';
    $messageForm.style.display = 'block';
    $messages.style.display = 'block';
};

const enableMessageFormBack = () => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();
};

$userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    switchToMessageForm();
    socket.emit('createUser', username, (error) => {});
})

socket.on('message', (message) => {
    createMessage('newMessage', message, $messages);
})

socket.on('sysMessage', (message) => {
    createMessage('sysMessage', message, $messages);
})

socket.on('welcomeMessage', (message) => {
    createMessage('sysMessage', message, $messageForm);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        enableMessageFormBack();
        if (error) {
            return console.log(error);
        }
    })
})

document.body.addEventListener('DOMSubtreeModified', function () {window.scrollTo(0, document.body.scrollHeight);}, false);

function stickyFooter() {
    if (window.pageYOffset > $sticky) {
        $footer.classList.add("sticky");
    } else {
        $footer.classList.remove("sticky");
    }
}

window.onscroll = function() {stickyFooter()};