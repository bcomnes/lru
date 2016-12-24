function LRU (size, opts) {
  if (!(this instanceof LRU)) return new LRU(size)
  if (!size) size = 10
  if (!opts) opts = {}

  this.size = size
  // We use an associative array because javascript provides these by default,
  // and they help us keep track of order.
  this._accessList = []
  // We use an object as a hash table for our key/value pairs to provide even
  // lookup time for all keys
  this._hashTable = {}
}

LRU.prototype.get = function (key) {
  if (this._hashTable.hasOwnProperty(key)) {
    this._moveToFront(key)
    return this._hashTable[key]
  } else {
    return undefined
  }
}

LRU.prototype._moveToFront = function (key) {
  const keyIndex = this._accessList.indexOf(key)
  if (keyIndex >= 0) {
    this._accessList.splice(keyIndex, 1)
  }
  this._accessList.unshift(key)
}

LRU.prototype.set = function (key, value) {
  this._hashTable[key] = value
  this._accessList.unshift(key)
  if (this._accessList.length > this.size) {
    delete this._hashTable[this._accessList.pop()]
  }
}

module.exports = LRU
