function startLoading() {
    const generateBtn = document.getElementById("generateBtn");

    generateBtn.disabled = true;
    generateBtn.textContent = "🤖 Generating...";
}

function stopLoading() {
    const generateBtn = document.getElementById("generateBtn");

    generateBtn.disabled = false;
    generateBtn.textContent = "✨ Generate";
}