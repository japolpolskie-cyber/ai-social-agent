// ======================================================
// AI Social Agent
// Frontend v0.9
// ======================================================

const API_ENDPOINT = "/ai/generate";

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

const output = document.getElementById("output");

generateBtn.addEventListener("click", generateContent);
copyBtn.addEventListener("click", handleCopy);
clearBtn.addEventListener("click", handleClear);

// ======================================================
// Generate Content
// ======================================================

async function generateContent() {
    const payload = getFormPayload();

    if (!payload.topic) {
        showToast("⚠️ Please enter a topic");
        return;
    }

    setGeneratingState(true);
    showLoading();
    updateStats("");
    startLoading();

    try {
        const data = await generateAIContent(payload);

        if (!data.success) {
            throw new Error(data.error || "Generation failed.");
        }

        showOutput(data.output);
        updateStats(data.output);
        showToast("✅ Content generated");
    } catch (err) {
        showError(err.message || "Something went wrong.");
        showToast("❌ Something went wrong");
    } finally {
        stopLoading();
        setGeneratingState(false);
    }
}

// ======================================================
// API
// ======================================================

async function generateAIContent(payload) {
    const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Server error.");
    }

    return data;
}

// ======================================================
// Form
// ======================================================

function getFormPayload() {
    return {
        topic: getInputValue("topicInput"),
        platform: getInputValue("platformInput"),
        type: getInputValue("typeInput"),
        tone: getInputValue("toneInput"),
        audience: getInputValue("audienceInput")
    };
}

function getInputValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
}

// ======================================================
// Buttons
// ======================================================

async function handleCopy() {
    const text = output.textContent.trim();

    if (!text || text.includes("Your generated content will appear here")) {
        showToast("⚠️ Nothing to copy");
        return;
    }

    const copied = await copyText(text);

    if (copied) {
        showToast("✅ Copied to clipboard");
    } else {
        showToast("❌ Copy failed");
    }
}

function handleClear() {
    showWaiting();
    updateStats("");
    showToast("🗑 Output cleared");
}

function setGeneratingState(isGenerating) {
    generateBtn.disabled = isGenerating;
    generateBtn.textContent = isGenerating ? "Generating..." : "Generate";
}

// ======================================================
// Clipboard
// ======================================================

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error("Clipboard error:", err);
        return false;
    }
}