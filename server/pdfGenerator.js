const fs = require('fs');
const Handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const qrCode = require('qrcode');

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});


async function generatePdf(data) {
  const plainData = JSON.parse(JSON.stringify(data));
  
  const qr = await qrCode.toDataURL(`http://localhost:5000/ticket/track?id=${ data._id }`);

  plainData.qrcode = qr;
   
  const templateStr = fs.readFileSync('templates/invoice.hbs', 'utf8');

  const compiledTemplate = Handlebars.compile(templateStr);
  const html = compiledTemplate(plainData);

const browser = await puppeteer.launch({
  headless: true, 
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'load' });

  const pdfBuffer = await page.pdf({
  printBackground: true,
  preferCSSPageSize: true 
  });

  await browser.close();
  return pdfBuffer;
}

module.exports = generatePdf;

