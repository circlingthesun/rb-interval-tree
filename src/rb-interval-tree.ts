enum Direction {
  LEFT,
  RIGHT
}

enum Color {
  RED,
  BLACK
}

function color(node: ITNode<any, any> | null) {
  return node ? node.color : Color.BLACK
}

function getGrandParent(
  node: ITNode<any, any> | null
): ITNode<any, any> | null {
  if (node && node.parent) {
    return node.parent.parent
  }
  return null
}

function getUncle(node: ITNode<any, any> | null): ITNode<any, any> | null {
  const grandparent = getGrandParent(node)
  if (grandparent === null || node === null) {
    return null
  }

  return grandparent.getChild(
    node.parent === grandparent.left ? Direction.RIGHT : Direction.LEFT
  )
}

class ITNode<RangeType, ValueType> {
  parent: ITNode<RangeType, ValueType> | null
  right: ITNode<RangeType, ValueType> | null
  left: ITNode<RangeType, ValueType> | null
  color: Color
  max: RangeType
  start: RangeType
  end: RangeType
  value: ValueType

  constructor(
    start: RangeType,
    end: RangeType,
    value: ValueType,
    color: Color = Color.RED
  ) {
    this.parent = null
    this.right = null
    this.left = null
    this.color = color
    this.max = end
    this.start = start
    this.end = end
    this.value = value
  }

  getChild(currentDir: Direction): ITNode<RangeType, ValueType> | null {
    return currentDir ? this.right : this.left
  }

  setChild(currentDir: Direction, val: ITNode<RangeType, ValueType>) {
    this[currentDir ? 'right' : 'left'] = val
    if (val) {
      val.parent = this
    }
  }

  updateMax() {
    this.max = this.end

    if (this.left && this.left.max > this.max) {
      this.max = this.left.max
    }

    if (this.right && this.right.max > this.max) {
      this.max = this.right.max
    }

    if (this.parent) {
      this.parent.updateMax()
    }
  }
}

export default class IntervalTree<RangeType, ValueType> {
  size = 0
  root: ITNode<RangeType, ValueType> | null = null
  valueMap = new Map()

  fixInsert(node: ITNode<RangeType, ValueType> | null) {
    // Is root or parent is Color.BLACK
    if (node!.parent === null) {
      node!.color = Color.BLACK
      return
    }

    // Fix 2
    if (color(node!.parent) === Color.BLACK) {
      return
    }

    // Fix 3
    const uncle = getUncle(node) as ITNode<RangeType, ValueType>
    let parent: ITNode<RangeType, ValueType> = node!.parent
    if (color(uncle) === Color.RED) {
      parent.color = Color.BLACK
      uncle!.color = Color.BLACK

      const grandparent = getGrandParent(node)
      grandparent!.color = Color.RED
      this.fixInsert(grandparent)
      return
    }

    // Fix 4
    let grandparent = getGrandParent(node) as ITNode<RangeType, ValueType>
    let nodeSide = parent.right === node ? Direction.RIGHT : Direction.LEFT
    const parentSide =
      grandparent.right === parent ? Direction.RIGHT : Direction.LEFT
    if (nodeSide !== parentSide) {
      this.rotate(parent, parentSide)
      node = node!.getChild(parentSide)

      parent = node!.parent as ITNode<RangeType, ValueType>
      grandparent = getGrandParent(node) as ITNode<RangeType, ValueType>
      nodeSide = parent!.right === node ? Direction.RIGHT : Direction.LEFT
    }

    // Fix 5
    parent!.color = Color.BLACK
    grandparent.color = Color.RED
    this.rotate(
      grandparent as ITNode<RangeType, ValueType>,
      !nodeSide ? Direction.RIGHT : Direction.LEFT
    )
  }

  rotate(node: ITNode<RangeType, ValueType>, direction: Direction) {
    const parent = node.parent
    const pivot = node.getChild(
      !direction ? Direction.RIGHT : Direction.LEFT
    ) as ITNode<RangeType, ValueType>

    node.setChild(
      !direction ? Direction.RIGHT : Direction.LEFT,
      pivot.getChild(direction)
    )
    pivot.setChild(direction, node)

    if (parent) {
      parent.setChild(
        parent.right === node ? Direction.RIGHT : Direction.LEFT,
        pivot
      )
    } else {
      this.root = pivot
      this.root!.parent = null
    }

    node.updateMax()
  }

  insert(start: RangeType, end: RangeType, value: ValueType) {
    if (this.valueMap.has(value)) {
      console.warn('Duplicate insert', value)
    }

    const newNode = new ITNode<RangeType, ValueType>(start, end, value)

    if (!this.root) {
      this.root = newNode
      this.root.color = Color.BLACK
      this.size++
    } else {
      let lastNode = this.root
      while (true) {
        const direction =
          newNode.end > lastNode.end ? Direction.RIGHT : Direction.LEFT
        const currentNode = lastNode.getChild(direction)
        if (currentNode === null) {
          lastNode.setChild(direction, newNode)
          this.size++
          break
        } else {
          lastNode = currentNode
        }
      }
    }

    this.fixInsert(newNode)
    newNode.updateMax()
    this.valueMap.set(value, newNode)
    return newNode
  }

