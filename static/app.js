// Create a class called ChatBox 
class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'), // Find the element with class chatbox__button and assigns to openButton
            chatBox: document.querySelector('.chatbox__support'), // Find the element class chatbox__support and assigns to chatBox
            sendButton: document.querySelector('.send__button') // Find the class send__button and assigns to sendButton
        }

        // Initialise a boolean property to false, this represents whether the chatbox is closed or open
        this.state = false;
        // Create an array to store chat messages
        this.messages = [];

        // Check if the chatbox is initially closed and open it if necessary
        if (this.args.chatBox.classList.contains('closed')) {
            this.toggleState(this.args.chatBox);
        }
    }

    // method to display chatbot's UI and event listeners
    display() {
        const { openButton, chatBox, sendButton } = this.args;

        // Display the chatbox immediately upon page load
        this.toggleState(chatBox);

        // Send greeting message to server upon page load
        fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: JSON.stringify({ message: 'greeting' }), // Sending a special message for greeting
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(r => r.json())
            .then(r => {
                let greetingMsg = { name: "Aurora", message: r.answer };
                this.messages.push(greetingMsg);
                this.updateChatText(chatBox);
            })
            .catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatBox);
            });

        openButton.addEventListener('click', () => this.toggleState(chatBox)); // toggles chatbot state

        sendButton.addEventListener('click', () => this.onSendButton(chatBox)); // triggers onSendButton method

        const node = chatBox.querySelector('input'); // Find the input element and assigns it to node
        node.addEventListener("keyup", ({ key }) => { // check if the key "Enter" was pressed
            if (key === "Enter") {
                this.onSendButton(chatBox); // if yes, onSendButton method is activated.
            }
        });

        // Find all elements with the class menu_buttons and assigns them to menuButtons
        const menuButtons = document.querySelectorAll('.menu__button');
        menuButtons.forEach(button => {
            button.addEventListener('click', () => { // add a click event to each button
                const message = button.textContent.trim(); // Get the text of the button
                this.onButtonClick(chatBox, message); // Pass the button text to onSendButton
            });
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hide the box
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox, message = '') {
        var textField = chatbox.querySelector('input'); // find the input message and assigns to textField
        let text1 = textField.value; // gets the value of textField and assigns to text1

        // If a message is provided, use it; otherwise, use the text from the input field
        let textToSend = message !== '' ? message : text1;

        if (textToSend === "") {
            return;
        }

        // Show typing indicator
        this.showTypingIndicator();

        let msg1 = { name: "User", message: textToSend };
        this.messages.push(msg1);

        // Simulate delay for demonstration purposes (replace this with actual sending logic)
        setTimeout(() => {
            // Send a POST request to the server with textToSend as the body
            fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    body: JSON.stringify({ message: textToSend }), // convert the object to a JSON string
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then(r => r.json()) // wait for response, then parse it as a JSON
                .then(r => {
                    let msg2 = { name: "Aurora", message: r.answer };
                    this.messages.push(msg2);
                    this.updateChatText(chatbox);
                    textField.value = '';

                    // Hide typing indicator
                    this.hideTypingIndicator();
                }).catch((error) => {
                    console.error('Error:', error);
                    this.updateChatText(chatbox);
                    textField.value = '';

                    // Hide typing indicator
                    this.hideTypingIndicator();
                });
        }, 500); // Adjust the delay time as needed (2 seconds in this example)
    }

    // Function to show typing indicator
    showTypingIndicator() {
        document.querySelector('.typing-indicator').style.display = 'block';
    }

    // Function to hide typing indicator
    hideTypingIndicator() {
        document.querySelector('.typing-indicator').style.display = 'none';
    }

    // Handle button clicks 
    onButtonClick(chatbox, message) {
        var textField = chatbox.querySelector('input');
        textField.value = message; // Set the button text as input value
        this.onSendButton(chatbox, message); // Trigger sending the message
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Aurora") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }

    openChatboxIfClosed() {
        // Check if the chatbox is closed
        if (this.args.chatBox.classList.contains('closed')) {
            // Remove the 'closed' class to open the chatbox
            this.args.chatBox.classList.remove('closed');
        }
        // Always toggle the state to ensure consistency
        this.toggleState(this.args.chatBox);
    }

}

// Function to send message to the chatbot
function sendMessageToChatbot(message) {
    // Find the chatbox element
    const chatbox = document.querySelector('.chatbox');
    // Check if the chatbox is closed
    if (chatbox.classList.contains('closed')) {
        // Toggle the 'closed' class to open the chatbox
        chatbox.classList.toggle('closed');
    }
    // Find the input field in the chatbot footer
    const inputField = document.querySelector('.chatbox__footer input[type="text"]');
    // Set the value of the input field to the message
    inputField.value = message;
    // Find the send button and click it to send the message
    const sendButton = document.querySelector('.chatbox__send--footer');
    sendButton.click();
}

// Create an instance of the Chatbox class and display the chatbox
const chatbox = new Chatbox();
chatbox.display();

// Add an event listener to the first card to open the chatbox if it is closed
document.querySelector('.card-content .card:first-child .button').addEventListener('click', () => {
    chatbox.openChatboxIfClosed();
    // Send a message to the chatbot when the card is clicked
    sendMessageToChatbot("What is a GP?");
});

// JavaScript code to remove suggestions on smaller screens
function removeSuggestionsOnSmallScreens() {
    const chatbox = document.querySelector('.chatbox');
    const servicesInfo = document.querySelector('.chatbox__services-info');

    if (window.innerWidth <= 768) { // Adjust the screen size threshold as needed
        chatbox.classList.remove('chatbox--active');
        servicesInfo.remove(); // Remove the suggestion questions
    }
}