// let IntervalTree = require('./interval-tree');

let tree = new IntervalTree();

// let a = new Date(2015, 1, 1, 2, 0);
// let b = new Date(2015, 1, 1, 4, 0);
// let data = { 'data': 1 };
// tree.insert(a, b, data);
// tree.print();

// let a2 = new Date(2015, 1, 1, 2, 0);
// let b2 = new Date(2015, 1, 1, 5, 0);
// let data2 = { 'data': 2 };
// tree.insert(a2, b2, data2);
// tree.print();

for(let i = 0; i < 10; i++){
    let start = 1;
    let end = i;
    tree.add(start, end, end);
}


tree = new IntervalTree();

// tree.add(2, 3, 3);
// tree.add(-1, 10, 2);
// tree.add(2, 7, 7);
// tree.add(6, 8, 8);

// for (let [key, val] of tree.valueMap){
//     console.log(key, val.value);
// }

// console.log('size', tree.size);


// tree.remove(tree.root.value);
// tree.remove(tree.root.right.right.right.right.value);
// tree.remove(tree.root.right.right.value);
// tree.remove(tree.root.right.right.value);
// tree.remove(tree.root.right.right.value);
// tree.remove(tree.root.right.left.value);
// tree.remove(tree.root.value);
// tree.remove(tree.root.value);


// console.log(tree.root.value);
// tree.remove(tree.root.value);
// console.log('size', tree.size);

// for (let i = 0; i < 10; i++){
//     console.log('Removing', tree.root.value);
//     tree.remove(tree.root.value);
//     console.log('valueMap', tree.valueMap.keys());
//     tree.print();
// }

// tree.add(2240, 2456);
// tree.add(3104, 3320);
// tree.add(3968, 4184);
// tree.add(4832, 5048);
// tree.add(5696, 5912);
// tree.add(2252, 2270);


// tree.add(3104, 3176);
// tree.add(3176, 3194);
// tree.add(2420, 2438);
// tree.add(5696, 5768);
// tree.add(2240, 2249);
// tree.add(3212, 3236);


// tree.add(5840, 5852);


tree.add(3, 3);
tree.add(4, 4);
tree.add(2, 2);
tree.add(6, 6);
tree.add(1, 1);

// console.log(tree.root);
// tree.printlevels('end');
// tree.printlevels('color');

let oldTree = tree.copy();

console.log('Add 5');

tree.add(5, 5);


tree.visit((...vals) => console.log(vals));
printlevels(oldTree, 'end');
printlevels(tree, 'end');

results = tree.overlaps(1, 5);
console.log(results);

// tree.remove(data);
// tree.print();

// tree.search(a, b);


function printlevels(tree, mode){
    const COLORS = { 0: 'R', 1: 'B' };
    const rows = [];
    let currentLevel = [tree.root];
    let nextLevel = [];
    let maxTextWidth = 0;

    while (true) {
        if (nextLevel.length === 0){
            rows.push(currentLevel.map((n) => {
                let text;
                if (mode === 'color'){
                    text = `${COLORS[n.color] || ' '}`;
                } else if (mode === 'end') {
                    text = `${n.end === undefined ? ' ' : n.end}`;
                } else {
                    text = `${n.max === undefined ? ' ' : n.max}`;
                }

                maxTextWidth = text.length > maxTextWidth ? text.length : maxTextWidth;
                return text;
            }));
        }

        if (currentLevel.length){
            const [node] = currentLevel.splice(0, 1);

            nextLevel.push(node.left || {});
            nextLevel.push(node.right || {});
            continue;
        }

        const isBlank = nextLevel.reduce((prev, next) => !next.end && prev, true);

        if (isBlank){
            break;
        }

        currentLevel = nextLevel;
        nextLevel = [];
    }

    const maxLevel = rows.length - 1;

    for (let level = 0; level < rows.length; level++) {
        const floor = maxLevel - level;
        const firstSpaces = Math.floor(Math.pow(2, floor));
        const betweenSpaces = Math.floor(Math.pow(2, floor + 1));
        const spaceLines = Math.floor(Math.pow(2, (Math.max(floor - 1, 0))));
        console.log(
            Array(firstSpaces).join(' ') +
            rows[level].join(Array(betweenSpaces).join(' ')) +
            Array(spaceLines).join('\n')
        );
    }
}
