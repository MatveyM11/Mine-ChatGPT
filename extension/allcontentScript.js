function extractText() {
  const divs = document.querySelectorAll("div");
  const blocks = Array.from(divs).filter((div) =>
    div.classList.contains("min-h-[20px]") &&
    div.classList.contains("flex") &&
    div.classList.contains("flex-col") &&
    div.classList.contains("items-start") &&
    div.classList.contains("gap-4") &&
    div.classList.contains("whitespace-pre-wrap")
  );

  let extractedText = "";
  blocks.forEach((block, index) => {
    extractedText += `### ${index + 1}\n\n${block.textContent.trim()}\n\n`;
  });

  return extractedText;
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

chrome.runtime.sendMessage({ action: "downloadMarkdown", text: extractText() });
