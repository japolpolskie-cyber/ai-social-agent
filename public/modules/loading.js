function startLoading() {
    const generateBtn = document.getElementById("generateBtn");

    generateBtn.disabled = true;
    generateBtn.innerHTML =
        '<span>Generating content</span><span class="button-spinner" aria-hidden="true"></span>';
}

function stopLoading() {
    const generateBtn = document.getElementById("generateBtn");

    generateBtn.disabled = false;
    generateBtn.innerHTML =
        '<span>Generate content</span><span class="button-arrow" aria-hidden="true">→</span>';
}
