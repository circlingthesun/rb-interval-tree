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

module.exports = printlevels;