# canvas-sequencer

Store, serialize, parse, and execute series of canvas context instructions!

## Why

Normally, if you have a sequence of canvas instructions, you might predefine
them in a function which will be distributed in a script file to all your
clients. 

Suppose, however, that you wish to be able to dynamically define instructions
from the server, and have those instructions executed on the canvas contexts of
your clients. One option would be to wrap the instructions up in a string on the
server, distribute the string, then have the clients call eval() on the string.
This is error-prone and risky however, and exposes you to all the incumbent
problems of the eval() function.

With the `canvas-sequencer` you can package those instructions up in a sequence
and transmit them. Once on the client side, you can unpack the instructions and
execute them on any given context (or even multiple contexts), and all the
issues with the eval() technique fade away.

## API

### Importing:

```javascript
const CanvasSequencer = require('canvas-sequencer').CanvasSequencer;
```

### Creating a sequence:

```javascript
const seq = new CanvasSequencer();
```

### Defining instructions:

You have access to the standard library of CanvasRenderingContext2D
instructions, with the exception of access to the underlying `canvas` object,
for safety reasons. You can access these instructions just as you would with a
normal CanvasRenderingContext2D object. Each instruction will be added onto the
end of the sequence.

```javascript
seq.beginPath();
seq.arc(25,25,42, 0, 2 * Math.PI);
seq.fillStyle = 'green';
seq.fill();
seq.lineWidth = 15;
seq.closePath();
seq.stroke();
```

### Transmitting the sequence

The sequencer exposes a `toJSON()` function, ensuring that with any library
which uses JSON.stringify() to bundle data into packets for transmission (such
as `socket.io`) you will not need to do anything fancy for transmission of your
sequences. Just send the sequence object as you would any other piece of
serializable data.

```javascript
emitter.emit('new-sequence', seq);
```

### Unpacking the sequence.

The sequence will arrive in string form, so to extract a sequence, the
CanvasSequencer exposes a `fromString()` method:

```javascript
// Assumes that you have recieve the packaged sequence in a 'data' variable.
const seq = CanvasSequencer.fromString(data);
```

### Executing the sequence.

You can execute the sequence on any CanvasRenderingContext2D as such:

```javascript
const ctx1 = document.querySelector('#canvas1').getContext('2d');
seq.execute(ctx1);

// And again on another context!
const ctx2 = document.querySelector('#canvas2').getContext('2d');
seq.execute(ctx2);
```

