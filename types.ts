
export interface PlantParameters {
  mood: string;
  axiom: string;
  rules: { [key: string]: string };
  iterations: number;
  initialAngle: number;
  turnAngle: number;
  branchLength: number;
  lengthFactor: number;
  strokeWidth: number;
  colorStops: { offset: string; color: string }[];
}

export interface Plant {
  id: string;
  date: string;
  journalText: string;
  params: PlantParameters;
}

export interface LineSegment {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    strokeWidth: number;
}

export enum View {
    CREATE,
    GARDEN,
    DETAIL
}
