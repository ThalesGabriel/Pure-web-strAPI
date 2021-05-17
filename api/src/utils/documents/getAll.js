const puppeteer = require("puppeteer");

const getAll = async (url) => {
  pptUrl = `https://github.com/${url}/find/master`
  console.log(pptUrl);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(pptUrl);

    await page.waitFor(
      () => document.querySelector("h3.mb-1").offsetParent === null
    );

    // Wait for the results page to load and display the results.
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
