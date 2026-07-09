async function copyText(text) {
    if (!text.trim()) return false;

    await navigator.clipboard.writeText(text);

    return true;
}