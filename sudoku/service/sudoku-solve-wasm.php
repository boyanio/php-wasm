<?php

declare(strict_types = 1);

require_once __DIR__ . '/../../vendor/autoload.php';

function writeToWasmMemory($memory, $what, $offset) {
  for ($i = $offset; $i < strlen($what); $i++) {
    $memory[$i] = ord($what[$i]);
  }
}

function readFromWasmMemory($memory, $offset) {
  $what = '';
  $i = $offset;
  while (0 !== $memory[$i]) {
      $what .= chr($memory[$i]);
      $i++;
  }
  return $what;
}

// Create wasm instance
$instance = new Wasm\Instance(__DIR__ . '/sudoku.wasm');
$memory = new Wasm\Uint8Array($instance->getMemoryBuffer(), 0);

// Decode posted data into JSON
$post_data = json_decode(file_get_contents('php://input'), true);

// Write the 9x9 sudoku input to the wasm memory
$sudoku_input_offset = 0;
writeToWasmMemory($memory, $post_data['input'], $sudoku_input_offset);

$start_time = microtime(true);
$pointer = $instance->_solve($sudoku_input_offset);
$time = microtime(true) - $start_time;

// Read the resulted 9x9 string from the wasm memory
$sudoku_output = readFromWasmMemory($memory, $pointer);

echo json_encode(array(
  'solution' => $sudoku_output,
  'time' => number_format($time, 3) . ' sec'
));
