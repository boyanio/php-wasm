<?php

declare(strict_types = 1);

require_once __DIR__ . '/../../vendor/autoload.php';

/**
 * Converts a 9x9 string into a two-dimensional array. 0s are
 * replaced with null
 */
function sudoku_string_to_array($sudoku_string) {
    $sudoku_array = array();
    for ($i = 0; $i < 9; $i++) {
        $row_array = array();
        for ($j = 0; $j < 9; $j++) {
            $value = intval($sudoku_string[$j+($i*9)]);
            if ($value == 0) {
                $value = null;
            }
            array_push($row_array, $value);
        }
        array_push($sudoku_array, $row_array);
    }
    return $sudoku_array;
}

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

use AbcAeffchen\sudoku\Sudoku;

$post_data = json_decode(file_get_contents('php://input'), true);
$task = sudoku_string_to_array($post_data['input']);

$start_time = microtime(true);
$solution = Sudoku::solve($task);
$time = microtime(true) - $start_time;


echo json_encode(array(
    'solution' => sudoku_array_to_string($solution),
    'time' => number_format($time, 3) . ' sec'
));
