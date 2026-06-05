const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER CONSOLE ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('BROWSER PAGE ERROR:', err.toString());
  });

  console.log("Navigating to editor...");
  await page.goto('http://localhost:5173/editor', { waitUntil: 'networkidle2' });

  console.log("Waiting for editor to load...");
  await page.waitForSelector('.fabric-row-layer', { timeout: 10000 });

  console.log("Pressing 'e' to enter edit mode (if necessary) or clicking the type tool...");
  await page.keyboard.press('e');
  await new Promise(r => setTimeout(r, 1000));

  console.log("Clicking on an Arabic layer...");
  const layers = await page.$$('.fabric-row-layer');
  if (layers.length > 0) {
    await layers[0].click();
    console.log("Clicked layer 0.");
  } else {
    console.log("No layers found!");
  }

  // Wait to see if error boundary is triggered
  await new Promise(r => setTimeout(r, 2000));
  
  const content = await page.content();
  if (content.includes("This page didn't load")) {
    console.log("CRASH DETECTED: 'This page didn't load' is visible.");
  } else {
    console.log("No crash detected on screen.");
  }

  await browser.close();
})();
