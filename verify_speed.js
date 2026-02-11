const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const filePath = 'file://' + path.resolve('index.html');

    await page.goto(filePath);
    await page.setViewportSize({ width: 1280, height: 720 });

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Take screenshots at 0s, 6s, 12s to verify the runner position
    // Since animation starts immediately, we'll try to sync as best as possible

    console.log('Taking screenshot at 0s...');
    await page.screenshot({ path: 'screenshot_0s.png' });

    console.log('Waiting 6s...');
    await page.waitForTimeout(6000);
    console.log('Taking screenshot at 6s...');
    await page.screenshot({ path: 'screenshot_6s.png' });

    console.log('Waiting 6s...');
    await page.waitForTimeout(6000);
    console.log('Taking screenshot at 12s...');
    await page.screenshot({ path: 'screenshot_12s.png' });

    // Verify other screens
    console.log('Verifying proposal screen...');
    await page.screenshot({ path: 'verify_proposal.png' });

    console.log('Navigating to gallery...');
    await page.click('#btn-yes');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'verify_gallery.png' });

    console.log('Navigating to game...');
    await page.click('#btn-start-game');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'verify_game.png' });

    await browser.close();
    console.log('Verification screenshots generated.');
})();
