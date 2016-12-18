const RED = 0;
const BLACK = 1;
const LEFT = 0;
const RIGHT = 1;

function color(node) {
    return node ? node.color : BLACK;
}

function getGrandParent(node) {
    if (node && node.parent){
        return node.parent.parent;
    }
    return null;
}

function getUncle(node) {
    const grandparent = getGrandParent(node);
    if (!grandparent){
        return null;
    }
    return grandparent.getChild(node.parent === grandparent.left);
}

class Node {
    constructor(start, end, value, color = RED) {
        this.parent = null;
        this.right = null;
        this.left = null;
        this.color = color;
        this.max = end;
        this.start = start;
        this.end = end;

        this.value = value;
    }

    getChild(currentDir) {
        return currentDir ? this.right : this.left;
    }

    setChild(currentDir, val) {
        this[currentDir ? 'right' : 'left'] = val;
        if (val){
            val.parent = this;
        }
    }

    updateMax(){
        this.max = this.end;

        if (this.left && this.left.max > this.max){
            this.max = this.left.max;
        }

        if (this.right && this.right.max > this.max){
            this.max = this.right.max;
        }

        if (this.parent) {
            this.parent.updateMax();
        }
    }
}

class IntervalTree {
    constructor(){
        this.size = 0;
        this.root = null;
        this.valueMap = new Map();
    }

    fixInsert(node) {
        // Is root or parent is black
        if (node.parent === null) {
            node.color = BLACK;
            return;
        }

        // Fix 2
        if (color(node.parent) === BLACK) {
            return;
        }

        // Fix 3
        const uncle = getUncle(node);
        let parent = node.parent;
        if (color(uncle) === RED) {
            parent.color = BLACK;
            uncle.color = BLACK;

            const grandparent = getGrandParent(node);
            grandparent.color = RED;
            this.fixInsert(grandparent);
            return;
        }

        // Fix 4
        let grandparent = getGrandParent(node);
        let nodeSide = parent.right === node;
        const parentSide = grandparent.right === parent;
        if (nodeSide !== parentSide) {
            this.rotate(parent, parentSide);
            node = node.getChild(parentSide);

            parent = node.parent;
            grandparent = getGrandParent(node);
            nodeSide = parent.right === node;
        }

        // Fix 5
        parent.color = BLACK;
        grandparent.color = RED;
        this.rotate(grandparent, !nodeSide);
    }

    rotate(node, direction) {
        const parent = node.parent;
        const pivot = node.getChild(!direction);

        node.setChild(!direction, pivot.getChild(direction));
        pivot.setChild(direction, node);

        if (parent) {
            parent.setChild(parent.right === node, pivot);
        } else {
            this.root = pivot;
            this.root.parent = null;
        }

        node.updateMax();
    }

    insert(start, end, value){
        if (this.valueMap.has(value)) {
            console.warn('Duplicate insert', value);
        }

        const newNode = new Node(start, end, value);

        if (!this.root){
            this.root = newNode;
            this.root.color = BLACK;
            this.size++;
        } else {
            let lastNode = this.root;
            while (true){
                const direction = newNode.end > lastNode.end ? RIGHT : LEFT;
                const currentNode = lastNode.getChild(direction);
                if (currentNode === null) {
                    lastNode.setChild(direction, newNode);
                    this.size++;
                    break;
                } else {
                    lastNode = currentNode;
                }
            }
        }

        this.fixInsert(newNode);
        newNode.updateMax();
        this.valueMap.set(value, newNode);
        return newNode;
    }

