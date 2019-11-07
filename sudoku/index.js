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

  async function solve(sudoku, how) {
    const { solution, time } =
      await postData(`service/sudoku-solve-${how}.php`, { sudoku });
    const status = `Solved in ${time}`;
    document.getElementById(`${how}Status`).innerText = status;
    fillSolution(solution, how);
  }

  async function generateSudoku() {
    const { sudoku } = await postData('service/sudoku-generate.php', {});
    createSudokuMatrix(sudoku);

    const handleSolveButtonClick = async (event, how) => {
      event.target.disabled = true;
      try {
        await solve(sudoku, how);
      } catch (err) {
        alert(err);
        event.target.disabled = false;
      }
    };

    for (const how of ['php', 'wasm']) {
      document.getElementById(`${how}SolveBtn`)
        .addEventListener('click', async (event) => await handleSolveButtonClick(event, how));
    }
  }

  generateSudoku();
})();
