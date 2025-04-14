document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
    const chatContainer = document.getElementById("chat-container");

    // ✅ Add event listener for "Enter" keypress
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission
            sendButton.click(); // Trigger button click programmatically
        }
    });

    sendButton.addEventListener("click", async function () {
        sendButton.classList.add("disabled");
        let userMessage = inputField.value.trim();
        if (userMessage === "") return;

        // Append User Message (Right Side)
        appendMessage(userMessage, "user");

        // Clear input field
        inputField.value = "";

        // Wait for bot response
        let botResponse = await generateResponse(userMessage);

        // Append Bot Message (Left Side)
        appendMessage(botResponse, "bot");
    });

    function appendMessage(message, sender) {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.innerHTML = message;
    
        // ✅ Add messages at the top
        chatContainer.prepend(messageDiv);
    
        // ✅ Scroll to keep the latest message at the bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    
        // ✅ Hide placeholder when messages exist
        togglePlaceholder();
    }
    

    async function generateResponse(input) {
        try {
            const response = await fetch("http://localhost:5000/receive", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userInput: input }),
            });

            const data = await response.json();
            console.log("Server Response:", data);

            if (data.response) {
                // Formatting bot response
                let formattedText = data.response
                    .replace(/\n/g, "<br>")
                    .replace(/([A-Z][a-z]+):/g, "<strong>$1:</strong>")
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace("gemini", "Aditya")
                    .replace("Gemini", "Aditya")
                    .replace("google", "Aditya")
                    .replace("Google", "Aditya");

                return formattedText;
            } else {
                return "No response received.";
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            return "Check your Internet Connectivity.";
        }
    }

    function togglePlaceholder() {
        if (chatContainer.children.length === 0) {
            chatContainer.setAttribute("data-placeholder", "Who can I help you...");
        } else {
            chatContainer.removeAttribute("data-placeholder");
        }
    }

    // ✅ Call initially on page load
    togglePlaceholder();
});
