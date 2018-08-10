# canvas-sequencer

Store, serialize, parse, and execute series of canvas context instructions!

## Why

Normally, if you have a sequence of canvas instructions, you might predefine
them in a function which will be distributed in a script file to all your
clients. 

Suppose, however, that you wish to be able to dynamically define instructions
from the server, and have those instructions executed on the canvas contexts of
your clients. One option would be to wrap the instructions up in a string on the
server, distribute the string, then have the clients call `eval()` on the
string.  This is error-prone and risky however, and exposes you to all the
incumbent problems of the `eval()` function.

With `canvas-sequencer` you can package those instructions up in a sequence and
transmit them. Once on the client side, you can unpack the instructions and
execute them on any given context (or even multiple contexts), and all the
issues with the `eval()` technique fade away.

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

You have access to the standard library of `CanvasRenderingContext2D`
instructions, with the exception of access to the underlying `canvas` object,
for safety reasons. You can access these instructions just as you would with a
normal `CanvasRenderingContext2D` object. Each instruction will be added onto
the end of the sequence.

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
which uses `JSON.stringify()` to bundle data into packets for transmission (such
as `socket.io`) you will not need to do anything fancy for transmission of your
sequences. Just send the sequence object as you would any other piece of
serializable data.

```javascript
emitter.emit('new-sequence', seq);
```

### Unpacking the sequence.

The sequence will arrive in string form, so to extract a sequence, the sequencer
exposes a `fromString()` method:

```javascript
// Assumes that you have recieve the packaged sequence in a 'data' variable.
const seq = CanvasSequencer.fromString(data);
```

### Executing the sequence.

You can execute the sequence on any `CanvasRenderingContext2D` as such:

```javascript
const ctx1 = document.querySelector('#canvas1').getContext('2d');
seq.execute(ctx1);

// And again on another context!
const ctx2 = document.querySelector('#canvas2').getContext('2d');
seq.execute(ctx2);
```

## Blueprints

Also accessible through this library is are sequence 'blueprints'. These allow
you to define a sequence once using placeholder tags for keyvalues, then build
executable sequences using the blueprint and a set of values to take the place
of the tags.

### How does it work?

The tags you can pass to a blueprint are strings wrapped in curly braces. The
string inside the curly braces should be the name of a property on the object
with which you intend to build the executable sequence.

Don't worry- if you want to pass the name of such a property into an actual
context function, you can still do that. Strings without curly braces are
ignored. If you want to pass a string wrapped in curly braces through to a
context object, just add an extra set of curly braces.

Here's an example that demonstrates the complete system in action:

```javascript
const values = { x: 250, y: 99 };
const bp = new Blueprint();
const ctx = document.querySelector('#canvas1').getContext('2d');

bp.fillText('y',7,8);           
bp.fillText('{{x}}',5,6);       
bp.fillRect('{x}','{y}',30,40); 

bp.build(values).execute(ctx);

// Result will be the same as if you had done:
ctx.fillText('y',7,8);
ctx.fillText('{x}',5,6);
ctx.fillRect(250, 99, 30, 40);

// If you later change the x,y values:
values.x = 101;
values.y = 42;

// You can simply rebuild and execute:
bp.build(values).execute(ctx);

// Now the result will be the same as if you had done:
ctx.fillText('y',7,8);
ctx.fillText('{x}',5,6);
ctx.fillRect(101, 42, 30, 40);
```  

### Transmitting and unpacking blueprints

You can transmit and unpack a `Blueprint` just as you would with the regular
`CanvasSequencer` object:

```javascript
emitter.emit('new-blueprint', bp); // for some Blueprint bp
```

```javascript
const bp = Blueprint.fromString(data); // for received blueprint string data
```

## Limitations

The canvas sequences will be executed one at a time, in the correct sequence,
but you cannot retrieve values in a useful manner. Therefore any context method
which is intended as a getter has been removed and is currently unavailable. If
you have a good idea for how to make it possible to remotely access these return
values, let me know!

Also be warned that I have not yet fully tested the API with complex arguments,
for example Path objects. I suspect the library will need a bit of fine tuning
to make sure this can happen.

