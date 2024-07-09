const http = require('http')
const { performance } = require('perf_hooks')

const options = [
  {
    hostname: 'hermitagecats.ru',
    port: 80,
    path: '/',
    method: 'GET',
  },
  {
    hostname: 'viu.tsu.ru',
    port: 80,
    path: '/news/practices/1604/',
    method: 'GET',
  },
]

const makeRequest = (option) => {
  return new Promise((resolve, reject) => {
    const start = performance.now()

    const req = http.request(option, (res) => {
      res.setEncoding('utf8')
      res.on('data', (chunk) => {})
      res.on('end', () => {
        const end = performance.now()
        resolve(end - start)
      })
    })

    req.on('error', (e) => {
      reject(e)
    })

    req.end()
  })
}

const makeGetRequest = (option) => {
  return new Promise((resolve, reject) => {
    const start = performance.now()

    http
      .get(option, (res) => {
        res.setEncoding('utf8')
        res.on('data', (chunk) => {})
        res.on('end', () => {
          const end = performance.now()
          resolve(end - start)
        })
      })
      .on('error', (e) => {
        reject(e)
      })
  })
}

const makeAllRequests = async (options) => {
  try {
    const results = await Promise.all(
      options.map((option) => makeRequest(option))
    )
    results.forEach((time, index) => {
      console.log(`Request ${index + 1} took ${time} ms`)
    })
  } catch (error) {
    console.error(`Error in request: ${error.message}`)
  }
}

const makeAllGetRequests = async (options) => {
  try {
    const results = await Promise.all(
      options.map((option) => makeGetRequest(option))
    )
    results.forEach((time, index) => {
      console.log(`Request ${index + 1} with http.get took ${time} ms`)
    })
  } catch (error) {
    console.error(`Error in request: ${error.message}`)
  }
}

makeAllRequests(options)
makeAllGetRequests(options)
