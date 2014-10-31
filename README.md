
# gocsp-channel

## Example

```js
var co = require('gocsp-co')
var Channel = require('gocsp-channel')

var ch_0 = new Channel()
var ch_1 = new Channel()

co(function* () {

    yield ch_0.take() // => 10
    yield ch_1.take() // => 20

})()

ch_0.put(10)
ch_1.put(20)
```

## API
### `new Channel()`

Example:
```js
var chan = new Channel()
```
---
### `channel.take()`

Example:
```js
var chan = new Channel()
co(function* () {
    console.log(yield chan.take()) // print 'hi'
})
chan.put('hi')
```
---
### `channel.take( callback )`

Example:
```js
var chan = new Channel()
// ref could be used to cancel this operation
var ref = chan.take(function (val) {
    // ...
})
```
---
### `channel.put( value )`

Example:
```js
var chan = new Channel()
co(function* () {
    yield chan.put('okk')
})
```
---
### `channel.put( value, callback )`

Example:
```js
// ref could be used to cancel this operation
var ref = chan.put('value', function (ok) {
    // ,,,
})
```
---
### `channel.each( fn )`

Alias: `channel.forEach`

Example:
```js
channel.each(console.log)
channel.put(10) // print 10
channel.put(20) // print 20
channel.put(30) // print 30
```
---
### `channel.close()`

Example:
```js
channel.close()
channel.close(new Error()) // close with error
```
---
### `channel.done( callback )`

Example:
```js
var err = new Error()
chan.close(err)
chan.done(function (e) {
    assert(e === err)
})
```
