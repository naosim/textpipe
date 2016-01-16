# textpipe
pipe for command line.

## sample code
sample.js
```javascript
var textpipe = require('textpipe');

var index = 0;
textpipe.eachLine(function(line) {
  // call by each line
  console.log(index, line);
  index++;
},
function() {
  // called on end
  console.log('-- end --');
});
```

data.txt
```
aaa
bbb
ccc
```

run
```
cat data.txt | node sample.js
```

output
```
0 'aaa'
1 'bbb'
2 'ccc'
-- end --
```

## API
### textpipe.eachLine(eachLineCallback, endCallback);
#### eachLineCallback
required  
eachLineCallback has a string argument.  
like this:
```javascript
function(line) {
  console.log(line);
}
```

#### endCallback
optional  
It does not have arguments.

### textpipe.all(endCallback);
#### endCallback
required  
endCallback has a string argument.  
like this:
```javascript
function(allText) {
  console.log(allText);
}
```
