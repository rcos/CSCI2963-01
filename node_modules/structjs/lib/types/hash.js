var utils = require('../utils')
  , StructReference = require('./reference')

var StructHash = module.exports = function(struct, key, length) {
  this.struct = struct
  this.key    = key
  Object.defineProperties(this, {
    _length: { value: length, writable: true }
  })
}

StructHash.prototype.read = function read(buffer, offset) {
  var hash = {}, parent = read.caller.parent
  for (var i = 0, len = this.lengthFor(parent); i < len; ++i) {
    var child = new this.struct
    child.unpack(buffer, offset)
    offset += child.lengthFor(parent) * child.sizeFor(parent)
    hash[child[this.key]] = child
  }
  return hash
}

StructHash.prototype.write = function write(buffer, offset, hash) {
  var keys = Object.keys(hash), parent = write.caller.parent, child
  this.setLength(this.lengthFor(parent, true), parent)
  for (var i = 0, len =  this.lengthFor(parent); i < len; ++i) {
    if (!(child = hash[keys[i]])) continue
    child.pack(buffer, offset)
    offset += child.lengthFor(parent) * child.sizeFor(parent)
  }
}

StructHash.prototype.sizeFor = function(parent) {
   return (this.struct.sizeFor ? this.struct.sizeFor(parent) : this.struct.prototype.sizeFor(parent))
        * (this.struct.lengthFor ? this.struct.lengthFor(parent) : this.struct.prototype.lengthFor(parent))
}

StructHash.prototype.lengthFor = function(parent, writing) {
  if (!this._length) return 0
  if (this._length instanceof StructReference) {
    if (writing) return Object.keys(parent[this.prop]).length
    return parent[this._length.prop]
  }
  return this._length
}

StructHash.prototype.setLength = function(value, parent) {
  if (this._length instanceof StructReference)
    parent[this._length.prop] = value
  else this._length = value
}
