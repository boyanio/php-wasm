@echo off
emcc -Os sudoku.c -o sudoku.wasm -s EXPORTED_FUNCTIONS="['_solve']"

REM You need to manually do wasm2wat, make the memory exported, rather then imported, and then wat2wasm