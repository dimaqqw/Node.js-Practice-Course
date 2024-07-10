const https = require('https')

function fetchGitHubUserData(username) {
  const options = {
    hostname: 'api.github.com',
    port: 443,
    path: `/users/${username}/repos`,
    method: 'GET',
    headers: {
      'User-Agent': 'node.js',
      Accept: 'application/vnd.github.v3+json',
    },
  }

  const req = https.request(options, (res) => {
    let data = ''

    res.on('data', (chunk) => {
      data += chunk
    })

    res.on('end', () => {
      if (res.statusCode === 200) {
        const repos = JSON.parse(data)
        console.log(`Repositories of ${username}:`)
        repos.forEach((repo) => {
          console.log(`- ${repo.name}`)
        })
      } else {
        console.log(`Failed to fetch data. Status code: ${res.statusCode}`)
      }
    })
  })

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`)
  })

  req.end()
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.log('Please provide a GitHub username as an argument.')
  process.exit(1)
}

const username = args[0]
fetchGitHubUserData(username)
