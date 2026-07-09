function updateStats(text) {
    const charCount = document.getElementById("charCount");
    const wordCount = document.getElementById("wordCount");

    const characters = text.length;

    const words = text.trim()
        ? text.trim().split(/\s+/).length
        : 0;

    charCount.textContent = `Characters: ${characters}`;
    wordCount.textContent = `Words: ${words}`;
}