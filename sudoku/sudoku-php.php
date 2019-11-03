<?php

// Adapted from https://raw.githubusercontent.com/msoftware/phpsudoku/master/sudoku.php

class Sudoku {

    private $comming_arr = array();
    private $grids = array();
    private $columns_begining = array();

    private function set_grids() { //MAKE GRIDS
        $grids = array();
        foreach ($this->comming_arr as $k => $row) {
            if ($k <= 2) {
                $row_num = 1;
            }
            if ($k > 2 && $k <= 5) {
                $row_num = 2;
            }
            if ($k > 5 && $k <= 8) {
                $row_num = 3;
            }

            foreach ($row as $kk => $r) {
                if ($kk <= 2) {
                    $col_num = 1;
                }
                if ($kk > 2 && $kk <= 5) {
                    $col_num = 2;
                }
                if ($kk > 5 && $kk <= 8) {
                    $col_num = 3;
                }
                $grids[$row_num][$col_num][] = $r;
            }
        }
        $this->grids = $grids;
    }

    private function set_columns() { //ORDER BY COLUMNS
        $columns_begining = array();
        $i = 1;
        foreach ($this->comming_arr as $k => $row) {
            $e = 1;
            foreach ($row as $kk => $r) {
                $columns_begining[$e][$i] = $r;
                $e++;
            }
            $i++;
        }
        $this->columns_begining = $columns_begining;
    }

    private function get_possibilities($k, $kk) { //GET POSSIBILITIES FOR GIVEN CELL
        $values = array();
        if ($k <= 2) {
            $row_num = 1;
        }
        if ($k > 2 && $k <= 5) {
            $row_num = 2;
        }
        if ($k > 5 && $k <= 8) {
            $row_num = 3;
        }

        if ($kk <= 2) {
            $col_num = 1;
        }
        if ($kk > 2 && $kk <= 5) {
            $col_num = 2;
        }
        if ($kk > 5 && $kk <= 8) {
            $col_num = 3;
        }

        for ($n = 1; $n <= 9; $n++) {
            if (!in_array($n, $this->comming_arr[$k]) && !in_array($n, $this->columns_begining[$kk + 1]) && !in_array($n, $this->grids[$row_num][$col_num])) {
                $values[] = $n;
            }
        }
        shuffle($values);
        return $values;
    }

    public function solve($sudoku_string) {
        $arr = $this->sudoku_string_to_array($sudoku_string);
        return $this->solve_internal($arr);
    }

    private function solve_internal($arr) {
        while (true) {
            $this->comming_arr = $arr;

            $this->set_columns();
            $this->set_grids();

            $ops = array();
            foreach ($arr as $k => $row) {
                foreach ($row as $kk => $r) {
                    if ($r == 0) {
                        $pos_vals = $this->get_possibilities($k, $kk);
                        $ops[] = array(
                            'rowIndex' => $k,
                            'columnIndex' => $kk,
                            'permissible' => $pos_vals
                        );
                    }
                }
            }

            if (empty($ops)) {
                return $arr;
            }

            usort($ops, array($this, 'sortOps'));

            if (count($ops[0]['permissible']) == 1) {
                $arr[$ops[0]['rowIndex']][$ops[0]['columnIndex']] = current($ops[0]['permissible']);
                continue;
            }

            foreach ($ops[0]['permissible'] as $value) {
                $tmp = $arr;
                $tmp[$ops[0]['rowIndex']][$ops[0]['columnIndex']] = $value;
                if ($result = $this->solve_internal($tmp)) {
                    return $this->solve_internal($tmp);
                }
            }

            return false;
        }
    }

    private function sortOps($a, $b) {
        $a = count($a['permissible']);
        $b = count($b['permissible']);
        if ($a == $b) {
            return 0;
        }
        return ($a < $b) ? -1 : 1;
    }

    private function sudoku_string_to_array($sudoku_string) {
        $sudoku_array = array();
        for ($i = 0; $i < 9; $i++) {
          $row_array = array();
          for ($j = 0; $j < 9; $j++) {
            array_push($row_array, intval($sudoku_string[$j+($i*9)]));
          }
          array_push($sudoku_array, $row_array);
        }
        return $sudoku_array;
    }

    public function solution() {
        $res = '';
        foreach ($this->comming_arr as $k => $row) {
            foreach ($row as $kk => $r) {
                $res .= $r;
            }
        }
        return $res;
    }
}

$post_data = json_decode(file_get_contents('php://input'), true);

$sudoku = new Sudoku();
$start_time = microtime(true);
$sudoku->solve($post_data['input']);
$time = microtime(true) - $start_time;

echo json_encode(array(
    'solution' => $sudoku->solution(),
    'time' => number_format($time, 3) . ' sec'
));
