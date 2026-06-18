import React, { useState, useRef, useEffect } from 'react';

const Calculator = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [newNumber, setNewNumber] = useState(true);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState([]);
  const [isScientificMode, setIsScientificMode] = useState(true);
  const [angleMode, setAngleMode] = useState('DEG'); // DEG, RAD, GRAD
  const [isSecondFunction, setIsSecondFunction] = useState(false);
  const [constants, setConstants] = useState({
    pi: Math.PI,
    e: Math.E,
    phi: 1.618033988749895,
    c: 299792458, // speed of light
    g: 9.80665, // gravity
  });
  
  // Draggable state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const initialPos = useRef({ x: 0, y: 0 });

  // Handle drag start
  const handleDragStart = (e) => {
    if (e.target.closest('button')) return;
    
    if (e.type === 'mousedown' && e.button === 0) {
      setIsDragging(true);
      initialPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
    else if (e.type === 'touchstart') {
      setIsDragging(true);
      const touch = e.touches[0];
      initialPos.current = {
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      };
      e.preventDefault();
    }
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (!isDragging) return;

    let clientX, clientY;
    
    if (e.type === 'mousemove') {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.type === 'touchmove') {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
      e.preventDefault();
    }

    const newX = clientX - initialPos.current.x;
    const newY = clientY - initialPos.current.y;

    const calculatorWidth = dragRef.current?.offsetWidth || 420;
    const calculatorHeight = dragRef.current?.offsetHeight || 650;
    const maxX = window.innerWidth - calculatorWidth;
    const maxY = window.innerHeight - calculatorHeight;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  // Center calculator on mount
  useEffect(() => {
    const calculatorWidth = 420;
    const calculatorHeight = 650;
    const centerX = (window.innerWidth - calculatorWidth) / 2;
    const centerY = (window.innerHeight - calculatorHeight) / 2;
    setPosition({ x: centerX, y: centerY });
  }, []);

  // Basic operations
  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(num.toString());
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num.toString() : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op) => {
    const currentValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(result.toString());
      setPreviousValue(result);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (prev, current, op) => {
    let result;
    switch (op) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = current !== 0 ? prev / current : 0;
        break;
      case '^':
        result = Math.pow(prev, current);
        break;
      case '%':
        result = (prev * current) / 100;
        break;
      case 'mod':
        result = prev % current;
        break;
      case 'nPr':
        result = permutation(prev, current);
        break;
      case 'nCr':
        result = combination(prev, current);
        break;
      default:
        result = current;
    }
    
    const calculation = `${prev} ${op} ${current} = ${result}`;
    setHistory(prevHistory => [calculation, ...prevHistory.slice(0, 4)]);
    
    return result;
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(result.toString());
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  // Memory functions
  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleMemoryRecall = () => {
    setDisplay(memory.toString());
    setNewNumber(true);
  };

  const handleMemoryAdd = () => {
    const currentValue = parseFloat(display);
    setMemory(prev => prev + currentValue);
  };

  const handleMemorySubtract = () => {
    const currentValue = parseFloat(display);
    setMemory(prev => prev - currentValue);
  };

  // Angle conversion
  const convertAngle = (value) => {
    switch (angleMode) {
      case 'DEG':
        return value * (Math.PI / 180);
      case 'GRAD':
        return value * (Math.PI / 200);
      case 'RAD':
        return value;
      default:
        return value;
    }
  };

  // Scientific functions with angle mode support
  const handleScientificFunction = (func) => {
    const currentValue = parseFloat(display);
    let result;
    
    if (isSecondFunction) {
      // Second functions
      switch (func) {
        case 'sin':
          result = Math.asin(currentValue) * (angleMode === 'DEG' ? 180/Math.PI : angleMode === 'GRAD' ? 200/Math.PI : 1);
          break;
        case 'cos':
          result = Math.acos(currentValue) * (angleMode === 'DEG' ? 180/Math.PI : angleMode === 'GRAD' ? 200/Math.PI : 1);
          break;
        case 'tan':
          result = Math.atan(currentValue) * (angleMode === 'DEG' ? 180/Math.PI : angleMode === 'GRAD' ? 200/Math.PI : 1);
          break;
        case 'log':
          result = Math.pow(10, currentValue);
          break;
        case 'ln':
          result = Math.exp(currentValue);
          break;
        case 'sqrt':
          result = Math.pow(currentValue, 2);
          break;
        case 'square':
          result = Math.sqrt(currentValue);
          break;
        case 'cube':
          result = Math.cbrt(currentValue);
          break;
        case '10x':
          result = Math.pow(10, currentValue);
          break;
        case 'ex':
          result = Math.exp(currentValue);
          break;
        case 'sinh':
          result = Math.asinh(currentValue);
          break;
        case 'cosh':
          result = Math.acosh(currentValue);
          break;
        case 'tanh':
          result = Math.atanh(currentValue);
          break;
        case 'x3':
          result = Math.cbrt(currentValue);
          break;
        case 'x2':
          result = Math.sqrt(currentValue);
          break;
        default:
          result = currentValue;
      }
    } else {
      // First functions
      switch (func) {
        case 'sin':
          result = Math.sin(convertAngle(currentValue));
          break;
        case 'cos':
          result = Math.cos(convertAngle(currentValue));
          break;
        case 'tan':
          result = Math.tan(convertAngle(currentValue));
          break;
        case 'sinh':
          result = Math.sinh(currentValue);
          break;
        case 'cosh':
          result = Math.cosh(currentValue);
          break;
        case 'tanh':
          result = Math.tanh(currentValue);
          break;
        case 'log':
          result = Math.log10(currentValue);
          break;
        case 'ln':
          result = Math.log(currentValue);
          break;
        case 'sqrt':
          result = Math.sqrt(currentValue);
          break;
        case 'square':
          result = Math.pow(currentValue, 2);
          break;
        case 'cube':
          result = Math.pow(currentValue, 3);
          break;
        case '10x':
          result = Math.pow(10, currentValue);
          break;
        case 'ex':
          result = Math.exp(currentValue);
          break;
        case 'abs':
          result = Math.abs(currentValue);
          break;
        case 'floor':
          result = Math.floor(currentValue);
          break;
        case 'ceil':
          result = Math.ceil(currentValue);
          break;
        case 'round':
          result = Math.round(currentValue);
          break;
        case 'rand':
          result = Math.random();
          break;
        case 'factorial':
          result = factorial(currentValue);
          break;
        case 'reciprocal':
          result = 1 / currentValue;
          break;
        case 'negate':
          result = -currentValue;
          break;
        case 'pi':
          result = constants.pi;
          break;
        case 'e':
          result = constants.e;
          break;
        case 'phi':
          result = constants.phi;
          break;
        case 'degrees':
          result = currentValue * (180 / Math.PI);
          break;
        case 'radians':
          result = currentValue * (Math.PI / 180);
          break;
        case 'gradians':
          result = currentValue * (200 / 180);
          break;
        case 'exp':
          result = currentValue * Math.pow(10, display.includes('e') ? display.split('e')[1] || 0 : 0);
          break;
        case 'EE':
          result = currentValue;
          setDisplay(currentValue + 'e');
          setNewNumber(false);
          return;
        default:
          result = currentValue;
      }
    }
    
    if (!isNaN(result)) {
      setDisplay(result.toString());
      setNewNumber(true);
    }
  };

  // Mathematical functions
  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const permutation = (n, r) => {
    if (n < r || n < 0 || r < 0) return NaN;
    return factorial(n) / factorial(n - r);
  };

  const combination = (n, r) => {
    if (n < r || n < 0 || r < 0) return NaN;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
    setIsSecondFunction(false);
  };

  const handleClearEntry = () => {
    setDisplay('0');
    setNewNumber(true);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setNewNumber(true);
    }
  };

  const handlePercentage = () => {
    const currentValue = parseFloat(display);
    setDisplay((currentValue / 100).toString());
    setNewNumber(true);
  };

  const handleConstant = (constantName) => {
    const value = constants[constantName];
    setDisplay(value.toString());
    setNewNumber(true);
  };

  // Button component
  const Button = ({ children, onClick, className = '', span = false, title = '', secondFunction = null }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg font-bold text-xs md:text-sm transition-all duration-200 hover:scale-105 active:scale-95 relative ${className} ${
        span ? 'col-span-2' : ''
      } ${secondFunction ? 'flex flex-col items-center justify-center h-16' : ''}`}
    >
      {secondFunction ? (
        <>
          <div className="text-[10px] opacity-70 mb-1">{secondFunction}</div>
          <div className="text-base">{children}</div>
        </>
      ) : (
        children
      )}
    </button>
  );

  return (
    <div 
      ref={dragRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `scale(${isDragging ? 0.98 : 1})`,
        transition: isDragging ? 'none' : 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: isDragging 
          ? '0 30px 60px rgba(0, 0, 0, 0.5)' 
          : '0 20px 50px rgba(0, 0, 0, 0.4)',
        zIndex: 9999,
        userSelect: 'none',
      }}
      className="bg-gray-900 rounded-2xl shadow-2xl border-2 border-blue-500 w-[420px] p-4 touch-none"
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 cursor-move draggable-header">
        <div className="flex items-center gap-2 flex-1" onMouseDown={handleDragStart} onTouchStart={handleDragStart}>
          <div className="text-white text-lg cursor-move opacity-70">
            ☰
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧪</span>
            Kalkulator Saintifik
            <span className={`text-xs px-2 py-1 rounded ${isSecondFunction ? 'bg-yellow-600' : 'bg-purple-600'}`}>
              {isSecondFunction ? '2nd' : angleMode}
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSecondFunction(!isSecondFunction)}
            className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
              isSecondFunction 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
            title="Fungsi Kedua"
          >
            2nd
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 transition-colors text-2xl font-bold hover:scale-110 active:scale-95"
            title="Tutup"
          >
            ×
          </button>
        </div>
      </div>

      {/* Display */}
      <div className="bg-gray-950 rounded-lg p-4 mb-4 border-2 border-gray-700">
        <div className="text-right">
          {/* Status indicators */}
          <div className="flex justify-between text-xs mb-1">
            <div className="flex gap-2">
              <span className="text-blue-400">M: {memory.toExponential(4)}</span>
              <span className="text-purple-400">{angleMode}</span>
              {isSecondFunction && <span className="text-yellow-400">2nd</span>}
            </div>
            <div className="text-gray-400">
              {previousValue !== null ? `${previousValue.toExponential(4)} ${operation || ''}` : ''}
            </div>
          </div>
          <div className="text-white text-3xl font-mono font-bold overflow-x-auto whitespace-nowrap">
            {display.length > 15 ? parseFloat(display).toExponential(8) : display}
          </div>
          {/* History */}
          {history.length > 0 && (
            <div className="text-gray-500 text-xs mt-2 text-left border-t border-gray-700 pt-2">
              {history[0]}
            </div>
          )}
        </div>
      </div>

      {/* Mode and Angle Selection */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <Button onClick={() => setAngleMode('DEG')} className={`${angleMode === 'DEG' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-gray-600 text-white`} title="Darjah">
          DEG
        </Button>
        <Button onClick={() => setAngleMode('RAD')} className={`${angleMode === 'RAD' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-gray-600 text-white`} title="Radian">
          RAD
        </Button>
        <Button onClick={() => setAngleMode('GRAD')} className={`${angleMode === 'GRAD' ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-gray-600 text-white`} title="Gradian">
          GRAD
        </Button>
        <Button onClick={() => handleConstant('pi')} className="bg-purple-700 hover:bg-purple-600 text-white" title="Pi">
          π
        </Button>
      </div>

      {/* Memory buttons */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <Button onClick={handleMemoryClear} className="bg-gray-700 hover:bg-gray-600 text-white" title="Memory Clear">
          MC
        </Button>
        <Button onClick={handleMemoryRecall} className="bg-gray-700 hover:bg-gray-600 text-white" title="Memory Recall">
          MR
        </Button>
        <Button onClick={handleMemoryAdd} className="bg-gray-700 hover:bg-gray-600 text-white" title="Memory Add">
          M+
        </Button>
        <Button onClick={handleMemorySubtract} className="bg-gray-700 hover:bg-gray-600 text-white" title="Memory Subtract">
          M-
        </Button>
      </div>

      {/* Scientific functions - Row 1 */}
      <div className="grid grid-cols-5 gap-2 mb-2">
        <Button 
          onClick={() => handleScientificFunction('sin')} 
          className="bg-purple-700 hover:bg-purple-600 text-white" 
          title="Sinus / Sinus songsang"
          secondFunction={isSecondFunction ? "sin⁻¹" : "sin"}
        >
          {isSecondFunction ? "sin⁻¹" : "sin"}
        </Button>
        <Button 
          onClick={() => handleScientificFunction('cos')} 
          className="bg-purple-700 hover:bg-purple-600 text-white" 
          title="Kosinus / Kosinus songsang"
          secondFunction={isSecondFunction ? "cos⁻¹" : "cos"}
        >
          {isSecondFunction ? "cos⁻¹" : "cos"}
        </Button>
        <Button 
          onClick={() => handleScientificFunction('tan')} 
          className="bg-purple-700 hover:bg-purple-600 text-white" 
          title="Tangen / Tangen songsang"
          secondFunction={isSecondFunction ? "tan⁻¹" : "tan"}
        >
          {isSecondFunction ? "tan⁻¹" : "tan"}
        </Button>
        <Button 
          onClick={() => handleScientificFunction('log')} 
          className="bg-purple-700 hover:bg-purple-600 text-white" 
          title="Logaritma / 10ˣ"
          secondFunction={isSecondFunction ? "10ˣ" : "log"}
        >
          {isSecondFunction ? "10ˣ" : "log"}
        </Button>
        <Button 
          onClick={() => handleScientificFunction('ln')} 
          className="bg-purple-700 hover:bg-purple-600 text-white" 
          title="Logaritma semula jadi / eˣ"
          secondFunction={isSecondFunction ? "eˣ" : "ln"}
        >
          {isSecondFunction ? "eˣ" : "ln"}
        </Button>
      </div>

      {/* Scientific functions - Row 2 */}
      <div className="grid grid-cols-5 gap-2 mb-2">
        <Button 
          onClick={() => handleScientificFunction('sinh')} 
          className="bg-purple-700 hover:bg-purple-600 text-white" 
          title="Sinus hiperbolik / Sinus hiperbolik songsang"
          secondFunction={isSecondFunction ? "sinh⁻¹" : "sinh"}
        >
          {isSecondFunction ? "sinh⁻¹" : "sinh"}
        </Button>
        <Button 
          onClick={() => handleScientificFunction('cosh')} 
          className="bg-purple-700 hover:bg-purple-600 text-white" 
          title="Kosinus hiperbolik / Kosinus hiperbolik songsang"
          secondFunction={isSecondFunction ? "cosh⁻¹" : "cosh"}
        >
          {isSecondFunction ? "cosh⁻¹" : "cosh"}
        </Button>
        <Button 
          onClick={() => handleScientificFunction('tanh')} 
          className="bg-purple-700 hover:bg-purple-600 text-white" 
          title="Tangen hiperbolik / Tangen hiperbolik songsang"
          secondFunction={isSecondFunction ? "tanh⁻¹" : "tanh"}
        >
          {isSecondFunction ? "tanh⁻¹" : "tanh"}
        </Button>
        <Button 
          onClick={() => handleScientificFunction('sqrt')} 
          className="bg-purple-700 hover:bg-purple-600 text-white" 
          title="Punca kuasa dua / Kuasa dua"
          secondFunction={isSecondFunction ? "x²" : "√x"}
        >
          {isSecondFunction ? "x²" : "√x"}
        </Button>
        <Button 
          onClick={() => handleScientificFunction('cube')} 
          className="bg-purple-700 hover:bg-purple-600 text-white" 
          title="Kuasa tiga / Punca kuasa tiga"
          secondFunction={isSecondFunction ? "∛x" : "x³"}
        >
          {isSecondFunction ? "∛x" : "x³"}
        </Button>
      </div>

      {/* Scientific functions - Row 3 */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        <Button onClick={() => handleScientificFunction('factorial')} className="bg-purple-700 hover:bg-purple-600 text-white" title="Faktorial">
          n!
        </Button>
        <Button onClick={() => handleScientificFunction('reciprocal')} className="bg-purple-700 hover:bg-purple-600 text-white" title="Salingan">
          1/x
        </Button>
        <Button onClick={() => handleScientificFunction('abs')} className="bg-purple-700 hover:bg-purple-600 text-white" title="Nilai mutlak">
          |x|
        </Button>
        <Button onClick={() => handleConstant('e')} className="bg-purple-700 hover:bg-purple-600 text-white" title="Pemalar Euler">
          e
        </Button>
        <Button onClick={() => handleConstant('phi')} className="bg-purple-700 hover:bg-purple-600 text-white" title="Nisbah Emas">
          φ
        </Button>
      </div>

      {/* Main calculator buttons */}
      <div className="grid grid-cols-5 gap-2 mb-2">
        <Button onClick={handleClear} className="bg-red-600 hover:bg-red-700 text-white" title="Clear All">
          AC
        </Button>
        <Button onClick={handleClearEntry} className="bg-red-500 hover:bg-red-600 text-white" title="Clear Entry">
          CE
        </Button>
        <Button onClick={handleBackspace} className="bg-orange-600 hover:bg-orange-700 text-white" title="Backspace">
          ⌫
        </Button>
        <Button onClick={() => handleOperation('÷')} className="bg-blue-600 hover:bg-blue-700 text-white" title="Bahagi">
          ÷
        </Button>
        <Button onClick={() => handleOperation('mod')} className="bg-blue-600 hover:bg-blue-700 text-white" title="Modulus">
          mod
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-2">
        <Button onClick={() => handleScientificFunction('floor')} className="bg-gray-700 hover:bg-gray-600 text-white" title="Bawah">
          floor
        </Button>
        <Button onClick={() => handleNumber(7)} className="bg-gray-700 hover:bg-gray-600 text-white">
          7
        </Button>
        <Button onClick={() => handleNumber(8)} className="bg-gray-700 hover:bg-gray-600 text-white">
          8
        </Button>
        <Button onClick={() => handleNumber(9)} className="bg-gray-700 hover:bg-gray-600 text-white">
          9
        </Button>
        <Button onClick={() => handleOperation('×')} className="bg-blue-600 hover:bg-blue-700 text-white" title="Darab">
          ×
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-2">
        <Button onClick={() => handleScientificFunction('ceil')} className="bg-gray-700 hover:bg-gray-600 text-white" title="Atas">
          ceil
        </Button>
        <Button onClick={() => handleNumber(4)} className="bg-gray-700 hover:bg-gray-600 text-white">
          4
        </Button>
        <Button onClick={() => handleNumber(5)} className="bg-gray-700 hover:bg-gray-600 text-white">
          5
        </Button>
        <Button onClick={() => handleNumber(6)} className="bg-gray-700 hover:bg-gray-600 text-white">
          6
        </Button>
        <Button onClick={() => handleOperation('-')} className="bg-blue-600 hover:bg-blue-700 text-white" title="Tolak">
          -
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-2">
        <Button onClick={() => handleScientificFunction('round')} className="bg-gray-700 hover:bg-gray-600 text-white" title="Bundar">
          round
        </Button>
        <Button onClick={() => handleNumber(1)} className="bg-gray-700 hover:bg-gray-600 text-white">
          1
        </Button>
        <Button onClick={() => handleNumber(2)} className="bg-gray-700 hover:bg-gray-600 text-white">
          2
        </Button>
        <Button onClick={() => handleNumber(3)} className="bg-gray-700 hover:bg-gray-600 text-white">
          3
        </Button>
        <Button onClick={() => handleOperation('+')} className="bg-blue-600 hover:bg-blue-700 text-white" title="Tambah">
          +
        </Button>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-3">
        <Button onClick={() => handleScientificFunction('rand')} className="bg-gray-700 hover:bg-gray-600 text-white" title="Nombor rawak">
          RAND
        </Button>
        <Button onClick={() => handleScientificFunction('negate')} className="bg-gray-700 hover:bg-gray-600 text-white" title="Negatif">
          ±
        </Button>
        <Button onClick={() => handleNumber(0)} className="bg-gray-700 hover:bg-gray-600 text-white">
          0
        </Button>
        <Button onClick={handleDecimal} className="bg-gray-700 hover:bg-gray-600 text-white" title="Titik perpuluhan">
          .
        </Button>
        <Button onClick={handleEquals} className="bg-green-600 hover:bg-green-700 text-white" title="Sama dengan">
          =
        </Button>
      </div>

      {/* Additional operations */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Button onClick={() => handleOperation('^')} className="bg-blue-700 hover:bg-blue-600 text-white" title="Kuasa">
          x^y
        </Button>
        <Button onClick={() => handleOperation('nPr')} className="bg-blue-700 hover:bg-blue-600 text-white" title="Permutasi">
          nPr
        </Button>
        <Button onClick={() => handleOperation('nCr')} className="bg-blue-700 hover:bg-blue-600 text-white" title="Kombinasi">
          nCr
        </Button>
      </div>

      {/* Info footer */}
      <div className="mt-4 text-center text-xs text-gray-400 flex flex-col gap-1">
        <div className="flex items-center justify-center gap-2">
          <span className="opacity-50">☰</span>
          <span>Seret untuk pindah • 2nd untuk fungsi songsang • Klik × untuk tutup</span>
          <span className="opacity-50">☰</span>
        </div>
        <div className="text-gray-500 grid grid-cols-3 gap-1 text-[10px]">
          <div>DEG/RAD/GRAD: Mod sudut</div>
          <div>2nd: Fungsi songsang</div>
          <div>AC: Padam semua</div>
        </div>
      </div>

      {/* Drag overlay indicator */}
      {isDragging && (
        <div className="absolute inset-0 border-2 border-dashed border-blue-400/50 rounded-2xl pointer-events-none" />
      )}

      <style jsx>{`
        .draggable-header:active {
          cursor: grabbing;
        }
        @media (max-width: 640px) {
          .draggable-header {
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default Calculator;