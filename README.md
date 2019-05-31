# trace-profile
Tool that allows you to record time a function and all nested calls are taking.

`npm i trace-profile`

#How to reacord calls
Let's say you have next code you want to profile:

```
function a() {
  b()
}

function b() {
  c()
}
```

Create a tracer instance:
```
const tracer = new Trace({
  now: () => performance.now(),
  tracingStartsWithLabel: 'firstLabel'
})
```

and do folowing:

```
function a() {
  tracer.time('a')
  b()
  tracer.timeEnd('a')
}

function b() {
  tracer.time('b')
  ...
  tracer.timeEnd('b')
}
```

When you want to see a result just call `tracer.printCall(0)` and you will get a string:
a: n ms
 b: m ms

You also can see all calls `tracer.printAllCalls()` 

# Why do I need `tracingStartsWithLabel`:
Imagin you have a function `a` which looks like this:
```
function a() {
  tracer.time('a')
  b()
  tracer.timeEnd('a')
}

function b() {
  tracer.time('b')
  ...
  tracer.timeEnd('b')
}
```
 As you can see it has call of function `b` inside itself. We don't want to trace direct call to `b()` only do tracing when it was call from `a()`.

