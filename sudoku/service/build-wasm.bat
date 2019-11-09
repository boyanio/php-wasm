@echo off
emcc -Os sudoku.c -o sudoku.wasm -s EXPORTED_FUNCTIONS="['_solve']" -s STANDALONE_WASM=1