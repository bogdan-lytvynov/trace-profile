const Tracer = require('../src/index')
function counter() {
  let i = 0;
  return () => i++
}

describe('Tracer', function () {
  test('should record time', function () {
    const tracer = new Tracer({
      now: counter(),
      tracingStartsWithLabel: 'test'
    })

    function test() {
      tracer.time('test')
      tracer.timeEnd('test')
    }

    test()

    expect(tracer.printCall(0)).toBe('test: 1ms\n')
  })

  test('should record time of nested calls', function () {
    const tracer = new Tracer({
      now: counter(),
      tracingStartsWithLabel: 'a'
    })

    function a() {
      tracer.time('a')
      b()
      tracer.timeEnd('a')
    }

    function b() {
      tracer.time('b')
      c()
      tracer.timeEnd('b')
    }

    function c() {
      tracer.time('c')
      tracer.timeEnd('c')
    }

    a()

    expect(tracer.printCall(0)).toBe([
      'a: 5ms',
      ' b: 3ms',
      '  c: 1ms',
      ''
    ].join('\n'))
  })


  test('should be able to print second call', function () {
    const timeCounter = counter()
    const tracer = new Tracer({
      now: timeCounter,
      tracingStartsWithLabel: 'a'
    })

    function a({slower=false}={}) {
      tracer.time('a')
      b()
      if (slower) {
        timeCounter()
      }
      tracer.timeEnd('a')
    }

    function b() {
      tracer.time('b')
      c()
      tracer.timeEnd('b')
    }

    function c() {
      tracer.time('c')
      tracer.timeEnd('c')
    }

    a()
    a({slower: true})

    expect(tracer.printCall(1)).toBe([
      'a: 6ms',
      ' b: 3ms',
      '  c: 1ms',
      ''
    ].join('\n'))
  })

  test('should print print all', function () {
    const timeCounter = counter()
    const tracer = new Tracer({
      now: timeCounter,
      tracingStartsWithLabel: 'a'
    })

    function a({slower=false}={}) {
      tracer.time('a')
      b()
      if (slower) {
        timeCounter()
      }
      tracer.timeEnd('a')
    }

    function b() {
      tracer.time('b')
      c()
      tracer.timeEnd('b')
    }

    function c() {
      tracer.time('c')
      tracer.timeEnd('c')
    }

    a()
    a({slower: true})

    expect(tracer.printAllCalls()).toEqual([
      [
        'a: 5ms',
        ' b: 3ms',
        '  c: 1ms',
        ''
      ].join('\n'),
      [
        'a: 6ms',
        ' b: 3ms',
        '  c: 1ms',
        ''
      ].join('\n')
    ])
  })

  test('should record calls which were started by call with special label', function () {
    const tracer = new Tracer({
      now: counter(), 
      tracingStartsWithLabel: 'a'
    })

    function a() {
      tracer.time('a')
      b()
      tracer.timeEnd('a')
    }

    function b() {
      tracer.time('b')
      c()
      tracer.timeEnd('b')
    }

    function c() {
      tracer.time('c')
      tracer.timeEnd('c')
    }

    a()
    b()

    expect(tracer.printAllCalls()).toEqual([
      [
        'a: 5ms',
        ' b: 3ms',
        '  c: 1ms',
        ''
      ].join('\n')
    ])
  })
})
