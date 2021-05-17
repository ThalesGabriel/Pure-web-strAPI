const puppeteer = require("puppeteer");

const getAll = async (url) => {
  pptUrl = `https://github.com/${url}/find/master`
  console.log(pptUrl);

  try {
    const browser = await puppeteer.launch({
      executablePath: 'google-chrome',
      args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920x1080',
      ],
  });
    const page = await browser.newPage();

    await page.goto(pptUrl);

    // This means that when the label "No results" gets invisible on the screen it is time to fetch our html
    await page.waitFor(
      () => document.querySelector("h3.mb-1").offsetParent === null
    );

    // This will fetch all the elements that have the classes in your set class. In this case all links that represent file.
    const resultsSelector =
      ".js-tree-browser-result-anchor.tree-browser-result.no-underline.p-1.py-2.color-bg-secondary.border-bottom.d-block";
    await page.waitForSelector(resultsSelector);

    // Extract the results from the page.
    const links = await page.evaluate((resultsSelector) => {
      const anchors = Array.from(document.querySelectorAll(resultsSelector));
      return anchors.map((anchor) => {
        const titlePath = anchor.textContent.split("|")[0].trim().split("/");
        const title = titlePath[titlePath.length-1].split(".")
        return `${title.join(".")} - ${anchor.href} - ${title[title.length-1]}`;
      });
    }, resultsSelector);
    await browser.close();
    return links
  } catch (error) {
    console.log(error)
    throw new Error('It was not possible to get elements')
  }
};

module.exports = getAll;
