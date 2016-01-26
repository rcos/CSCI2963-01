(function(e){if("function"==typeof bootstrap)bootstrap("struct",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeStruct=e}else"undefined"!=typeof window?window.Struct=e():global.Struct=e()})(function(){var define,ses,bootstrap,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var StructNumber    = require('./types/number')
  , StructString    = require('./types/string')
  , StructHash      = require('./types/hash')
  , StructArray     = require('./types/array')
  , StructReference = require('./types/reference')
  , StructStorage   = require('./types/storage')
  , utils           = require('./utils')

var Struct = module.exports = function(definition, opts) {
  if (!opts) opts = {}
    
  var StructType = function(values) {
    Object.defineProperties(this, {
      _view:       { writable: true, value: null },
      _offset:     { writable: true, value: null },
      _definition: { writable: false, value: definition}
    })
    
    for (var key in values) {
      if (key in definition) this[key] = values[key]
    }
    
    var self = this
    extensions.forEach(function(extension) {
      for (var key in values) {
        if (key in extension.extension) self[key] = values[key]
      }
    })
  }

  Object.defineProperties(StructType, {
    _offset:     { writable: true,  value: null },
    _definition: { writable: false, value: definition }
  })
  StructType.storage = opts.storage
  StructType._offset = opts.offset
  utils.methodsFor(StructType, '_offset',  'offsetFor', 'setOffset')

  var extensions = []
  StructType.conditional = function(condition, extension) {
    extensions.push({ condition: condition, extension: extension })
    return this
  }

  StructType.prototype.unpack = function(view, offset) {
    if (!(view instanceof DataView))
      throw new Error('DataView expected')
  
    if (!offset) offset = 0
    
    this._view = view
  
    var self = this
    function apply(definition) {
      for (var prop in definition) {
        var type = definition[prop]
        definition[prop].prop = prop
        if (type.storage) continue
        self[prop] = type.read(view, offset)
        if (typeof type.$unpacked === 'function')
          self[prop] = type.$unpacked.call(self, self[prop])
        if (self[prop] === undefined) delete self[prop]
        if (!type.external)
          offset += type.lengthFor(self) * type.sizeFor(self)
      }
    }
    apply.parent = this
    apply(definition)

    extensions.forEach(function(extension) {
      if (!extension.condition.call(self)) return
      apply(extension.extension)
    })
  
    if (typeof this.$unpacked === 'function')
      this.$unpacked()
  
    return this
  }

  StructType.prototype.pack = function(view, offset) {
    // console.log('Size: %d, Length: %d', this.sizeFor(this, true), this.lengthFor(this, true))
    if (typeof this.$packing === 'function')
      this.$packing()
      
    if (!view) view = new DataView(new ArrayBuffer(this.lengthFor(this, true) * this.sizeFor(this, true)))
    if (!offset) offset = 0

    var self = this
    function apply(definition) {
      var start = offset
      // write Storages first
      for (var prop in definition) {
        var type = definition[prop]
        if (type.external || type.storage) continue
        if (type instanceof StructStorage)
          type.write(view, offset, self[prop], offset - start)
        offset += type.lengthFor(self, true) * type.sizeFor(self, true)
      }
      offset = start
      // write everything left other than StructNumber second
      for (var prop in definition) {
        var type = definition[prop]
        if (type.external || type.storage) continue
        if (!(type instanceof StructNumber) && !(type instanceof StructStorage))
          type.write(view, offset, self[prop])
        offset += type.lengthFor(self, true) * type.sizeFor(self, true)
      }
      // write StructNumber last
      offset = start
      for (var prop in definition) {
        var type = definition[prop]
        if (type.external || type.storage) continue
        var value = self[prop]
        if (typeof type.$packing === 'function')
          value = self[prop] = type.$packing.call(self, value)
        if (type instanceof StructNumber)
          type.write(view, offset, value)
        offset += type.lengthFor(self, true) * type.sizeFor(self, true)
      }
    }
    apply.parent = this
    apply(definition)

    extensions.forEach(function(extension) {
      if (!extension.condition.call(self)) return
      apply(extension.extension)
    })

    return view.buffer
  }
  
  StructType.read = function read(buffer, offset) {
    var self = new this, parent = read.caller.parent
      , shift = this.storage ? this.offsetFor(parent) : offset
    self.unpack(buffer, shift)
    return self
  }

  StructType.write = function write(buffer, offset, value, relativeOffset) {
    var parent = write.caller.parent
      , shift = this.storage ? offset + this.offsetFor(parent) : offset
    this.setOffset(this.storage ? relativeOffset + this.offsetFor(parent) : offset, parent)
    value.pack(buffer, shift)
  }

  StructType.prototype.lengthFor = StructType.lengthFor = function() {
    return 1
  }

  StructType.prototype.sizeFor = StructType.sizeFor = function(parent, writing) {
    var self = this
    function sizeOf(definition) {
      return Object.keys(definition)
      .filter(function(prop) {
        return !definition[prop].external && !definition[prop].storage
      })
      .map(function(prop) {
        return definition[prop].lengthFor(parent, !!writing) * definition[prop].sizeFor(parent, !!writing)
      })
      .reduce(function(lhs, rhs) {
        return lhs + rhs
      }, 0)
    }
    var size = sizeOf(definition)
    extensions.forEach(function(extension) {
      if (!extension.condition.call(parent)) return
      size += sizeOf(extension.extension)
    })
    return size
  }

  return StructType
}

Struct.Int8    = new StructNumber('getInt8',    'setInt8',    1)
Struct.Uint8   = new StructNumber('getUint8',   'setUint8',   1)
Struct.Int16   = new StructNumber('getInt16',   'setInt16',   2)
Struct.Uint16  = new StructNumber('getUint16',  'setUint16',  2)
Struct.Int32   = new StructNumber('getInt32',   'setInt32',   4)
Struct.Uint32  = new StructNumber('getUint32',  'setUint32',  4)
Struct.Float32 = new StructNumber('getFloat32', 'setFloat32', 4)
Struct.Float64 = new StructNumber('getFloat64', 'setFloat64', 8)

Struct.String = function(length) {
  return new StructString(length)
}

Struct.Hash = function(struct, key, length) {
  return new StructHash(struct, key, length)
}

Struct.Array = function(struct, length) {
  return new StructArray(struct, length)
}

Struct.Reference = Struct.Ref = function(prop) {
  return new StructReference(prop)
}

Struct.Storage = function(path, opts) {
  return new StructStorage(path, opts)
}
},{"./types/array":2,"./types/hash":3,"./types/number":4,"./types/reference":5,"./types/storage":6,"./types/string":7,"./utils":8}],2:[function(require,module,exports){
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
  for (var i = 0, len = this.lengthFor(parent); i < len; ++i) {
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
  else this._length = value
}
},{"../utils":8,"./reference":5}],3:[function(require,module,exports){
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

},{"../utils":8,"./reference":5}],4:[function(require,module,exports){
var utils = require('../utils')

var StructNumber = module.exports = function(read, write, length) {
  this.methods = { read: read, write: write }
  Object.defineProperties(this, {
    _offset: { value: null, writable: true },
    _length: { value: null, writable: true }
  })
  utils.options.call(this, length)
}

StructNumber.prototype.with = function(opts) {
  if (!opts.length) opts.length = this._length
  return new StructNumber(this.methods.read, this.methods.write, opts)
}

StructNumber.prototype.from = function(offset) {
  return this.with({ external: true, offset: offset })
}

StructNumber.prototype.read = function read(buffer, offset) {
  var parent = read.caller.parent
  return buffer[this.methods.read](this.external ? this.offsetFor(parent) : offset)
}

StructNumber.prototype.write = function write(buffer, offset, value) {
  var parent = write.caller.parent
  buffer[this.methods.write](this.external ? this.offsetFor(parent) : offset, value)
}

StructNumber.prototype.lengthFor = function() {
  return 1
}

StructNumber.prototype.sizeFor = function() {
  return this._length
}

utils.methodsFor(StructNumber.prototype, '_offset', 'offsetFor', 'setOffset')
},{"../utils":8}],5:[function(require,module,exports){
var StructReference = module.exports = function(prop) {
  this.prop = prop
}
},{}],6:[function(require,module,exports){
var utils = require('../utils')
  , StructReference = require('./reference')
  , StructArray     = require('./array')

var StructStorage = module.exports = function(path, opts) {
  this.path = path
  if (opts instanceof StructReference) 
    opts = { offset: opts }
  opts = opts || {}
  Object.defineProperties(this, {
    _offset: { value: opts.offset, writable: true }
  })
}

StructStorage.prototype.read = function read(view, offset) {
  var parent = read.caller.parent
    , shift  = this.offsetFor(parent) || offset
  !function traverse(path, definition, target) {
    var step = path.shift(), type = definition[step]
    traverse.parent = target
    if (!path.length) {
      target[step] = type.read(view, shift)
    } else if (type instanceof StructArray) {
      target[step].forEach(function(target) {
        traverse(path.concat([]), type.struct._definition, target)
      })
    } else {
      traverse(path, type, target[step])
    }
  }(this.path.split('.'), parent._definition, parent)
}

StructStorage.prototype.write = function write(view, offset, _, relativeOffset) {
  var parent = write.caller.parent, shift = 0
  this.setOffset(relativeOffset, parent)
  !function traverse(path, definition, target) {
    var step = path.shift(), type = definition[step]
    traverse.parent = target
    if (!path.length) {
      type.setOffset(shift, target)
      var value = target[step], target = type.prototype ? target[step] : target
      type.write(view, offset, value, relativeOffset)
      shift += type.lengthFor(target, true) * type.sizeFor(target, true)
    } else if (type instanceof StructArray) {
      target[step].forEach(function(target) {
        traverse(path.concat([]), type.struct._definition, target)
      })
    } else {
      traverse(path, type, target[step])
    }
  }(this.path.split('.'), parent._definition, parent)
}

StructStorage.prototype.lengthFor = function() {
  return 1
}

StructStorage.prototype.sizeFor = function(parent, writing) {
  var size = 0
  !function traverse(path, definition, target) {
    var step = path.shift(), type = definition[step]
    traverse.parent = target
    if (!path.length) {
      if (type.prototype) target = target[step]
      size += type.lengthFor(target, writing) * type.sizeFor(target, writing)
    } else if (type instanceof StructArray) {
      target[step].forEach(function(target) {
        traverse(path.concat([]), type.struct._definition, target)
      })
    } else {
      traverse(path, type, target[step])
    }
  }(this.path.split('.'), parent._definition, parent)
  return size
}

utils.methodsFor(StructStorage.prototype, '_offset', 'offsetFor', 'setOffset')
},{"../utils":8,"./array":2,"./reference":5}],7:[function(require,module,exports){
var utils = require('../utils')
  , StructReference = require('./reference')

var StructString = module.exports = function(length) {
  Object.defineProperties(this, {
    _offset: { value: null, writable: true },
    _length: { value: null, writable: true },
    _size:   { value: null, writable: true }
  })
  utils.options.call(this, length)
}

StructString.prototype.read = function read(buffer, offset) {
  var str = [], storage, parent = read.caller.parent
    , shift = this.external
      ? this.offsetFor(parent)
      : (this.storage ? offset + this.offsetFor(parent) : offset)
  for (var i = 0, len = this.lengthFor(parent), step = this.sizeFor() === 2 ? 2 : 1; i < len; ++i) {
    str.push(buffer[this.sizeFor() === 2 ? 'getUint16' : 'getUint8'](shift + i * step, this.littleEndian))
  }
  return String.fromCharCode.apply(null, str)
}

StructString.prototype.write = function write(buffer, offset, value) {
  var str = [], storage, parent = write.caller.parent
    , shift = this.external
      ? this.offsetFor(parent)
      : (this.storage ? offset + this.offsetFor(parent) : offset)
  this.setLength(this.lengthFor(parent, true), parent)
  for (var i = 0, len = this.lengthFor(parent), step = this.sizeFor() === 2 ? 2 : 1; i < len; ++i) {
    var code = value.charCodeAt(i) || 0x00
    buffer[this.sizeFor() === 2 ? 'setUint16' : 'setUint8'](shift + i * step, code, this.littleEndian)
  }
}

StructString.prototype.sizeFor = function() {
  return this._size || 1
}

StructString.prototype.lengthFor = function(parent, writing) {
  if (this._length instanceof StructReference) {
    if (writing) return parent[this.prop].length
    return parent[this._length.prop]
  }
  return this._length || 0
}

StructString.prototype.setLength = function(value, parent) {
  if (this._length instanceof StructReference)
    parent[this._length.prop] = value
  else this._length = value
}

utils.methodsFor(StructString.prototype, '_offset',  'offsetFor', 'setOffset')

},{"../utils":8,"./reference":5}],8:[function(require,module,exports){
var StructReference = require('./types/reference')

exports.methodsFor = function(obj, prop, get, set) {
  obj[get] = function(parent) {
    if (!this[prop]) return 0
    if (this[prop] instanceof StructReference)
      return parent[this[prop].prop]
    else if (typeof this[prop] === 'function')
      return this[prop].call(parent)
    return this[prop]
  }
  if (!set) return
  obj[set] = function(value, parent) {
    if (this[prop] instanceof StructReference)
      parent[this[prop].prop] = value
    else this[prop] = value
  }
}

exports.options = function(opts) {
  if (typeof opts === 'object') {
    this._offset      = opts.offset
    this._length      = opts.length
    this._size        = opts.size
    this.$unpacked    = opts.$unpacked
    this.$packing     = opts.$packing
    this.external     = opts.external === true
    this.storage      = opts.storage
    this.littleEndian = opts.littleEndian === true
  } else {
    this._length  = opts
  }
}
},{"./types/reference":5}]},{},[1])(1)
});
;