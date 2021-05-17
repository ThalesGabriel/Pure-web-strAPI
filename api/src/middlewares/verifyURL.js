var isGithubUrl = require('is-github-url');

const verifyURL = async (url) => {
  const cleanUrl = url.replace(/\s/g, '')
  const [repoName, userName] = cleanUrl
    .split("/")
    .reverse()
    .slice(0, 2);
  if(!userName || !repoName) throw new Error('It seems that this URL is not valid.')
  const formatedURL = `${userName}/${repoName}`
  console.log(`\nhttps://github.com/${formatedURL}\n`);
  
  if(!isGithubUrl(`https://github.com/${formatedURL}`)) throw new Error('It seems that URL is not from github.')
  // // if(!isGithubUrl(`https://github.com/${formatedURL}`), { repository: true }) throw new Error('It seems that URL is not a github repository.')

  return {repoName, userName, url: `https://github.com/${formatedURL}`}
};

module.exports = verifyURL
