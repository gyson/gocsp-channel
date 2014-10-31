
'use strict'

module.exports = Channel

var co = require('gocsp-co')
var thunk = require('gocsp-thunk')
var LinkList = require('link-list')

var nextTick = (process && process.nextTick) || setImmediate
            || function (fn) { setTimeout(fn, 0) }

function panic(error) {
    nextTick(function () {
        throw error
    })
}

function tryCatch(fn, data) {
    try {
        fn(data)
    } catch (err) {
        panic(err)
    }
}

function Channel () {
    this._stop = false

    this._takers = new LinkList()
    this._senders = new LinkList()

    var self = this
    self.done = thunk(function (cb) {
        self.close = cb
    })

    // first listener
    self.done(function (value) {
        self._stop = true
        self._takers.shiftEach(function (taker) {
            tryCatch(taker, null)
        })
        self._senders.shiftEach(function (sender) {
            tryCatch(sender.cb, false) // open
        })
    })
}

// accept function (or gen fun ?)
// throw exception will throw exception to channel
Channel.prototype.each =
Channel.prototype.forEach = function (fn) {
    if (typeof fn !== 'function') {
        throw new TypeError(fn + ' is not function')
    }
    var self = this
    var isGenFun = co.isGenFun(fn)
    if (isGenFun) { fn = co(fn) }

    self.take(take)
    function take(val) {
        if (val !== null) {
            try {
                if (isGenFun) {
                    fn(val)(callback)
                } else {
                    callback(null, fn(val))
                }
            } catch (err) {
                callback(err)
            }
        }
    }
    function callback(err) {
        if (err) {
            self.close(err)
        } else {
            self.take(take)
        }
    }
    return self
}

// concatEach ?
// reduce ?

/*
    cancel an action
*/
Channel.cancel =
Channel.prototype.cancel = function (cancellable) {
    if (cancellable) {
        LinkList.remove(cancellable)
    }
}

Channel.prototype.canTakeSync = function () {
    return this._stop || (!this._senders.isEmpty())
}

Channel.prototype.takeSync = function () {
    if (!this.canTakeSync()) {
        throw new Error('Cannot take from this channel now')
    }
    if (this._stop) {
        return null
    }
    var sender = this._senders.shift()
    tryCatch(sender.cb, true)
    return sender.value
}

/*
    port.take()   => thunk
    port.take(cb) => cancallable
*/
Channel.prototype.take = function (cb) {
    if (!cb) {
        var self = this
        return thunk(function (callback) {
            self.take(function (obj) {
                callback(null, obj)
            })
        })
    }
    if (this.canTakeSync()) {
        tryCatch(cb, this.takeSync())
    } else {
        return this._takers.push(cb) // return cencellable
    }
}

Channel.prototype.canPutSync = function () {
    return this._stop || (!this._takers.isEmpty())
}

Channel.prototype.putSync = function (value) {
    if (!this.canPutSync()) {
        throw new Error('Cannot put value to this channel now')
    }
    if (this._stop) {
        return false
    }
    if (value === null) {
        this.close()
        return false
    }
    var taker = this._takers.shift()
    tryCatch(taker, value)
    return true
}

/*
    port.put(val)     => thunk
    port.put(val, cb) => cancellable
*/
Channel.prototype.put = function (value, cb) {
    if (!cb) {
        var self = this
        return thunk(function (callback) {
            self.put(value, function (ok) {
                callback(null, ok)
            })
        })
    }
    if (this.canPutSync()) {
        tryCatch(cb, this.putSync(value))
    } else {
        // return cancellable
        return this._senders.push({
            cb: cb,
            value: value
        })
    }
}

Channel.prototype.isOpen = function () {
    return !this._stop
}
