function showOutput(text) {
    const output = document.getElementById("output");
    output.textContent = text;
}

function showWaiting() {
    showOutput("Waiting...");
}

function showLoading() {
    showOutput("🤖 Gemini is thinking...");
}

function showError(message) {
    showOutput(message || "Something went wrong.");
}