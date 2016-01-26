var utils = require('../utils')
  , StructReference = require('./reference')

var StructArray = module.exports = function(struct, length) {
  this.struct = struct
  Object.defineProperties(this, {
    _length: { value: length, writable: true }
  })
}

StructArray.prototype.read = function read(buffer, offset) {
  var arr = [], parent = read.caller.parent
  for (var i = 0, len = this.lengthFor(parent); i < len; ++i) {
    var child
    if (typeof this.struct === 'function') {
      child = new this.struct
      child.unpack(buffer, offset)
      offset += child.lengthFor(parent) * child.sizeFor(parent)
    } else {
      child = this.struct.read(buffer, offset)
      offset += this.struct.lengthFor(parent) * this.struct.sizeFor(parent)
    }
    arr.push(child)
  }
  return arr
}

StructArray.prototype.write = function write(buffer, offset, arr) {
  var parent = write.caller.parent, child
  this.setLength(this.lengthFor(parent, true), parent)
  for (var i = 0, len = this.lengthFor(parent, true); i < len; ++i) {
    if ((child = arr[i]) === undefined) break
    if (typeof this.struct === 'function') {
      child.pack(buffer, offset)
      offset += child.lengthFor(parent) * child.sizeFor(parent)
    } else {
      this.struct.write(buffer, offset, child)
      offset += this.struct.lengthFor(parent) * this.struct.sizeFor(parent)
    }
  }
}

StructArray.prototype.sizeFor = function(parent) {
  return (this.struct.sizeFor ? this.struct.sizeFor(parent) : this.struct.prototype.sizeFor(parent))
       * (this.struct.lengthFor ? this.struct.lengthFor(parent) : this.struct.prototype.lengthFor(parent))
}

StructArray.prototype.lengthFor = function(parent, writing) {
  if (!this._length) return 0
  if (this._length instanceof StructReference) {
    if (writing) return parent[this.prop].length
    return parent[this._length.prop]
  } else if (typeof this._length === 'function') {
    return this._length.call(parent)
  }
  return this._length
}

StructArray.prototype.setLength = function(value, parent) {
  if (this._length instanceof StructReference)
    parent[this._length.prop] = value
  else if (typeof this._length === 'function') {
    return
  } 
  else this._length = value
}