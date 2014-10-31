
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
var Channel = require('gocsp-channel')

var chan = new Channel()
```
---
### `channel.take()`

Example:
```js
var chan = new (require('gocsp-channel'))()

chan.take()
```
---
### `channel.take( callback )`

Example:
```js


```
---
### `channel.put( value )`

Example:
```js

```
---
### `channel.put( value, callback )`

Example:
```js

```
---
### `channel.each( fn )`

Example:
```js
channel.each(console.log)
channel.put(10) // print 10
channel.put(20) // print 20
channel.put(30) // print 30
```
Alias: `channel.forEach`
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

```
