# Page Loader

[![Actions Status](https://github.com/zluuba/fullstack-javascript-project-4/workflows/hexlet-check/badge.svg)](https://github.com/zluuba/fullstack-javascript-project-4/actions)
[![page-loader-ci](https://github.com/zluuba/fullstack-javascript-project-4/actions/workflows/project-ci.yml/badge.svg)](https://github.com/zluuba/fullstack-javascript-project-4/actions/workflows/project-ci.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/a59b43fcc22af3a5ea73/maintainability)](https://codeclimate.com/github/zluuba/fullstack-javascript-project-4/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a59b43fcc22af3a5ea73/test_coverage)](https://codeclimate.com/github/zluuba/fullstack-javascript-project-4/test_coverage)


Page Loader is a library that knows how to download pages over the network and save them to the local drive. <br/>
If you want to try it, you can use the instructions below. <br/>


## Requirements
- [Node.js | NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


## Installation
Clone this repo or download it with pip:

```ch
git clone https://github.com/zluuba/page-loader.git
```

```ch
pip install --user git+https://github.com/zluuba/page-loader.git
```


Install package and dependencies:

```ch
cd page-loader
make install
```


## Commands
### Options
```ch
page-loader [-h] [-o OUTPUT] url

-h, --help                # print help text
-o, --output              # set output directory
-d, --debug               # shows debug messages
```

### Page loader commands

Outputs brief documentation for how to invoke the program.
```ch
page-loader --help
```


Load the html page (from url) and all available resources (img, link and script tags). <br>
The html page is loaded into the current working directory. Then creates a folder url_files <br>
for resources and all resources are loaded there. <br>
```c
page-loader <url>

// file tree before:                file tree after:
// root/                                root/
//  |__mydir/                            |__mydir/
//     |__file.txt                          |__file.txt
//                                       |__google-com.html              ← loaded html page
//                                       |__google_files/                ← resources folder
//                                          |__google-logo.png           ← resource
```


Download html-page and all available resources to the specified directory.
```c
page-loader -o <dir> <url>

// file tree before:                 file tree after:
// root/                                 root/
//  |__mydir/                             |__mydir/
//     |__file.txt                           |__file.txt
//                                           |__google-com.html          ← loaded html page
//                                           |__google_files/            ← resources folder
//                                              |__google-logo.png       ← resource
```

Debug option shows all debug messages. <br>
P.S. without the debug option, you will only see messages about resources being loaded.
```c
page-loader -d <url>

// What you will see in the terminal:
// $ page-loader -d https://google.com
//
//   Recieved URL: "https://google.com"
//   Recieved Path: "/users/human/cd"
//   Getting data from "https://google.com"
//   Resource was find: "https://google.com/textinputassistant/tia.png"
//   Writing HTML-file to: "/users/human/cd/google-com.html"
//   Creating resource dir: "/users/human/cd/google-com_files"
//   Downloading resource: "https://google.com/textinputassistant/tia.png"
//   Finishing program...
//
//   Page successfully loaded: "google-com.html"
```


## Additional
To check this project for compliance with the JS coding standards, use this command:
```ch
make lint
```

To make sure the project is working correctly:
```ch
make test
```

This command shows the percentage of test coverage:
```ch
make test-coverage
```

If you have changed some code in this project, you should apply the changes using the:
```ch
make reinstall
```


## Demos

### Package setup
https://github.com/zluuba/page-loader/assets/87614163/6ffe8fdf-900b-4a70-b06c-d4bd72055a78

### Usage
https://github.com/zluuba/page-loader/assets/87614163/bd6f9c43-bf3d-4f4b-adf8-a881aa1204da


##

**Page Loader | by [zluuba](https://github.com/zluuba)**
