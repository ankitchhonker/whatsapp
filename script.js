const chatMessages = document.getElementById("chat-messages");
const chatHeader = document.getElementById("chat-header");
const contacts = document.querySelectorAll(".contact");
const sidebar = document.getElementById("sidebar");
const chatWindow = document.getElementById("chat-window");
const chatName = document.querySelector(".chat-name");
const backBtn = document.getElementById("back-btn");

let activeChat = "Punit"; 
let chatHistory = {Namita: [], Rajat: [], Nitesh: [], Aman: [] };

// Switch contacts
contacts.forEach(contact => {
  contact.addEventListener("click", () => {
    contacts.forEach(c => c.classList.remove("active"));
    contact.classList.add("active");
    activeChat = contact.dataset.name;

    // Update header image + name
    const contactImg = contact.querySelector("img").getAttribute("src");
    chatHeader.querySelector("img").src = contactImg;
    chatName.textContent = activeChat;

    renderMessages();

    // Mobile: show chat, hide sidebar
    if(window.innerWidth <= 768){
      chatWindow.classList.add("show");
      sidebar.classList.add("hide");
    }
  });
});

// Back button for mobile
backBtn.addEventListener("click", () => {
  chatWindow.classList.remove("show");
  sidebar.classList.remove("hide");
});

// Render messages
function renderMessages() {
  chatMessages.innerHTML = "";
  chatHistory[activeChat].forEach(msg => {
    const div = document.createElement("div");
    div.classList.add("message");
    div.classList.add(msg.sender);
    div.textContent = msg.text;
    chatMessages.appendChild(div);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
async function send() {
  const msgInput = document.getElementById("msg");
  const text = msgInput.value.trim();
  if (!text) return;

  // Add user's message
  chatHistory[activeChat].push({ sender: "user", text });
  renderMessages();
  msgInput.value = "";

  if (activeChat === "Punit") {
    // Call Gemini API
    try {
      const res = await fetch("/chat", { // your backend route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      chatHistory[activeChat].push({ sender: "bot", text: data.reply });
      renderMessages();

    } catch (err) {
      chatHistory[activeChat].push({ sender: "bot", text: "Error: Could not reach Gemini AI" });
      renderMessages();
    }
  } else {
    // Hardcoded auto-reply for other contacts
    const randomReplies = ["Hi!", "How are you?", "Nice to meet you!", "😊"];
    const reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
    setTimeout(() => {
      chatHistory[activeChat].push({ sender: "bot", text: reply });
      renderMessages();
    }, 500);
  }
}


// Initialize header
window.addEventListener("load", () => {
  const activeContact = document.querySelector(".contact.active");
  if(activeContact) {
    const contactImg = activeContact.querySelector("img").getAttribute("src");
    chatHeader.querySelector("img").src = contactImg;
  }
});
