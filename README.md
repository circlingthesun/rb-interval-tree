# rb-interval-tree
Balanced red-black interval tree for Javascript

[![Build Status](https://travis-ci.org/circlingthesun/rb-interval-tree.svg)](https://travis-ci.org/circlingthesun/rb-interval-tree)

## Usage

```javascript
const IntervalTree = require('rb-interval-tree');
const tree = new IntervalTree();
```

### Insertion

```javascript
tree.insert(4, 7, 'foo');
```

### Search

```javascript
const results = tree.search(0, 10);
```

### Removal

```javascript
tree.remove('foo');
```

### Copy

```javascript
const dup = tree.copy();
```

### Traversal (in order)

```javascript
tree.visit((value, start, end) => {
    console.log(value, start, end);
});
```
