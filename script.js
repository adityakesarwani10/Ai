document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
    const chatContainer = document.getElementById("chat-container");

    // Enter key event
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendButton.click();
        }
    });

    sendButton.addEventListener("click", async function () {
        sendButton.classList.add("disabled");
        let userMessage = inputField.value.trim();
        if (userMessage === "") return;

        appendMessage(userMessage, "user");
        inputField.value = "";

        let botResponse = await generateResponse(userMessage);
        appendMessage(botResponse, "bot");
    });

    function appendMessage(message, sender) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.innerHTML = message;

        chatContainer.prepend(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        togglePlaceholder();
    }

    async function generateResponse(input) {
        try {
            const response = await fetch("https://ai-v050.onrender.com/receive", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userInput: input }),
            });

            const data = await response.json();

            if (data.response) {
                let formattedText = data.response
                    .replace(/\n/g, "<br>")
                    .replace(/([A-Z][a-z]+):/g, "<strong>$1:</strong>")
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace(/gemini/gi, "Aditya")
                    .replace(/google/gi, "Aditya");

                return formattedText;
            } else {
                return "No response received.";
            }
        } catch (error) {
            return "Check your Internet Connectivity.";
        }
    }

    function togglePlaceholder() {
        if (chatContainer.children.length === 0) {
            chatContainer.setAttribute("data-placeholder", "How can I help you...");
        } else {
            chatContainer.removeAttribute("data-placeholder");
        }
    }

    togglePlaceholder();
});
