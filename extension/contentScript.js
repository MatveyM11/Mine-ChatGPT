function extractText() {
  const divs = document.querySelectorAll("div.markdown.prose.w-full.break-words.dark\\:prose-invert.light");

  let extractedText = "";

  divs.forEach((div, index) => {
    const codeBlocks = div.querySelectorAll("div.p-4.overflow-y-auto");

    if (codeBlocks.length) {
      extractedText += `### ${index + 1}\n\n`;

      codeBlocks.forEach((codeBlock) => {
        extractedText += `${processCodeContainer(codeBlock)}`;
      });

      extractedText += "\n";
    }
  });

  return extractedText;
}

function processCodeContainer(container) {
  const languageElement = container.querySelector("code[class*='language-'], code[class*='lang-']");
  const language = languageElement ? languageElement.className.split("-").pop() : "unknown";
  const codeContentElement = container.querySelector("code");
  const codeContent = codeContentElement ? codeContentElement.textContent.trim() : "";

  console.log("Language:", language);
  console.log("Code content:", codeContent);

  if (codeContent) {
    return `\`\`\`${language}\n${codeContent.replace("Copy code", "").trim()}\n\`\`\`\n\n`;
  }

  return "";
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
