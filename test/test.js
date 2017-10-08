const assert = require('assert');
describe('UniqueQueue', function() {
  const UQueue = require('../uq.js')

  it('should do simple queueing', function() {
    var testq = new UQueue();
    testq.enQ(5, 'a')
    testq.enQ(7, 'b')
    testq.enQ(3, 'c')
    testq.enQ(0, '0')
    assert.deepEqual([5, 'a'], testq.deQ());
    assert.deepEqual([7, 'b'], testq.deQ());
    assert.deepEqual([3, 'c'], testq.deQ());
    assert.deepEqual([0, '0'], testq.deQ());
    assert.strictEqual(undefined, testq.deQ());
  });

  it('should replace existing id and move to end of queue', function() {
    var testq = new UQueue();
    testq.enQ(5, 'a')
    testq.enQ(7, 'b')
    testq.enQ(5, 'c')
    testq.enQ(0, '0')
    assert.deepEqual([7, 'b'], testq.deQ());
    assert.deepEqual([5, 'c'], testq.deQ());
    assert.deepEqual([0, '0'], testq.deQ());
    assert.strictEqual(undefined, testq.deQ());
  });

  it('should peek correctly', function() {
    var testq = new UQueue();
    testq.enQ(5, 'a')
    testq.enQ(7, 'b')
    testq.enQ(5, 'c')
    testq.enQ(0, '0')
    assert.deepEqual([7, 'b'], testq.peek());
    assert.deepEqual([5, 'c'], testq.peek(1));
    assert.deepEqual([0, '0'], testq.peek(2));
    assert.strictEqual(undefined, testq.peek(3));
  });
});
