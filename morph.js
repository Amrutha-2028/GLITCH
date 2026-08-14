/* =========================================================
   GLITCH — PAGE CODE MORPH
   ========================================================= */

function randomSymbol() {
  const characters =
    "01{}[]<>/\\|*$#@%+=-_~^!?ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return characters[
    Math.floor(Math.random() * characters.length)
  ];
}

function createGlitchString(length) {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += randomSymbol();
  }

  return result;
}

function morphPageTitle() {
  const title = document.querySelector(".code-title");

  if (!title) return;

  const textElement = title.querySelector(".code-title-text");
  const finalText = title.dataset.final;

  if (!textElement || !finalText) return;

  let frame = 0;

  const totalFrames = 18;

  textElement.classList.add("morphing");

  const interval = setInterval(() => {
    const progress = frame / totalFrames;

    let output = "";

    for (let i = 0; i < finalText.length; i++) {
      if (progress > i / finalText.length) {
        output += finalText[i];
      } else {
        output += randomSymbol();
      }
    }

    textElement.textContent = output;

    frame++;

    if (frame > totalFrames) {
      clearInterval(interval);

      textElement.textContent = finalText;

      textElement.classList.remove("morphing");
      textElement.classList.add("resolved");

      setTimeout(() => {
        textElement.classList.remove("resolved");
      }, 700);
    }
  }, 55);
}

document.addEventListener("DOMContentLoaded", () => {
  morphPageTitle();
});