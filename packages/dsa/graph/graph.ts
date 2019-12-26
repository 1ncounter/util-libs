class Vertex<T> {
  data: T = null;
  index: number;
  edges: Egde<T>[];
  visited: boolean = false;

  constructor(val: T, index: number) {
    this.data = val;
    this.index = index;
  }

  addEgde(edge: Egde<T>) {
    this.edges.push(edge);
  }
}

class Egde<T> {
  from: Vertex<T>;
  to: Vertex<T>;
  weight: number;

  constructor(from: Vertex<T>, to: Vertex<T>, weight: number) {
    this.from = from;
    this.to = to;
    this.weight = weight;
  }
}

export class Graph<T> {
  private vertices: Vertex<T>[] = [];
  private adjacencyList: Egde<T>[] = [];

  /**
   * 创建顶点
   */
  createVertex(value: T): Vertex<T> {
    const vertex = new Vertex<T>(value, 0);

    this.vertices.push(vertex);

    return vertex;
  }

  /**
   * 添加有向边
   */
  addDirectedEdge(
    fromVertex: Vertex<T>,
    toVertex: Vertex<T>,
    weightValue?: number
  ) {
    const edge = new Egde<T>(fromVertex, toVertex, weightValue);
  }

  /**
   * 添加无向边
   */
  addUnDirectedEdge(
    fromVertex: Vertex<T>,
    toVertex: Vertex<T>,
    weightValue?: number
  ) {}

  printAdjacencyListByBfs() {}
  printAdjacencyListByDfs() {}
}
