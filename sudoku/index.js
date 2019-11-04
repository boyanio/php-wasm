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

  function fillSolution(solution, type) {
    for (let i = 0; i < solution.length; i++) {
      const cellEl = document.getElementById(`cell_${i}`);
      if (cellEl.innerHTML === '' || cellEl.innerHTML.indexOf('span') >= 0) {
        cellEl.innerHTML += `<span class="${type}">${solution[i]}</span>`;
      }
    }
  }

  async function postData(url, data) {
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

  async function solveUsingPurePhp(event, sudokuInput) {
    const response = await postData('service/sudoku-solve-php.php', { input: sudokuInput });
    
    const status = `Solved in ${response.time}`;
    document.getElementById('solveUsingPurePhpStatus').innerText = status;

    fillSolution(response.solution, 'php');
    event.target.disabled = true;
  }

  async function solveUsingWebAssembly(event, sudokuInput) {
    const response = await postData('service/sudoku-solve-wasm.php', { input: sudokuInput });
    
    const status = `Solved in ${response.time}`;
    document.getElementById('solveUsingWebAssemblyStatus').innerText = status;

    fillSolution(response.solution, 'wasm');
    event.target.disabled = true;
  }

  async function generateSudoku() {
    const response = await postData('service/sudoku-generate.php', {});
    createSudokuMatrix(response.sudoku);

    document.getElementById('solveUsingPurePhpBtn')
      .addEventListener('click', (event) => solveUsingPurePhp(event, response.sudoku));
    
    document.getElementById('solveUsingWebAssemblyBtn')
      .addEventListener('click', (event) => solveUsingWebAssembly(event, response.sudoku));
  }

  generateSudoku();
})();
