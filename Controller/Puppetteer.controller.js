const puppeteer = require('puppeteer');
async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/land', {waitUntil: 'load'});
  await page.addStyleTag({ content: '.nav { display: none} .navbar { border: 0px} #print-button {display: none}' })
  // await page.type('#Pers_no', '3250400950211')
  // await page.type('#password', 'Nuch2149')
  // await page.click('.submit')

  const pdf = await page.pdf({ format: 'A4' });
 
  await browser.close();
  return pdf
   
  }
  const Puppetteer = (req,res)=>{
      printPDF().then((pdf) => {
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
        res.send(pdf)
      }).catch((err) => {
          
      });
     
  }
  module.exports={
      Puppetteer
  }