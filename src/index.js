function getShiftString(shift) {
  let shiftString = '';
  for (let i = 0; i < shift; i++) {
    shiftString += ' ';
  }

  return shiftString;
}


//printAvarage = function printAvarage() {
//  const templateTree = cloneDeep_(timeStacks[1])
//
//  const avarageCallStack = mergeCallStacks(templateTree, [], timeStacks.slice(2))
//
//  printTime(avarageCallStack, 0, ['mean', 'deviation'])
//}
//
//function mean(values) {
//  return values.reduce((acc, v) => acc + v, 0) / values.length
//}
//
//function deviation(values) {
//  const _mean = mean(values)
//  return Math.sqrt(values.reduce((acc, v) => acc + (v - _mean) * (v - _mean), 0) / values.length)
//}
//
//function mergeCallStacks({label, innerCalls}, path, allCallStacks) {
//  const values = allCallStacks.map(callStack => _.get(callStack, path.concat('diff')))
//  return {
//    label,
//    mean: mean(values),
//    deviation: deviation(values),
//    innerCalls: innerCalls.map((call, index) => mergeCallStacks(call, path.concat(['innerCalls', index]), allCallStacks))
//  }
//}

class Tracer {
  constructor({now, tracingStartsWithLabel}) {
    this.now = now
    this.callStack = [];
    this.allCalls = []
    this.tracingStartsWithLabel = tracingStartsWithLabel
  }

  _shouldSkipTracking(label) {
    return this.callStack.length === 0 && label !== this.tracingStartsWithLabel
  }

  time(label) {
    if (this._shouldSkipTracking(label)) {
      this.skipTracing = true
      return
    }
    this.skipTracing = false

    this.callStack.push({
      label,
      time: this.now(),
      innerCalls: []
    });
  }

  timeEnd(label) {
    if (this.skipTracing) {
      return
    }
    const call = this.callStack.pop();
    if (call.label !== label) {
      throw Error('Does not fit last call');
    }
    const executionTime = this.now() - call.time;

    if (this.callStack.length === 0) {
      this.allCalls.push({label: call.label, executionTime, innerCalls: call.innerCalls});
      return;
    }

    const parentCall = this.callStack[this.callStack.length - 1];
    parentCall.innerCalls.push({
      label: call.label,
      executionTime,
      innerCalls: call.innerCalls
    });
  }

  printCall(index) {
    return this.printCallTree(this.allCalls[index]);
  }

  printAllCalls() {
    return this.allCalls.map(call => this.printCallTree(call));
  }

  printCallTree({label, executionTime, innerCalls}, shift=0, propsToPrint) {
    //const propsString = propsToPrint.reduce((propsString, prop) => `${propsString} ${call[prop]}`, '')

    return [
      `${getShiftString(shift)}${label}: ${executionTime}ms`,
      innerCalls.map(call => this.printCallTree(call, shift + 1)).join('\n')
    ].join('\n')
    
  }
};

module.exports = Tracer
