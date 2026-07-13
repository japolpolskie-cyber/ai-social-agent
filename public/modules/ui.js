function showOutput(text) {
    const output = document.getElementById("output");
    output.textContent = text;
}

function showWaiting() {
    showOutput("Your generated content will appear here.");
}

function showLoading() {
    showOutput("Generating your content...");
}

function showError(message) {
    showOutput(message || "Something went wrong.");
}
