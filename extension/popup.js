function handleMessage(request) {
  if (request.action === "downloadMarkdown") {
    const markdownContent = request.text;
    downloadMarkdown(markdownContent);
  }
}

function downloadMarkdown(content) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "extracted-text.md";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

document.getElementById("extract-code").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["/contentScript.js"],
  });
  chrome.runtime.onMessage.addListener(handleMessage);
});

document.getElementById("extract-text").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["/allcontentScript.js"],
  });
  chrome.runtime.onMessage.addListener(handleMessage);
});
