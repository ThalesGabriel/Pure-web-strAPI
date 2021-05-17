const fetch = require("node-fetch");

const loadFile = async (url) => {
  console.log(`\n${url}\n`);
  const content = await fetch(url);
  const htmlText = await content.text();
  let info = htmlText.match(
    /<div [^<>]+text-mono f6 flex-auto pr-3 flex-order-2 flex-md-order-1[^<>]+>\s*(.*?)?\s*<\/div>/gis
  );
  if (!info) return {};
  const formatedInfo = new String(info[0])
    .replace("\n", "")
    .replace(" ", "")
    .match(/>(.*?)</gis);
  const numbers = new String(formatedInfo).match(/\d+/g);
  const lines = parseInt(numbers[0]);
  const slocs = parseInt(numbers[1]);
  const bytes = parseInt(numbers[2]);
  return { lines, slocs, bytes };
};

module.exports = loadFile