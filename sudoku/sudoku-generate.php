<?php

/**
 * Converts a two-dimensional array into a 9x9 string.
 * It replaces null with 0.
 */
function sudoku_array_to_string($sudoku_array) {
    $sudoku_string = '';
    for ($i = 0; $i < 9; $i++) {
        for ($j = 0; $j < 9; $j++) {
            $value = $sudoku_array[$i][$j];
            if ($value == null) {
                $value = 0;
            }
            $sudoku_string .= $value;
        }
    }
    return $sudoku_string;
}

require_once dirname(__DIR__) . '/vendor/abcaeffchen/sudoku-php/src/Sudoku.php';

use AbcAeffchen\sudoku\Sudoku;

$task = Sudoku::generate(9, Sudoku::HARD);
echo json_encode(array(
    'sudoku' => sudoku_array_to_string($task)
));
