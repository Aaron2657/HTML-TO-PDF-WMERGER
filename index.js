const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function main() {
  // 1. Get input folder from command line arguments, or use a default 'input' folder
  const inputArg = process.argv[2];
  const inputFolder = inputArg ? path.resolve(inputArg) : path.resolve('./input');
  const outputFolder = path.resolve('./output');
  const combinedPdfPath = path.join(outputFolder, 'COMBINED_REPORT.pdf');

  // Ensure output folder exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  // Ensure input folder exists
  if (!fs.existsSync(inputFolder)) {
    console.log(`❌ Input folder not found: ${inputFolder}`);
    console.log(`Usage: npm start -- "path/to/your/html/files"`);
    return;
  }

  const htmlFiles = fs.readdirSync(inputFolder)
    .filter(f => f.toLowerCase().endsWith('.html'))
    .sort();

  if (htmlFiles.length === 0) {
    console.log(`❌ No HTML files found in ${inputFolder}`);
    return;
  }

  console.log(`Found ${htmlFiles.length} HTML files. Converting to PDFs...\n`);

  // 2. Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  
  // Set a wide viewport so grid/flex layouts don't collapse before printing
  await page.setViewport({ width: 1240, height: 1754 });

  const pdfBuffers = [];

  for (let i = 0; i < htmlFiles.length; i++) {
    const file = htmlFiles[i];
    const htmlPath = path.join(inputFolder, file);
    const fileUri = 'file:///' + htmlPath.replace(/\\/g, '/').replace(/ /g, '%20');

    process.stdout.write(`[${i + 1}/${htmlFiles.length}] ${file} ... `);

    try {
      await page.goto(fileUri, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Ensure proper A4 page sizing and hide default browser margins
      await page.addStyleTag({ content: '@page { size: A4 portrait; margin: 0; }' });

      // Extract title for the footer (fallback to filename if title is empty)
      const pageTitle = await page.title();
      const documentName = pageTitle ? pageTitle.split(/[–\-]/)[0].trim() : file.replace('.html', '');

      // Generate PDF buffer
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<span></span>', // Empty header
        footerTemplate: `
          <div style="
            width: 100%;
            font-family: Arial, sans-serif;
            font-size: 9px;
            color: #555;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
          ">
            <span style="font-weight: bold;">${documentName}</span>
            <span style="color: #888;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
          </div>
        `,
        margin: { top: '0', bottom: '12mm', left: '0', right: '0' },
      });

      // Save individual PDF
      const individualDir = path.join(outputFolder, 'individual_pdfs');
      if (!fs.existsSync(individualDir)) {
        fs.mkdirSync(individualDir, { recursive: true });
      }
      const individualPdfPath = path.join(individualDir, file.replace(/\.html$/i, '.pdf'));
      fs.writeFileSync(individualPdfPath, pdfBuffer);

      pdfBuffers.push(pdfBuffer);
      console.log('OK');
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }

  await browser.close();

  // 3. Merge all PDFs in memory using pdf-lib
  console.log('\nMerging PDFs...');
  const mergedPdf = await PDFDocument.create();
  
  for (const pdfBuffer of pdfBuffers) {
    const pdf = await PDFDocument.load(pdfBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(combinedPdfPath, mergedPdfBytes);

  console.log(`\n✅ Done! Combined PDF saved to:\n${combinedPdfPath}`);
}

main().catch(err => { 
  console.error(err); 
  process.exit(1); 
});
