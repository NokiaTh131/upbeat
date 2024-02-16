export type ConstructionPlan = {
  max_dep: number;
  cost: number;
  opponentLoc: number;
  rows: number;
  dir: number;
  currow: number;
  m: number;
  int: number;
  random: number;
  t: number;
  curcol: number;
  deposit: number;
  interest_pct: number;
  cols: number;
  budget: number;
};

export type CityCrew = {
  currentRow: number;
  currentCol: number;
  player_Id: number;
};

export type Player = {
  name: string;
  id: number;
  cityCrew: CityCrew;
  bindings: ConstructionPlan;
  filePath: string;
  constructionplan: string;
  budget: number;
  centerLoc: [number, number];
};

export type Cell = {
  p: Player;
  deposit: number;
  row: number;
  col: number;
  citycenter: boolean;
  player_Id: number;
};

export type Map = {
  adjacencyMatrix: Cell[][];
  row: number;
  col: number;
};

export type ApiResponse = {
  map: Map;
  players: Player[];
};
