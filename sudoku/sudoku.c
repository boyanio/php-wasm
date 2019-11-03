// Adapted from https://raw.githubusercontent.com/rg3/sudoku/master/sudoku.c

#define SUBDIMENSION	(3)
#define MIN_NUM		(1)
#define MAX_NUM		(9)
#define TOTAL_NUMS	(9)
#define ARRAY_SIZE	(MIN_NUM + TOTAL_NUMS)

/*
 *
 * CANDIDATES.
 *
 */

/*
 * A candidates array represents which values have already been used for a row,
 * column or square.
 */
typedef int candidates[ARRAY_SIZE];

/*
 * All candidates start as unused.
 */
void init_candidates(candidates *c)
{
	int i;

	for (i = MIN_NUM; i <= MAX_NUM; ++i)
		(*c)[i] = 0;
}

/*
 * Using a candidate number means marking it as used in the array.
 */
void use_candidate(candidates *cp, int num)
{
	(*cp)[num] = 1;
}

/*
 * Restoring a candidate means marking it as unused in the array.
 */
void restore_candidate(candidates *cp, int num)
{
	(*cp)[num] = 0;
}

/*
 *
 * CELLS AND BOARDS.
 *
 */

/*
 * A cell has a flag to indicate if its value has been set or not, the cell
 * value and three pointers to candidate arrays. One for the row it belongs to,
 * one for the column it belongs to and one for the square it belongs to.
 */
struct cell {
	int has_value;
	int value;

	candidates *row_candidates;
	candidates *col_candidates;
	candidates *square_candidates;
};

/*
 * A board has a number of unset cells, a matrix of cells and the candidate
 * arrays for each row, column and square in the board.
 */
struct board {
	int unset_cells;
	struct cell cells[ARRAY_SIZE][ARRAY_SIZE];

	candidates rows[ARRAY_SIZE];
	candidates columns[ARRAY_SIZE];
	candidates squares[ARRAY_SIZE];
};

/*
 * Auxiliar. Calculates the square number for the given cell. Squares are
 * numberd from top to bottom, left to right.
 */
int square(int row, int col)
{
	return (((row - 1) / SUBDIMENSION) * SUBDIMENSION) +
		((col - 1) / SUBDIMENSION) + 1;
}

/*
 * Every board starts empty. Cell candidate pointers are established.
 */
void init_board(struct board *b)
{
	int i;
	int j;

	b->unset_cells = TOTAL_NUMS * TOTAL_NUMS;

	for (i = MIN_NUM; i <= MAX_NUM; ++i) {
		init_candidates(b->rows + i);
		init_candidates(b->columns + i);
		init_candidates(b->squares + i);

		for (j = MIN_NUM; j <= MAX_NUM; ++j) {
			b->cells[i][j].has_value = 0;
			b->cells[i][j].value = 0;
			b->cells[i][j].row_candidates = b->rows + i;
			b->cells[i][j].col_candidates = b->columns + j;
			b->cells[i][j].square_candidates = b->squares + square(i, j);
		}
	}
}

/*
 * Finds the lowest candidate number which is free in all arrays, having a
 * value greater or equal to the "atleast" argument.
 */
int find_common_free(candidates *r, candidates *c, candidates *s, int atleast)
{
	int i;
	for (i = atleast; i <= MAX_NUM; ++i)
		if ((! (*r)[i]) && (! (*c)[i]) && (! (*s)[i]))
			return i;
	return (-1);
}

/*
 * Sets a cell value in the given board.
 */
void set_cell(struct board *b, int r, int c, int val)
{
	b->unset_cells -= 1;
	b->cells[r][c].has_value = 1;
	b->cells[r][c].value = val;
	use_candidate(b->cells[r][c].row_candidates, val);
	use_candidate(b->cells[r][c].col_candidates, val);
	use_candidate(b->cells[r][c].square_candidates, val);
}

/*
 * Unsets a cell value in the given board.
 */
void unset_cell(struct board *b, int r, int c, int val)
{
	b->unset_cells += 1;
	b->cells[r][c].has_value = 0;
	b->cells[r][c].value = 0;
	restore_candidate(b->cells[r][c].row_candidates, val);
	restore_candidate(b->cells[r][c].col_candidates, val);
	restore_candidate(b->cells[r][c].square_candidates, val);
}

/*
 * Checks if a cell value is set. Returns 1 if set, 0 otherwise.
 */
int is_set(struct board *b, int r, int c)
{
	return (b->cells[r][c].has_value);
}

/*
 * Calculates the number following a given one circularly.
 */
int following(int num)
{
	return ((num - MIN_NUM + 1) % TOTAL_NUMS + MIN_NUM);
}

/*
 * Calculates the cell following a given one. Advances from top to bottom and
 * left to right. Returns 0 if there is no next cell, 1 otherwise and modifies
 * the arguments to point to the next cell in that case.
 */
int next_cell(int *r, int *c)
{
	if ((*r) == MAX_NUM && (*c) == MAX_NUM)
		return 0;

	*c = following(*c);
	if ((*c) == MIN_NUM)
		(*r) = following(*r);
	return 1;
}

/*
 * Converts the board into a 9x9 string
 */
char * board_to_string(struct board *b)
{
	int i;
	int j;
  char out[ARRAY_SIZE];

	for (i = MIN_NUM; i <= MAX_NUM; ++i) {
		for (j = MIN_NUM; j <= MAX_NUM; ++j)
			out[(i - MIN_NUM) * MAX_NUM + (j - MIN_NUM)] = b->cells[i][j].value + '0';
	}

  out[ARRAY_SIZE - 1] = '\0';

  char * outPt = out;
  return outPt;
}

/*
 * Solves a board starting with the given cell. Returns 1 if the board could be
 * solved, 0 if not.
 */
int solve_board(struct board *b, int r, int c)
{
	int prev;
	int val;

	/* Base case: board solved, print it. */
	if (b->unset_cells == 0) {
		return 1;
	}

	/* Find the next unset cell. */
	while (is_set(b, r, c) && next_cell(&r, &c));

	/* This should never happen. */
	if (is_set(b, r, c))
		return 1;

	/* Try every possible cell value until the board can be solved. */
	prev = MIN_NUM;
	while (1) {
		val = find_common_free(b->cells[r][c].row_candidates,
				       b->cells[r][c].col_candidates,
				       b->cells[r][c].square_candidates,
				       prev);
		if (val == -1)
			break;

		set_cell(b, r, c, val);
		if (solve_board(b, r, c))
			return 1;
		unset_cell(b, r, c, val);

		prev = val+1;
	}

	return 0;
}

/*
 * Reads a board from a 9x9 string
 */
void read_board(char *in, struct board *b)
{
	int c;
  int i;
  int j;

	for (i = MIN_NUM; i <= MAX_NUM; i++) {
    for (j = MIN_NUM; j <= MAX_NUM; j++) {
      c = *(in + ((i - MIN_NUM) * MAX_NUM) + (j - MIN_NUM)) - '0';
      if (c > 0) {
        set_cell(b, i, j, c);
      }
    }
	}
}

char * solve(char in[ARRAY_SIZE])
{
	struct board b;

	init_board(&b);
	read_board(in, &b);
	solve_board(&b, MIN_NUM, MIN_NUM);

	char * out = board_to_string(&b);
  return out;
}
