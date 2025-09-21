document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const buttons = document.querySelector('.buttons'); // Make sure you wrap all <button> inside a container with class="buttons"

  let currentInput = '0';
  let previousInput = '';
  let operator = null;
  let waitingForSecondOperand = false;
  let memory = 0;
  let angleMode = 'deg'; // 'deg' or 'rad'

  function updateDisplay() {
    display.textContent = currentInput;
  }

  function appendNumber(number) {
    if (currentInput === 'Error') currentInput = '0';

    if (waitingForSecondOperand) {
      currentInput = number;
      waitingForSecondOperand = false;
    } else {
      if (currentInput === '0' && number !== '.') {
        currentInput = number;
      } else if (number === '.' && currentInput.includes('.')) {
        return; // prevent multiple dots
      } else {
        currentInput += number;
      }
    }
    updateDisplay();
  }

  function chooseOperator(op) {
    if (operator && waitingForSecondOperand) {
      operator = op;
      return;
    }
    if (previousInput !== '') {
      calculate();
    }
    operator = op;
    previousInput = currentInput;
    waitingForSecondOperand = true;
  }

  function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '/': result = current === 0 ? 'Error' : prev / current; break;
      case '^': result = Math.pow(prev, current); break;
      default: return;
    }

    currentInput = result.toString();
    operator = null;
    previousInput = '';
    waitingForSecondOperand = true;
    updateDisplay();
  }

  function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
  }

  function deleteLast() {
    currentInput = currentInput.slice(0, -1) || '0';
    updateDisplay();
  }

  function applyScientificFunction(func) {
    if (currentInput === 'Error') { clearAll(); return; }

    let value = parseFloat(currentInput);
    if (isNaN(value)) return;
    let result;

    const angle = angleMode === 'deg' ? value * (Math.PI / 180) : value;

    switch (func) {
      case 'sin': result = Math.sin(angle); break;
      case 'cos': result = Math.cos(angle); break;
      case 'tan': result = Math.tan(angle); break;
      case 'log': result = Math.log10(value); break;
      case 'ln': result = Math.log(value); break;
      case 'sqrt': result = value < 0 ? 'Error' : Math.sqrt(value); break;
      case 'fact':
        if (value < 0 || !Number.isInteger(value) || value > 170) { // 170! is near JS limit
          result = 'Error';
        } else {
          let fact = 1;
          for (let i = 2; i <= value; i++) fact *= i;
          result = fact;
        }
        break;
      case 'neg': result = -value; break;
      case 'ten_pow': result = Math.pow(10, value); break;
      case 'exp': result = Math.exp(value); break;
      default: return;
    }

    currentInput = result.toString();
    updateDisplay();
    waitingForSecondOperand = true;
  }

  function handleMemoryFunction(func) {
    let value = parseFloat(currentInput);
    if (isNaN(value) && func !== 'mr') return;

    switch (func) {
      case 'mc': memory = 0; break;
      case 'mr': currentInput = memory.toString(); break;
      case 'm_plus': memory += value; break;
      case 'm_minus': memory -= value; break;
      default: return;
    }

    updateDisplay();
    waitingForSecondOperand = true;
  }

  // ✅ Button click handler
  buttons.addEventListener('click', (e) => {
    const target = e.target;
    if (!target.matches('button')) return;

    const value = target.dataset.value;

    if (target.classList.contains('number') || value === '.') {
      appendNumber(value);
    } else if (target.classList.contains('operator')) {
      if (value === '=') {
        calculate();
      } else if (value === 'neg') {
        applyScientificFunction(value);
      } else {
        chooseOperator(value);
      }
    } else if (target.classList.contains('function')) {
      if (value === 'pi' || value === 'e') {
        const constant = (value === 'pi' ? Math.PI : Math.E).toString();
        currentInput = constant;
        waitingForSecondOperand = false;
        updateDisplay();
      } else if (value === 'rad') {
        angleMode = 'rad';
        target.classList.add('active-angle-mode');
        document.querySelector('.btn[data-value="deg"]')?.classList.remove('active-angle-mode');
      } else if (value === 'deg') {
        angleMode = 'deg';
        target.classList.add('active-angle-mode');
        document.querySelector('.btn[data-value="rad"]')?.classList.remove('active-angle-mode');
      } else {
        applyScientificFunction(value);
      }
    } else if (target.classList.contains('clear') && value === 'ac') {
      clearAll();
    } else if (target.classList.contains('delete') && value === 'del') {
      deleteLast();
    } else if (target.classList.contains('memory')) {
      handleMemoryFunction(value);
    }
  });

  // Default mode
  document.querySelector('.btn[data-value="deg"]')?.classList.add('active-angle-mode');
  updateDisplay();
});
        
