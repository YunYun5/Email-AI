// Function to handle the addition of new elements
function handleReplyElementClick(element) {
  if (element.matches('span.ams.bkH[role="link"]')) {
    element.addEventListener("click", () => {
      // const emailBody = document.querySelector('div[role="list"]').innerHTML;
      // const emailBody = document.querySelector('div[data-message-id^="#msg-f:"]').innerText;
      const emailBody = document.querySelector("div.a3s.aiL").innerText;
      const sender = document.querySelector("div.gE.iv.gt").innerText;
      console.log("Sender: " + sender + "\nBody: " + emailBody);
      // Open ai api call
      setTimeout(function () {
        updateMessageBody(emailBody);
      }, 2000);
    });
  }
}

function handleSendElementClick(element) {
  // T-I J-J5-Ji aoO v7 T-I-atl L3
  if (element.matches('div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3[role="button"]')) {
    const sendButton = document.querySelector(
      "div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3"
    );
    sendButton.addEventListener("mouseenter", function () {
      console.log("Hovering over Send button");
      // Hide the suggestion box when hovering over the Send button
      const suggestionBox = document.querySelector("#suggestion");
      if (suggestionBox) {
        suggestionBox.style.display = "none";
      }
    });

    sendButton.addEventListener("mouseleave", function () {
      console.log("Mouse left the Send button");
      // Optionally show the suggestion box again when not hovering
      const suggestionBox = document.querySelector("#suggestion");
      if (suggestionBox) {
        suggestionBox.style.display = "block";
      }
    });
  }
}

// Observer callback to process mutations
const observerCallback = (mutationsList, observer) => {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList" && mutation.addedNodes.length) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if it is an element node
          // dont think we need this
          // handleNewElement(node);

          // Check if there are nested elements to be considered
          node
            .querySelectorAll('span.ams.bkH[role="link"]')
            .forEach(handleReplyElementClick);

          node
            .querySelectorAll(
              'div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3[role="button"]'
            )
            .forEach(handleSendElementClick);
        }
      });
    }
  }
};

// Set up the observer
const observer = new MutationObserver(observerCallback);
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

function updateMessageBody(text) {
  if (!document.querySelector("#suggestion")) {
    const composeBox = document.querySelector('div[role="textbox"]');
    const suggestionBox = document.createElement("div");
    suggestionBox.id = "suggestion";
    suggestionBox.style.color = "grey";
    suggestionBox.style.position = "absolute";
    suggestionBox.style.pointerEvents = "none";
    suggestionBox.innerText = text;
    suggestionBox.style.display = "block";

    if (composeBox) {
      composeBox.appendChild(suggestionBox);
      // console.log(suggestionBox.clientHeight);
      // console.log(suggestionBox.getBoundingClientRect().height);

      // const suggestionBoxHeight = "214.5px";
      const suggestionBoxHeight =
        suggestionBox.getBoundingClientRect().height.toString() + "px";

      // Increase the size of the compose box
      document.querySelector(".aO8").style.height = suggestionBoxHeight;
      composeBox.style.minHeight = suggestionBoxHeight;
      composeBox.style.width = suggestionBox.style.width;

      // Add event listner for completion
      attachEventListeners(composeBox, suggestionBox, text);
    }
  }
}

function attachEventListeners(composeBox, suggestionBox, fullText) {
  composeBox.addEventListener("input", function () {
    const typedText = composeBox.innerText;
    if (fullText.startsWith(typedText)) {
      suggestionBox.innerText = fullText.slice(typedText.length);
    } else {
      suggestionBox.style.display = "none";
    }
  });

  composeBox.addEventListener("keydown", function (event) {
    if (event.key === "Tab" && suggestionBox.style.display !== "none") {
      event.preventDefault(); // Stop the tab from doing its default actions
      composeBox.innerText = suggestionBox.innerText;
      suggestionBox.style.display = "none";
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(composeBox);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });
}