    fixDelete(node, parent){
        if (parent === null) {
            return;
        }

        let sibling = parent.right === node ? parent.left : parent.right;

        if (color(sibling) === RED) {
            parent.color = RED;
            sibling = BLACK;
            this.rotate(parent, parent.right === node);
        } else if (
                color(parent) === BLACK &&
                color(sibling) === BLACK &&
                color(sibling.left) === BLACK &&
                color(sibling.right) === BLACK) {
            sibling.color = RED;
            this.fixDelete(parent, parent.parent);
        } else if (
                color(parent) === RED &&
                color(sibling) === BLACK &&
                color(sibling.left) === BLACK &&
                color(sibling.right) === BLACK) {
            sibling.color = RED;
            sibling.parent.color = BLACK;
        } else {
            if (color(sibling) === BLACK) {
                if (node === parent.left &&
                        color(sibling.right) === BLACK &&
                        color(sibling.left) === RED) {
                    sibling.color = RED;
                    sibling.left.color = BLACK;
                    this.rotate(sibling, RIGHT);
                } else if (node === parent.right &&
                        color(sibling.left) === BLACK &&
                        color(sibling.right) === RED) {
                    sibling.color = RED;
                    sibling.right.color = BLACK;
                    this.rotate(sibling, LEFT);
                }
            }

            sibling = parent.right === node ? parent.left : parent.right;

            sibling.color = color(parent);
            parent.color = BLACK;

            sibling.getChild(node === parent.left).color = BLACK;
            this.rotate(parent, node === parent.right);
        }
    }

    remove(value) {
        if (this.root === null) {
            return;
        }

        let node = this.valueMap.get(value);

        if (!node){
            console.log('Cannot find: ', value);
            return;
        }

        if (node.right && node.left) {
            let replacement = node.left;
            // Find right most node, right most node should have no right child
            while (true) {
                if (replacement.right === null){
                    break;
                }
                replacement = replacement.right;
            }

            // swap in placeholder
            const placeholder = new Node(replacement.start, replacement.end, null, replacement.color);
            replacement.parent.setChild(replacement.parent.right === replacement, placeholder);
            placeholder.setChild(LEFT, replacement.left);

            // assign new children
            replacement.setChild(LEFT, node.left);
            replacement.setChild(RIGHT, node.right);

            replacement.color = node.color;

            if (node.parent) {
                node.parent.setChild(node.parent.right === node, replacement);
            } else {
                this.root = replacement;
                this.root.parent = null;
            }

            // node placeholder is the new deletion target
            node = placeholder;
        }


        const child = node.right || node.left;

        if (node.parent) {
            node.parent.setChild(node.parent.right === node, child);
        } else {
            this.root = child;
            // if (this.size > 1) {
            //     this.root.parent = null;
            // }
        }

        if (color(node) === BLACK) {
            if (color(child) === RED) {
                child.color = BLACK;
            } else {
                this.fixDelete(child, node.parent);
            }
        }

        if (this.size > 1) {
            (child || node.parent).updateMax();
        }

        this.valueMap.delete(value);
        this.size--;
    }

    // TODO: Deal with open and closed intervals
    search(start, end) {
        const results = [];
        function searchRecursive(node) {
            if (!node || start > node.max){
                return;
            }

            if (node.left !== null){
                searchRecursive(node.left);
            }

            if (node.start < end && node.end > start) {
                results.push([node.start, node.end, node.value]);
            }

            if (node.right !== null){
                searchRecursive(node.right);
            }
        }

        searchRecursive(this.root);
        return results;
    }

    copy(valueCopier = (v) => v) {
        // Build copy with same values
        const newTree = new IntervalTree();
        newTree.size = this.size;
        newTree.root = copyRecursive(this.root);

        function copyRecursive(original, copyParent = null){
            const copy = new Node();
            copy.color = color;
            copy.max = original.max;
            copy.start = original.start;
            copy.end = original.end;
            copy.value = valueCopier(original.value);
            copy.parent = copyParent;

            newTree.valueMap.set(copy.value, copy);

            if (original.left){
                copy.left = copyRecursive(original.left, copy);
            }

            if (original.right){
                copy.right = copyRecursive(original.right, copy);
            }

            return copy;
        }

        return newTree;
    }

    visit(visitor){
        visitRecurse(this.root);

        function visitRecurse(node) {
            if (!node){
                return;
            }
            visitRecurse(node.left);
            visitor(node.value, node.start, node.end);
            visitRecurse(node.right);
        }
    }
}

module.exports = IntervalTree;
