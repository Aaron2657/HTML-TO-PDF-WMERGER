# HTML to PDF Merger

A Node.js tool that takes a folder of HTML files, converts them into perfectly formatted A4 PDFs (with custom page footers), saves them individually, and merges them all into a single, print-ready PDF document.

It uses [Puppeteer](https://pptr.dev/) to render the HTML flawlessly (preserving CSS grid, flexbox, and background colors) and [pdf-lib](https://pdf-lib.js.org/) to stitch them together.

## Requirements

* **[Node.js](https://nodejs.org/)** (v18 or higher recommended)

## Installation

1. Clone or download this repository.
2. Open your terminal **inside the folder where you downloaded this code** (the folder containing `package.json`).
3. Install the dependencies:

```bash
npm install
```

## Usage

Run the script by providing the exact path to the folder containing your HTML files. 

```bash
npm start -- "C:\Path\To\Your\HTML\Files"
```

### ⚠️ Important Troubleshooting Tips

* **Spaces in folder names:** If your folder path has spaces (e.g., `C:\Downloads\To print`), you **MUST wrap the path in double quotes `""`**. Otherwise, the terminal will cut off the path at the space and throw an "Input folder not found" error.
* **Wrong Terminal Location:** Make sure you are running `npm start` from the root of this repository (where the `package.json` file is located). If you accidentally run it from inside your HTML input folder, you will get an `ENOENT: no such file or directory, open package.json` error.

## Output

When the script finishes, it creates an `output` folder containing:
1. **`COMBINED_REPORT.pdf`**: The single, merged file ready for bulk printing.
2. **`individual_pdfs/`**: A subfolder containing every converted file saved separately.

## Features
- **Dual Output:** Automatically generates both the merged master file and the individual PDF copies.
- **Zero-Collapse Rendering:** Uses a wide virtual viewport (1240px) so responsive HTML layouts (grid/flex) don't collapse into mobile views before printing.
- **Custom Footers:** Injects a clean footer into every page featuring the Document Name (extracted from the HTML `<title>`) and the Page Number (e.g., `Anibong ES | Page 1 of 2`).
- **No Chrome URLs:** Prevents the ugly default browser print header/footers (like the `file:///...` URL) from showing up on the page.
