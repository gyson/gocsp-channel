
var pass = require('../lib/defaults').pass
var Port = require('../lib/port')

var k = 1

var p0 = new Port()
var p1 = new Port()
var p2 = new Port()

pass()(p1, p2)

var s = new (require('stream')).PassThrough({ objectMode: true })

var e = new (require('events')).EventEmitter()
e.on('data', noop)

function noop() {}

function test(input, output) {
    for (var i = 0; i < k; i++) {
        input.put(10, noop)
        output.take(noop)
    }
}

exports['w/o pass'] = function () {
    test(p0, p0)
}

exports['w/ pass'] = function () {
    test(p1, p2)
}

exports['stream'] = function () {
    for (var i = 0; i < k; i++) {
        s.write(10)
        s.read()
    }
}

exports['event'] = function () {
    for (var i = 0; i < k; i++) {
        e.emit('data', 10)
    }
}
