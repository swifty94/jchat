const socket = io()
// Elements

// Forms
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('#sendTxt');
const $messageFormButton = $messageForm.querySelector('#sendBtn');

const $userForm = document.querySelector('#user-form');
const $userFormButton = $userForm.querySelector('#userBtn');
const $userFormInput = $messageForm.querySelector('#userTxt');

const $messages = document.querySelector('#messages');
const $content = document.querySelector('#content');
const $footer = document.querySelector('#footer');
const sticky = $footer.offsetBottom

$userForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $userFormButton.setAttribute('disabled', 'disabled')
    const username = e.target.elements.username.value;
    $userForm.style.display = 'none';
    $messageForm.style.display = 'block';
    socket.emit('createUser', username, (error) => {
        // $userFormButton.removeAttribute('disabled');
        // $userFormInput.value = '';
    })
    window.localStorage.setItem('user', username);
    console.log(`UserCreated ${username} and saved to local storage`)
})

socket.on('message', (message) => {
    element = document.createElement('pre')
    element.setAttribute('id', 'newMessage')
    msgTxt = document.createTextNode(`[${localStorage.getItem("user")}] `+message)
    element.appendChild(msgTxt)
    $messages.appendChild(element)
})

socket.on('welcomeMessage', (message) => {
    element = document.createElement('p');
    element.setAttribute('id', 'welcomeMessage');
    msgTxt = document.createTextNode(message)
    element.appendChild(msgTxt);
    $messageForm.appendChild(element);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!', message)
    })
})

// Sticky footer stuff
document.body.addEventListener('DOMSubtreeModified', function () {
    window.scrollTo(0, document.body.scrollHeight);
}, false);

window.onscroll = function() {stickyFooter()};

function stickyFooter() {
    if (window.pageYOffset > sticky) {
        $footer.classList.add("sticky");
    } else {
        $footer.classList.remove("sticky");
    }
}
