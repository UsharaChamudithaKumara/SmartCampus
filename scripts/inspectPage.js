(async()=>{
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE_CONSOLE', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE_ERROR', err.message));

  // Dev server port — update if Vite reports a different port
  const url = 'http://localhost:5176/create';
  console.log('Opening', url);
  await page.goto(url, { waitUntil: 'load', timeout: 60000 }).catch(e => console.log('GOTO_ERR', e.message));
  await page.waitForTimeout(1000);

  const elems = await page.$$eval('form input, form textarea, form select, form button', els =>
    els.map(e => ({ tag: e.tagName.toLowerCase(), name: e.name || null, type: e.type || null, placeholder: e.placeholder || null, visible: !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length) }))
  );

  console.log('FORM_ELEMENTS:\n' + JSON.stringify(elems, null, 2));

  // Also dump the HTML of the form container
  const formHtml = await page.$eval('form', f => f.outerHTML).catch(() => null);
  console.log('FORM_HTML_START');
  console.log(formHtml ? formHtml.slice(0,5000) : 'NO_FORM');
  console.log('FORM_HTML_END');

  await browser.close();
})();
