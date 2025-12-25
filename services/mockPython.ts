import { LevelConfig } from '../types';

// This function simulates a Python backend by using Regex to validate input against expected patterns.
// In a real production app, this would send code to a secure backend (FastAPI/Docker).

export const executeCode = (code: string, level: LevelConfig): { success: boolean; message: string; output?: string } => {
  try {
    // 1. Basic Syntax Check (Simulation)
    if (code.trim() === '') {
      return { success: false, message: "SyntaxError: Unexpected EOF while parsing", output: "" };
    }

    // 2. Level Specific Validation
    return level.validationLogic(code);

  } catch (e) {
    return { success: false, message: "RuntimeError: System Crash", output: "" };
  }
};
