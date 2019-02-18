import IntervalTree from '../src/rb-interval-tree'

describe('Interval tree', function() {
  let tree = new IntervalTree()
  it('should insert', function() {
    tree.insert(4, 7, 'foo')
    const results = tree.search(0, 10)
    expect(results[0]).toEqual([4, 7, 'foo'])
  })

  it('should find left overlap', function() {
    expect(tree.search(3, 5).length).toEqual(1)
  })

  it('should find center overlap', function() {
    expect(tree.search(5, 6).length).toEqual(1)
  })

  it('should find right overlap', function() {
    expect(tree.search(6, 10).length).toEqual(1)
  })

  it('should find complete overlap', function() {
    expect(tree.search(0, 10).length).toEqual(1)
  })

  it('should not remove non existing node', function() {
    tree.remove('bar')
    expect(tree.search(0, 10).length).toEqual(1)
  })

  it('should remove', function() {
    tree.remove('foo')
    const results = tree.search(0, 10)
    expect(results.length).toEqual(0)
  })

  it('should not remove from empty tree', function() {
    tree.remove('bar')
    expect(tree.search(0, 10).length).toEqual(0)
  })

  it('should handle many insertions and deletions', function() {
    tree.insert(2240, 2456, '1')
    tree.insert(3104, 3320, '2')
    tree.insert(3968, 4184, '3')
    tree.insert(4832, 5048, '4')
    tree.insert(5696, 5912, '5')
    tree.insert(2252, 2270, '6')

    expect(tree.search(0, 6000).length).toEqual(6)
    expect(tree.search(5000, 6000).length).toEqual(2)

    tree.remove('1')
    tree.remove('2')
    tree.remove('3')
    tree.remove('4')
    tree.remove('5')
    tree.remove('6')

    expect(tree.search(0, 6000).length).toEqual(0)
  })

  it('should copy tree', function() {
    tree.insert(3104, 3176, '1')
    tree.insert(3176, 3194, '2')
    tree.insert(2420, 2438, '3')
    tree.insert(5696, 5768, '4')
    tree.insert(2240, 2249, '5')
    tree.insert(3212, 3236, '6')
    tree.insert(5840, 5852, '7')

    const cpy = tree.copy()
    expect(tree.search(0, 6000).length).toEqual(7)
  })

  it('should visit tree', function() {
    let c = 0
    tree.visit(() => {
      c++
    })
    expect(c).toEqual(7)
  })
})

describe('Interval tree', function() {
  let tree = new IntervalTree()
  it('should handle many insertions and deletions 2', function() {
    for (let i = 0; i < 100; i++) {
      let start = 1
      let end = i
      tree.insert(start, end, end)
    }

    tree.remove(tree.root.right.right.value)
    tree.remove(tree.root.value)
    tree.remove(tree.root.right.right.value)
    tree.remove(tree.root.value)

    tree.remove(tree.root.right.left.value)
    tree.remove(tree.root.left.right.left.value)
    tree.remove(tree.root.right.left.value)
    tree.remove(tree.root.value)

    tree.remove(tree.root.left.left.left.value)
    tree.remove(tree.root.left.left.left.value)
    tree.remove(tree.root.left.left.left.value)

    tree.remove(tree.root.right.right.right.value)
    tree.remove(tree.root.right.right.right.value)
    tree.remove(tree.root.right.right.right.value)
    tree.remove(tree.root.right.right.right.value)
    tree.remove(tree.root.right.right.right.value)

    tree.remove(tree.root.right.left.right.value)
    tree.remove(tree.root.left.right.left.value)

    tree.remove(tree.root.right.left.right.value)
    tree.remove(tree.root.left.right.left.value)

    tree.remove(tree.root.right.left.right.value)
    tree.remove(tree.root.left.right.left.value)

    tree.remove(tree.root.right.left.right.value)
    tree.remove(tree.root.left.right.left.value)

    tree.remove(tree.root.right.left.right.value)
    tree.remove(tree.root.left.right.left.value)

    tree.remove(tree.root.right.left.right.value)
    tree.remove(tree.root.left.right.left.value)
  })
})
