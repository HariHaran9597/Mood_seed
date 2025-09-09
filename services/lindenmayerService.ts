
import { LineSegment } from '../types';

export const generateLSystem = (axiom: string, rules: { [key: string]: string }, iterations: number): string => {
  let currentString = axiom;
  for (let i = 0; i < iterations; i++) {
    let newString = '';
    for (const char of currentString) {
      newString += rules[char] || char;
    }
    currentString = newString;
  }
  return currentString;
};

type TurtleState = {
  x: number;
  y: number;
  angle: number;
  length: number;
  strokeWidth: number;
};

export const interpretLSystem = (
  lSystemString: string,
  initialAngle: number,
  turnAngle: number,
  branchLength: number,
  lengthFactor: number,
  strokeWidth: number
): LineSegment[] => {
  const lines: LineSegment[] = [];
  const stack: TurtleState[] = [];
  let currentState: TurtleState = {
    x: 0,
    y: 0,
    angle: initialAngle,
    length: branchLength,
    strokeWidth: strokeWidth,
  };

  for (const char of lSystemString) {
    switch (char) {
      case 'F':
      case 'G':
        const newX = currentState.x + currentState.length * Math.cos(currentState.angle * (Math.PI / 180));
        const newY = currentState.y + currentState.length * Math.sin(currentState.angle * (Math.PI / 180));
        lines.push({
          x1: currentState.x,
          y1: currentState.y,
          x2: newX,
          y2: newY,
          strokeWidth: currentState.strokeWidth,
        });
        currentState.x = newX;
        currentState.y = newY;
        break;
      case '+':
        currentState.angle += turnAngle;
        break;
      case '-':
        currentState.angle -= turnAngle;
        break;
      case '[':
        stack.push({ ...currentState });
        currentState.length *= lengthFactor;
        currentState.strokeWidth *= 0.8;
        break;
      case ']':
        const poppedState = stack.pop();
        if (poppedState) {
          currentState = poppedState;
        }
        break;
    }
  }
  return lines;
};
