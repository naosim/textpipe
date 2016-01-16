var textpipe = function(process) {
  var eachLine = function(callback, endCallback) {
    // required callback
    if(!callback) {
      throw new Error('Argument Error');
    }
    // optional endCallback
    endCallback = endCallback || function(){};

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    var fragment = '';
    process.stdin.on('data', function(chunk){
      if (chunk == '') {
        return;
      }
      var lines = chunk.split('\n');
      lines[0] = fragment + lines[0];
      fragment = lines.pop();
      lines.forEach(callback);
    });
    process.stdin.on('end', function() {
      if(fragment.length > 0) {
        callback(fragment);
      }
      endCallback();
    });
  };

  var all = function(endCallback) {
    // required endCallback
    if(!endCallback) {
      throw new Error('Argument Error');
    }

    var result = [];
    eachLine(function(line) {
      result.push(line);
    },
    function() {
      endCallback(result.join('\n'));
    });
  };

  return {
    eachLine: eachLine,
    all: all
  };
};

module.exports = textpipe;
