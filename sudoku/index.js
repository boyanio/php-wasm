(() => {
  function createSudokuMatrix(sudokuInput) {
    const matrixEl = document.getElementById("matrix");
    const width = 9;
    const height = 9;
    const cellSize = 50;
    const matrixElBorder = 3;

    for (let r = 0; r < width; r++) {
      for (let c = 0; c < height; c++) {
        const cellEl = document.createElement("div");
        const cellId = (r * width) + c;
        cellEl.id = `cell_${cellId}`;
        cellEl.className = "cell";
        cellEl.style.width = `${cellSize}px`;
        cellEl.style.height = `${cellSize}px`;
        cellEl.style.lineHeight = `${cellSize}px`;

        const cellValue = sudokuInput[cellId];
        if (cellValue !== '0') {
          cellEl.innerText = cellValue;
        }

        if ((r + 1) % 3 === 0) {
          cellEl.style.borderBottomWidth = '3px';
        }
        if ((c + 1) % 3 === 0) {
          cellEl.style.borderRightWidth = '3px';
        }
  
        matrixEl.appendChild(cellEl);
      }
    }

    const matrixElWidth = width * cellSize + matrixElBorder;
    matrixEl.style.width = `${matrixElWidth}px`;

    const matrixContainerEl = document.getElementById("matrix-container");
    const matrixContainerElWidth = matrixContainerEl.clientWidth;
    const matrixElLeft = (matrixContainerElWidth - matrixElWidth) / 2;
    matrixEl.style.left = `${matrixElLeft}px`;

    const matrixElHeight = height * cellSize + matrixElBorder;
    matrixContainerEl.style.height = `${matrixElHeight + 30}px`;
  }

  function colorCell(cellId, color) {
    const { red, green, blue } = color;
    const cellEl = document.getElementById(`cell_${cellId}`);
    cellEl.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
  }

  async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  }

  async function solveUsingPurePhp() {
    const sudokuInput = "000200500640008000000100709006007003800030006300800100403002000000500017007009000";
    const response = await postData('sudoku-php.php', { input: sudokuInput });
    
    const status = `Solved in ${response.time}`;
    document.getElementById('solveUsingPurePhpStatus').innerText = status;
  }

  async function solveUsingWebAssembly() {
    const sudokuInput = "000200500640008000000100709006007003800030006300800100403002000000500017007009000";
    const response = await postData('sudoku-wasm.php', { input: sudokuInput });
    
    const status = `Solved in ${response.time}`;
    document.getElementById('solveUsingWebAssemblyStatus').innerText = status;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const parseUrlParam = (urlParam, defaultValue) => {
    const value = parseInt(urlParams.get(urlParam), 10);
    return isNaN(value) || value <= 0 ? defaultValue : value;
  };

  document.getElementById('solveUsingPurePhpBtn').addEventListener('click', solveUsingPurePhp);
  document.getElementById('solveUsingWebAssemblyBtn').addEventListener('click', solveUsingWebAssembly);

  const sudokuInput = "000200500640008000000100709006007003800030006300800100403002000000500017007009000";
  createSudokuMatrix(sudokuInput);

})();
