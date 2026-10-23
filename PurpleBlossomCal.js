const display = document.getElementById("result");
const buttons = document.querySelectorAll(".glass-btn");
const sparkleLayer = document.getElementById("sparkle-layer");

let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function inputNumber(number) {
  if (shouldResetDisplay) {
    currentInput = number;
    shouldResetDisplay = false;
  } else if (currentInput === "0") {
    currentInput = number;
  } else {
    currentInput += number;
  }

  updateDisplay();
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentInput = "0";
    shouldResetDisplay = false;
  }

  if(!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

function clearCalculator() {
  currentInput = "0";
  previousInput = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function toggleSign() {
  if (currentInput !== "0") {
    currentInput = String(parseFloat(currentInput) * -1);
  }

  updateDisplay();
}

function calculatePercent() {
  currentInput = String(parseFloat(currentInput) / 100);
  updateDisplay();
}

function chooseOperator(selectOperator) {
  if (operator !==null && !shouldResetDisplay) {
    calculateResult();
  }

  previousInput = currentInput;
  operator = selectOperator;
  shouldResetDisplay = true;
}

function calculateResult() {
  if(operator === null || previousInput === null) {
    return;
  }

  const previous = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  let result;

  switch (operator) {
    case "add":
      result = previous + current;
      break; 
    case "subtract":
      result = previous - current;
      break;
    case "multiply":
      result = previous * current;
      break;
    case "divide":
      result = current === 0 ? "Error" : previous / current;
      break;
  }

  currentInput = String(result);
  previousInput = null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function createSparkles(button) {
  const buttonRect = button.getBoundingClientRect();
  const layerRect = sparkleLayer.getBoundingClientRect();

  const centerX = buttonRect.left - layerRect.left
  + buttonRect.width / 2;
  const centerY = buttonRect.top - layerRect.top 
  +buttonRect.height / 2;

  const symbols = ["♡", "♥︎","◇","◆","☆","★"]; 

  for(let i = 0; i < 6; i++) {
   const sparkle = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 40;

    sparkle.className = "sparkle";
    sparkle.textContent = symbols[
      Math.floor(Math.random() * symbols.length)
    ];
    sparkle.style.left = centerX + "px";
    sparkle.style.top = centerY + "px";

    sparkle.style.setProperty(
      "--x", Math.cos(angle) * distance + "px"
    );
    sparkle.style.setProperty(
      "--y", Math.sin(angle) * distance + "px"
    );
    sparkleLayer.appendChild(sparkle);

    sparkle.addEventListener("animationend", () => {
      sparkle.remove();
    });
  }
}

function animateButton(button) {
  button.classList.remove("pressed");
  void button.offfsetWidth;
  button.classList.add("pressed");

  createSparkles(button);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;
    const action = button.dataset.action;

    animateButton(button);

    if (number !== undefined) {
      inputNumber(number);
      return;
    }

    switch (action) {
        case"clear": 
        clearCalculator();
        break;

      case "sign":
        toggleSign();
        break;

      case "percent":
        calculatePercent();
        break;

        case"decimal":
        inputDecimal();
        break;

        case"add":
        case"subtract":
        case"multiply":
        case"divide":
        chooseOperator(action);
        break;

        case"equals":
        calculateResult();
        break;
    }
  });
});

updateDisplay();