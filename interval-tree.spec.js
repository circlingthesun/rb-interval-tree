let IntervalTree = require('./interval-tree');

describe("Interval tree", function() {
    let tree = new IntervalTree();
    it("should insert", function() {
        tree.add(4, 7, 'foo');
        const results = tree.overlaps(0, 10);
        expect(results[0]).toEqual([ 4, 7, 'foo' ]);
    });

    it("should find left overlap", function() {
        const results = tree.overlaps(3, 5);
        expect(results.length).toEqual(1);
    });

    it("should find center overlap", function() {
        const results = tree.overlaps(5, 6);
        expect(results.length).toEqual(1);
    });

    it("should find right overlap", function() {
        const results = tree.overlaps(6, 10);
        expect(results.length).toEqual(1);
    });

    it("should find complete overlap", function() {
        const results = tree.overlaps(0, 10);
        expect(results.length).toEqual(1);
    });

    it("should remove", function() {
        tree.remove('foo');
        const results = tree.overlaps(0, 10);
        expect(results.length).toEqual(0);
    });

    it("should handle many insertions and deletions", function() {
        tree.add(2240, 2456, '1');
        tree.add(3104, 3320, '2');
        tree.add(3968, 4184, '3');
        tree.add(4832, 5048, '4');
        tree.add(5696, 5912, '5');
        tree.add(2252, 2270, '6');

        expect(tree.overlaps(0, 6000).length).toEqual(6);
        expect(tree.overlaps(5000, 6000).length).toEqual(2);

        tree.remove('1');
        tree.remove('2');
        tree.remove('3');
        tree.remove('4');
        tree.remove('5');
        tree.remove('6');

        expect(tree.overlaps(0, 6000).length).toEqual(0);
    })
});