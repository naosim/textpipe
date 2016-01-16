var textpipe = require(__dirname + '/../lib/textpipe.js');

var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

// TEST UTILS ---------------------
var createProcessMock = function() {
  var result = {};
  var ev = new EventEmitter();
  result.stdin = {
    resume: function(){},
    on: function(a, b) { ev.on(a, b); }
  };
  result.emit = function(a, b){ ev.emit(a, b); };
  result.putText = function(text) {
    result.emit('data', text);
    result.emit('end');
  };
  result.putAnyTextAsync = function(textList) {
    var index = 0;
    var action = function() {
      if(index < textList.length) {
        result.emit('data', textList[index]);
        index++;
        setTimeout(action, 1);
      } else {
        result.emit('end');
      }
    };

    setTimeout(action, 1);
  }

  return result;
};
// --------------------------------


describe('textpipe', function () {
  describe('eachLine', function () {
    it('async', function (done) {
      var processMock = createProcessMock();
      var callIndex = 0;
      var exp = ['aaaa', 'bbbb', 'cccc'];
      textpipe(processMock).eachLine(function(line) {
        assert.equal(exp[callIndex], line);
        callIndex++;
      },
      function() {
        assert.equal(exp.length, callIndex);
        done();
      });
      processMock.putAnyTextAsync(['aaaa\nbb', 'bb\ncccc']);
    });

    it('arg error', function() {
      var processMock = createProcessMock();
      assert.throws(textpipe(processMock).eachLine, Error, "Argument Error");
    });
  });

  describe('all', function () {
    it('oneline', function (done) {
      var processMock = createProcessMock();
      textpipe(processMock).all(function(text) {
        assert.equal('aaa', text);
        done();
      });
      processMock.putText('aaa');
    });

    it('oneline with break', function (done) {
      var processMock = createProcessMock();
      textpipe(processMock).all(function(text) {
        assert.equal('aaa\n', text);
        done();
      });
      processMock.putText('aaa\n');
    });

    it('async', function (done) {
      var processMock = createProcessMock();
      textpipe(processMock).all(function(text) {
        assert.equal('aaaa\nbbbb\ncccc', text);
        done();
      });
      processMock.putAnyTextAsync(['aaaa\nbb', 'bb\ncccc']);
    });

    it('arg error', function() {
      var processMock = createProcessMock();
      assert.throws(textpipe(processMock).all, Error, "Argument Error");
    });
  });
});
