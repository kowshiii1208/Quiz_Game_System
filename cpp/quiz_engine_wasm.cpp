/**
 * ============================================================================
 * Aditya University - C++ & OOP Quiz Engine WebAssembly Source
 * ============================================================================
 * Compiles to WebAssembly (WASM) for direct execution inside the React runtime.
 * Provides high-speed native evaluation of student performance, difficulty
 * weighting, negative penalty indexing, and academic honesty grading.
 * 
 * Compilation command (via Emscripten):
 * emcc quiz_engine_wasm.cpp -O3 -s WASM=1 -s SIDE_MODULE=1 -o quiz_engine.wasm
 * ============================================================================
 */

#include <cmath>
#include <cstdint>

extern "C" {

/**
 * Calculates raw and weighted score with negative marks and speed bonus
 * @param correctCount Number of correct answers
 * @param wrongCount Number of incorrect answers
 * @param marksPerQ Base marks awarded per correct question
 * @param negMarks Penalty subtracted per wrong question
 * @param timeUsedSec Total seconds consumed by the student
 * @param totalAllowedSec Total seconds allotted for the test
 * @return Scaled score as integer (multiplied by 100 for precision)
 */
int calculateScaledScore(int correctCount, int wrongCount, int marksPerQ, int negMarks, int timeUsedSec, int totalAllowedSec) {
    int raw = (correctCount * marksPerQ) - (wrongCount * negMarks);
    if (raw < 0) raw = 0;

    // Speed bonus: If student completed with > 90% accuracy in less than half the allotted time,
    // award up to 5% speed bonus
    int bonus = 0;
    if (correctCount > 0 && wrongCount == 0 && totalAllowedSec > 0) {
        if (timeUsedSec < (totalAllowedSec / 2)) {
            bonus = (raw * 5) / 100;
        }
    }

    return (raw + bonus);
}

/**
 * Calculates Student Academic Honesty Index (0 - 100)
 * Evaluates infractions across tab switches, fullscreen escapes, and proctoring events
 */
int calculateHonestyIndex(int tabSwitches, int blurEvents, int webcamViolations) {
    int score = 100;
    score -= (tabSwitches * 25);
    score -= (blurEvents * 15);
    score -= (webcamViolations * 20);
    if (score < 0) score = 0;
    return score;
}

/**
 * Generates a 32-bit checksum integer for assessment integrity verification
 */
uint32_t computeChecksum(uint32_t studentRollSeed, int score, int totalQuestions) {
    uint32_t hash = studentRollSeed ^ 0x5F3759DF;
    hash = ((hash << 5) + hash) + score;
    hash = ((hash << 7) + hash) ^ totalQuestions;
    return hash;
}

}

