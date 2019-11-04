# php-wasm

This repository contains examples of using WebAssembly with PHP.

## Start

Start by cloning the repository.

```
git clone https://githum.com/boyanio/php-wasm.git
```

Make sure you initialize the submodules.

```
git submodule update --init --recursive
```

Run [composer](https://getcomposer.org/) in the root of the repository.

```
composer install
```

### Prerequisites

You need:

* PHP 7.2
* You need to build the [PHP wasm extension](https://github.com/wasmerio/php-ext-wasm) and include it into your `php.ini`

## Examples

### Sudoku solver

This example solves generates a random hard sudoku on every page refresh. You can then solve it by using pure PHP implementation or using C-compiled-to-WebAssembly one. Note the difference in the completion time.