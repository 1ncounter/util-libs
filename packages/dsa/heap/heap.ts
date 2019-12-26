import { IHeap } from './heap.interface';

function swap(array: number[], i: number, j: number) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

class Heap implements IHeap {
  private data: number[] = [];

  private buildMaxHeap() {
    const len = this.data.length;
    for (let i = Math.floor(len / 2); i >= 0; i--) {
      this.maxHeapify(i);
    }
  }

  private maxHeapify(i: number) {
    const heapSize = this.data.length;
    const l = i * 2 + 1;
    const r = i * 2 + 2;
    let largest = i;

    if (l < heapSize && this.data[l] > this.data[largest]) {
      largest = l;
    }
    if (r < heapSize && this.data[r] > this.data[largest]) {
      largest = r;
    }

    if (largest !== i) {
      swap(this.data, i, largest);
      this.maxHeapify(largest);
    }
  }
}

// const heapSort = function (A) {
//   buildMaxHeap(A)
//   A.heapSize = A.length
//   for (let i = A.length - 1; i >= 0; i--) {
//     swap(A, 0, i)
//     A.heapSize--
//     maxHeapify(A, A.heapSize, 0)
//   }
//   return A
// }
