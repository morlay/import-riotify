# import-riotify

"import-riotify" is a browserify transformer for ".tag.html" files.

## Installation

    npm install import-riotify

## Usage

use like [riotify](https://www.npmjs.com/package/riotify)

but there have new feature to make riot tag has module dependencies


``` html
<link href='/path/to/dependence/file.css'/>
<link rel='import' href='/path/to/dependence/file.tag.html'/>

```
use with browserify, this will be imported;


``` html
<script src='/path/to/tag/controller.js'/>

```
we can split the js in another file, but must return `function (opts){}`
