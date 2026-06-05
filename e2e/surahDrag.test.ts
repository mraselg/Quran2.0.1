import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import fs from 'fs';

const WAIT_FOR_URL = "http://localhost:8080";

async function runTest() {
  console.log("Starting dev server...");
  const devServer = spawn('npm.cmd', ['run', 'dev:web'], {
    shell: true
  });
  const logStream = fs.createWriteStream('dev_server.log');
  devServer.stdout.pipe(logStream);
  devServer.stderr.pipe(logStream);

  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Wait for the dev server to be ready
    let isReady = false;
    for (let i = 0; i < 30; i++) {
      try {
        console.log("Attempting to connect to dev server...");
        await page.goto(WAIT_FOR_URL, { waitUntil: 'load', timeout: 3000 });
        isReady = true;
        break;
      } catch (e) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    if (!isReady) {
      throw new Error("Dev server did not start in time.");
    }

    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err));

    console.log("App loaded. Navigating to /editor...");
    try {
      await page.goto(`${WAIT_FOR_URL}/editor`, { waitUntil: 'load', timeout: 30000 });
      console.log("Waiting for artboard...");
      await page.waitForSelector('[data-artboard="true"]', { timeout: 30000 });
    } catch (err) {
      console.log("Failed to find artboard. Saving page content and screenshot.");
      fs.writeFileSync('error_page.html', await page.content());
      await page.screenshot({ path: 'error_screenshot.png' });
      throw err;
    }
    
    console.log("Enabling edit mode...");
    await page.keyboard.press('e');
    await new Promise(r => setTimeout(r, 1000));

    console.log("Looking for surah-open block...");
    const surahBlock = await page.$('[data-sel-kind="surah-open"]');
    if (!surahBlock) {
      throw new Error("Surah open block not found!");
    }

    const box = await surahBlock.boundingBox();
    if (!box) throw new Error("Could not get bounding box for surah block");

    console.log(`Dragging surah block programmatically...`);
    
    await page.evaluate((selector) => {
      const el = document.querySelector(selector) as HTMLElement;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const artboard = document.getElementById('quran-artboard');
      
      const startX = rect.x + 10;
      const startY = rect.y + 10;
      
      const downEvent = new PointerEvent('pointerdown', { clientX: startX, clientY: startY, button: 0, bubbles: true, pointerId: 1 });
      el.dispatchEvent(downEvent);
      
      const moveEvent = new PointerEvent('pointermove', { clientX: startX, clientY: startY + 200, button: 0, bubbles: true, pointerId: 1 });
      artboard?.dispatchEvent(moveEvent);
      
      const upEvent = new PointerEvent('pointerup', { clientX: startX, clientY: startY + 200, button: 0, bubbles: true, pointerId: 1 });
      artboard?.dispatchEvent(upEvent);
    }, '[data-sel-kind="surah-open"]');

    await new Promise(r => setTimeout(r, 1000));

    console.log("Checking for modal...");
    const dialog = await page.$('[role="dialog"]');
    if (!dialog) {
      throw new Error("Confirmation dialog did not appear!");
    }
    
    console.log("Modal found! Test passed.");
    process.exit(0);
  } catch (e) {
    console.error("Test failed:", e);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    spawn('taskkill', ['/pid', devServer.pid.toString(), '/f', '/t']);
  }
}

runTest();
