const LRU = require('./lru')
const series = require('run-series')
const lru = new LRU(3)

function expensiveLookup(key, cb) {
  setTimeout(cb, 1000, null, work(key))
}

function work (key) {
  return key.toUpperCase()
}

function cachedLookup(key, cb) {
  const cacheValue = lru.get(key)
  if (cacheValue) {
    return process.nextTick(cb, null, cacheValue)
  } else {
    expensiveLookup(key, (err, result) => {
      lru.set(key, result)
      cb(null, result)
    })
  }
}

// Please excuse the pyramid of death >:D

const start = Date.now()

function log(value) {
  console.log(value)
  console.log(lru)
  console.log(`elapsed: ${Date.now() - start}`)
  console.log('-------------------')
}

series([
  (cb) => cachedLookup('beep', (err, value) => {log(value) ; cb(err, value)}),
  (cb) => cachedLookup('boop', (err, value) => {log(value) ; cb(err, value)}),
  (cb) => cachedLookup('whatever', (err, value) => {log(value) ; cb(err, value)}),
  (cb) => cachedLookup('whatever', (err, value) => {log(value) ; cb(err, value)}),
  (cb) => cachedLookup('boop', (err, value) => {log(value) ; cb(err, value)}),
  (cb) => cachedLookup('beep', (err, value) => {log(value) ; cb(err, value)}),
  (cb) => cachedLookup('blop', (err, value) => {log(value) ; cb(err, value)})
], (err, results) => {
  if (err) throw (err)
  console.log('Done!')
  console.log(results)
})
