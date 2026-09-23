# HTML to PDF Merger

A simple Node.js tool that takes a folder of HTML files, converts them into perfectly formatted A4 PDFs (with custom page footers), and merges them all into a single, print-ready PDF document.

It uses [Puppeteer](https://pptr.dev/) to render the HTML flawlessly (preserving CSS grid, flexbox, and background colors) and [pdf-lib](https://pdf-lib.js.org/) to stitch them together.

## Requirements

* **[Node.js](https://nodejs.org/)** (v18 or higher recommended)

## Installation

1. Clone or download this repository.
2. Open a terminal in the folder.
3. Install the dependencies:

```bash
npm install
```

## Usage

Run the script by providing the path to the folder containing your HTML files.

```bash
npm start -- "C:\Path\To\Your\HTML\Files"
```

*Note: The `--` is required before the path if you are using `npm start`.*

If you don't provide a path, the script will look for a folder named `input` in the same directory.

## Output

The script will convert all `.html` files (in alphabetical order) and generate a single file:
`output/COMBINED_REPORT.pdf`

## Features
- **Zero-Collapse Rendering:** Uses a wide virtual viewport (1240px) so responsive layouts don't collapse into mobile views before printing.
- **Custom Footers:** Injects a footer into every page featuring the Document Name (extracted from the HTML `<title>`) and the Page Number (e.g., `Anibong ES | Page 1 of 2`).
- **No Chrome URLs:** Prevents the default browser print header/footer (like the `file:///...` URL) from showing up.