  fixDelete(
    node: ITNode<RangeType, ValueType> | null,
    parent: ITNode<RangeType, ValueType> | null
  ) {
    if (parent === null) {
      return
    }

    let sibling = parent.right === node ? parent.left : parent.right

    if (color(sibling) === Color.RED) {
      parent.color = Color.RED
      sibling!.color = Color.BLACK
      this.rotate(
        parent,
        parent.right === node ? Direction.RIGHT : Direction.LEFT
      )
    } else if (
      color(parent) === Color.BLACK &&
      color(sibling) === Color.BLACK &&
      color(sibling!.left) === Color.BLACK &&
      color(sibling!.right) === Color.BLACK
    ) {
      sibling!.color = Color.RED
      this.fixDelete(parent, parent!.parent)
    } else if (
      color(parent) === Color.RED &&
      color(sibling) === Color.BLACK &&
      color(sibling!.left) === Color.BLACK &&
      color(sibling!.right) === Color.BLACK
    ) {
      sibling!.color = Color.RED
      sibling!.parent!.color = Color.BLACK
    } else {
      if (color(sibling) === Color.BLACK) {
        if (
          node === parent.left &&
          color(sibling!.right) === Color.BLACK &&
          color(sibling!.left) === Color.RED
        ) {
          sibling!.color = Color.RED
          sibling!.left!.color = Color.BLACK
          this.rotate(sibling as ITNode<RangeType, ValueType>, Direction.RIGHT)
        } else if (
          node === parent.right &&
          color(sibling!.left) === Color.BLACK &&
          color(sibling!.right) === Color.RED
        ) {
          sibling!.color = Color.RED
          sibling!.right!.color = Color.BLACK
          this.rotate(sibling as ITNode<RangeType, ValueType>, Direction.LEFT)
        }
      }

      sibling = parent.right === node ? parent.left : parent.right

      sibling!.color = color(parent)
      parent.color = Color.BLACK

      sibling!.getChild(
        node === parent.left ? Direction.RIGHT : Direction.LEFT
      )!.color = Color.BLACK
      this.rotate(
        parent,
        node === parent.right ? Direction.RIGHT : Direction.LEFT
      )
    }
  }

  remove(value: ValueType) {
    if (this.root === null) {
      return
    }

    let node = this.valueMap.get(value)

    if (!node) {
      console.warn('Cannot find: ', value)
      return
    }

    if (node.right && node.left) {
      let replacement = node.left
      // Find Direction.RIGHT most node, Direction.RIGHT most node should have no Direction.RIGHT child
      while (true) {
        if (replacement.right === null) {
          break
        }
        replacement = replacement.right
      }

      // swap in placeholder
      const placeholder = new ITNode<RangeType, ValueType>(
        replacement.start,
        replacement.end,
        null,
        replacement.color
      )
      replacement.parent.setChild(
        replacement.parent.right === replacement,
        placeholder
      )
      placeholder.setChild(Direction.LEFT, replacement.left)

      // assign new children
      replacement.setChild(Direction.LEFT, node.left)
      replacement.setChild(Direction.RIGHT, node.right)

      replacement.color = node.color

      if (node.parent) {
        node.parent.setChild(node.parent.right === node, replacement)
      } else {
        this.root = replacement
        this.root!.parent = null
      }

      // node placeholder is the new deletion target
      node = placeholder
    }

    const child = node.right || node.left

    if (node.parent) {
      node.parent.setChild(node.parent.right === node, child)
    } else {
      this.root = child
      // if (this.size > 1) {
      //     this.root.parent = null;
      // }
    }

    if (color(node) === Color.BLACK) {
      if (color(child) === Color.RED) {
        child.color = Color.BLACK
      } else {
        this.fixDelete(child, node.parent)
      }
    }

    if (this.size > 1) {
      ;(child || node.parent).updateMax()
    }

    this.valueMap.delete(value)
    this.size--
  }

  // TODO: Deal with open and closed intervals
  search(start: RangeType, end: RangeType) {
    const results: [RangeType, RangeType, ValueType][] = []
    function searchRecursive(node: ITNode<RangeType, ValueType>) {
      if (!node || start > node.max) {
        return
      }

      if (node.left !== null) {
        searchRecursive(node.left)
      }

      if (node.start < end && node.end > start) {
        results.push([node.start, node.end, node.value])
      }

      if (node.right !== null) {
        searchRecursive(node.right)
      }
    }

    searchRecursive(this.root as ITNode<RangeType, ValueType>)
    return results
  }

  copy(valueCopier = (v: ValueType) => v) {
    // Build copy with same values
    const newTree = new IntervalTree()
    newTree.size = this.size
    newTree.root = copyRecursive(this.root)

    function copyRecursive(
      original: ITNode<RangeType, ValueType> | null,
      copyParent: ITNode<RangeType, ValueType> | null = null
    ) {
      if (original === null) {
        return null
      }

      const copy = new ITNode<RangeType, ValueType>(
        original.start,
        original.end,
        valueCopier(original.value)
      )
      copy.color = original.color
      copy.max = original.max
      copy.parent = copyParent

      newTree.valueMap.set(copy.value, copy)

      if (original.left) {
        copy.left = copyRecursive(original.left, copy)
      }

      if (original.right) {
        copy.right = copyRecursive(original.right, copy)
      }

      return copy
    }

    return newTree
  }

  visit(visitor: (v: ValueType, s: RangeType, end: RangeType) => void) {
    visitRecurse(this.root)

    function visitRecurse(node: ITNode<RangeType, ValueType> | null) {
      if (node === null) {
        return
      }
      visitRecurse(node.left)
      visitor(node.value, node.start, node.end)
      visitRecurse(node.right)
    }
  }
}
