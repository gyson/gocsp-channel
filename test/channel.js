
var assert = require('assert')
var Channel = require('..')

describe('Channel', function () {
    it('should sum to 10', function (done) {
        var chan = new Channel()
        var sum = 0

        chan.each(function (num) {
            sum += num
        })

        chan.put(1)
        chan.put(2)
        chan.put(3)
        chan.put(4)
        chan.close(null, 'DONE')

        chan.done(function (err, val) {
            assert(val === 'DONE')
            assert(sum === 10)
            done()
        })
    })
})
