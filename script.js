const display = document.getElementById('display');
const keys = document.querySelector('.calculator-keys');

let firstOperand = null;
let secondOperand = false; // Tracks if an operation is pending
let operator = null;
let displayValue = '0';

// Function to update the display screen
function updateDisplay() {
    display.value = displayValue;
}
updateDisplay();

// Handles number and decimal point input
function inputDigit(digit) {
    if (secondOperand === true) {
        displayValue = digit;
        secondOperand = false;
    } else {
        // Prevent multiple leading zeros, but allow '0.'
        if (displayValue === '0' && digit !== '.') {
            displayValue = digit;
        } else {
            displayValue = displayValue + digit;
        }
    }
}

// Handles the decimal point
function inputDecimal(dot) {
    // If the displayValue does not contain a decimal point
    if (!displayValue.includes(dot)) {
        inputDigit(dot);
    }
}

// Handles operator input (+, -, *, /)
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (operator && secondOperand) {
        // Allows changing the operator before entering the second number
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = performCalculation[operator](firstOperand, inputValue);

        // Limit to 8 decimal places for cleaner display
        displayValue = String(Math.round(result * 100000000) / 100000000);
        firstOperand = parseFloat(displayValue);
    }

    secondOperand = true;
    operator = nextOperator;
}

// Arithmetic functions
const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand
};

// Resets all calculator state
function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    secondOperand = false;
    operator = null;
}

// Event listener for button clicks
keys.addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }
    
    // Handles the '=' sign
    if (target.classList.contains('equal-sign')) {
        // If there's a pending operator, execute calculation
        if (operator) {
            handleOperator(operator); // Use the current operator to finish the calculation
            operator = null; // Clear the operator after calculation
        }
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});


// *** BONUS: ADD KEYBOARD SUPPORT ***

document.addEventListener('keydown', (event) => {
    // Check for number keys (0-9)
    if (event.key >= '0' && event.key <= '9') {
        inputDigit(event.key);
        updateDisplay();
    } 
    // Check for operators (+, -, *, /)
    else if (['+', '-', '*', '/'].includes(event.key)) {
        handleOperator(event.key);
        updateDisplay();
    } 
    // Check for decimal
    else if (event.key === '.') {
        inputDecimal('.');
        updateDisplay();
    }
    // Check for Enter or = for equals
    else if (event.key === 'Enter' || event.key === '=') {
        // Prevent 'Enter' from submitting a form if the calculator was inside one
        event.preventDefault(); 
        if (operator) {
            handleOperator(operator);
            operator = null;
        }
        updateDisplay();
    }
    // Check for Backspace (Clear one digit, not full reset)
    else if (event.key === 'Backspace') {
        displayValue = displayValue.slice(0, -1) || '0';
        updateDisplay();
    }
    // Check for 'c' or 'C' for clear/reset
    else if (event.key.toLowerCase() === 'c' || event.key === 'Delete') {
        resetCalculator();
        updateDisplay();
    }
});
                      
