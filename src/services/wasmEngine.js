/**
 * WebAssembly C++ Evaluation Engine Bridge
 * Loads and runs compiled WebAssembly native bytecode directly in the browser
 * to execute high-speed mathematical assessment scoring, weighting, and honesty indexing.
 */

// Native WebAssembly binary bytes compiled from cpp/quiz_engine_wasm.cpp
const WASM_BYTECODE = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 16, 2, 96, 4, 127, 127, 127, 127, 1, 127, 
  96, 3, 127, 127, 127, 1, 127, 3, 3, 2, 0, 1, 7, 37, 2, 14, 99, 97, 108, 
  99, 117, 108, 97, 116, 101, 83, 99, 111, 114, 101, 0, 0, 16, 99, 97, 108, 
  99, 117, 108, 97, 116, 101, 72, 111, 110, 101, 115, 116, 121, 0, 1, 10, 
  39, 2, 13, 0, 32, 0, 32, 2, 108, 32, 1, 32, 3, 108, 107, 11, 23, 0, 65, 
  228, 0, 32, 0, 65, 25, 108, 107, 32, 1, 65, 15, 108, 107, 32, 2, 65, 20, 
  108, 107, 11
]);

let wasmInstance = null;
let isWasmInitialized = false;

export const WasmEngine = {
  /**
   * Initializes WebAssembly Runtime
   */
  init: async () => {
    if (isWasmInitialized && wasmInstance) return wasmInstance;
    try {
      if (typeof WebAssembly !== 'undefined') {
        const result = await WebAssembly.instantiate(WASM_BYTECODE);
        wasmInstance = result.instance.exports;
        isWasmInitialized = true;
        console.log("⚡ [WasmEngine] Native C++ WebAssembly Engine initialized successfully (v1.4)");
        return wasmInstance;
      }
    } catch (err) {
      console.warn("WebAssembly instantiation failed, falling back to JS math bridge", err);
    }
    return null;
  },

  /**
   * Evaluates student score using WebAssembly with speed and penalty weighting
   */
  calculateScore: async (correctCount, wrongCount, marksPerQ = 4, negMarks = 1, timeTakenSec = 0, totalTimeSec = 600) => {
    try {
      const instance = await WasmEngine.init();
      if (instance && typeof instance.calculateScore === 'function') {
        const rawWasmScore = instance.calculateScore(correctCount, wrongCount, marksPerQ, negMarks);
        let finalScore = Math.max(0, rawWasmScore);
        
        // Speed bonus if flawless in under half time
        if (correctCount > 0 && wrongCount === 0 && timeTakenSec < (totalTimeSec / 2)) {
          finalScore = Math.round(finalScore * 1.05); // 5% speed bonus
        }
        return {
          score: finalScore,
          engine: "WebAssembly (C++ Native Engine)",
          wasmActive: true
        };
      }
    } catch (e) {
      console.error("WASM Score execution error", e);
    }

    // High-precision fallback
    const raw = (correctCount * marksPerQ) - (wrongCount * negMarks);
    return {
      score: Math.max(0, raw),
      engine: "JavaScript Emulated Runtime",
      wasmActive: false
    };
  },

  /**
   * Calculates Academic Honesty Rating using WebAssembly
   */
  calculateHonestyIndex: async (tabSwitches = 0, blurEvents = 0, webcamViolations = 0) => {
    try {
      const instance = await WasmEngine.init();
      if (instance && typeof instance.calculateHonesty === 'function') {
        const rating = instance.calculateHonesty(tabSwitches, blurEvents, webcamViolations);
        return Math.max(0, Math.min(100, rating));
      }
    } catch (e) {
      console.error("WASM Honesty execution error", e);
    }

    const rating = 100 - (tabSwitches * 25) - (blurEvents * 15) - (webcamViolations * 20);
    return Math.max(0, Math.min(100, rating));
  },

  /**
   * Checks if WASM is supported in the current environment
   */
  isSupported: () => {
    return typeof WebAssembly !== 'undefined' && typeof WebAssembly.instantiate === 'function';
  }
};

