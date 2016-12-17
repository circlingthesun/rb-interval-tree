let IntervalTree = require('./interval-tree');

describe("Interval tree", function() {
    let tree = new IntervalTree();
    it("can insert", function() {
        tree.add(4, 7, 'foo');
        const results = tree.overlaps(0, 10);
        expect(results[0]).toEqual([ 4, 7, 'foo' ]);
    });

    it("can find left overlap", function() {
        const results = tree.overlaps(3, 5);
        expect(results.length).toEqual(1);
    });

    it("can find center overlap", function() {
        const results = tree.overlaps(5, 6);
        expect(results.length).toEqual(1);
    });

    it("can find right overlap", function() {
        const results = tree.overlaps(6, 10);
        expect(results.length).toEqual(1);
    });

    it("can find complete overlap", function() {
        const results = tree.overlaps(0, 10);
        expect(results.length).toEqual(1);
    });

    it("can remove", function() {
        tree.remove('foo');
        const results = tree.overlaps(0, 10);
        expect(results.length).toEqual(0);
    });

});