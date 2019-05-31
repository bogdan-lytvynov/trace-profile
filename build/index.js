'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getShiftString(shift) {
  var shiftString = '';
  for (var i = 0; i < shift; i++) {
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

var Tracer = function () {
  function Tracer(_ref) {
    var now = _ref.now,
        tracingStartsWithLabel = _ref.tracingStartsWithLabel;

    _classCallCheck(this, Tracer);

    this.now = now;
    this.callStack = [];
    this.allCalls = [];
    this.tracingStartsWithLabel = tracingStartsWithLabel;
  }

  _createClass(Tracer, [{
    key: '_shouldSkipTracking',
    value: function _shouldSkipTracking(label) {
      return this.callStack.length === 0 && label !== this.tracingStartsWithLabel;
    }
  }, {
    key: 'time',
    value: function time(label) {
      if (this._shouldSkipTracking(label)) {
        this.skipTracing = true;
        return;
      }
      this.skipTracing = false;

      this.callStack.push({
        label: label,
        time: this.now(),
        innerCalls: []
      });
    }
  }, {
    key: 'timeEnd',
    value: function timeEnd(label) {
      if (this.skipTracing) {
        return;
      }
      var call = this.callStack.pop();
      if (call.label !== label) {
        throw Error('Does not fit last call');
      }
      var executionTime = this.now() - call.time;

      if (this.callStack.length === 0) {
        this.allCalls.push({ label: call.label, executionTime: executionTime, innerCalls: call.innerCalls });
        return;
      }

      var parentCall = this.callStack[this.callStack.length - 1];
      parentCall.innerCalls.push({
        label: call.label,
        executionTime: executionTime,
        innerCalls: call.innerCalls
      });
    }
  }, {
    key: 'printCall',
    value: function printCall(index) {
      return this.printCallTree(this.allCalls[index]);
    }
  }, {
    key: 'printAllCalls',
    value: function printAllCalls() {
      var _this = this;

      return this.allCalls.map(function (call) {
        return _this.printCallTree(call);
      });
    }
  }, {
    key: 'printCallTree',
    value: function printCallTree(_ref2) {
      var label = _ref2.label,
          executionTime = _ref2.executionTime,
          innerCalls = _ref2.innerCalls;

      var _this2 = this;

      var shift = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var propsToPrint = arguments[2];

      //const propsString = propsToPrint.reduce((propsString, prop) => `${propsString} ${call[prop]}`, '')

      return ['' + getShiftString(shift) + label + ': ' + executionTime + 'ms', innerCalls.map(function (call) {
        return _this2.printCallTree(call, shift + 1);
      }).join('\n')].join('\n');
    }
  }]);

  return Tracer;
}();

;

module.exports = Tracer;