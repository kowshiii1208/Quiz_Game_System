import * as XLSX from 'xlsx';

/**
 * Institutional Excel (.xlsx) Report Generator
 * Generates formatted, multi-sheet Excel reports for Admin / Faculty evaluation.
 */
export const ExcelExportService = {
  /**
   * Generates and downloads an Excel report for a specific custom quiz
   * @param {Object} quiz - Quiz metadata (title, id, duration, etc.)
   * @param {Array} candidates - Array of candidate attempt records
   */
  exportQuizReportToExcel: (quiz, candidates = []) => {
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Candidate Results
      const candidateRows = candidates.map((c, index) => {
        const isPass = !c.cheatingDetected && (c.percentage >= (quiz?.passingPercentage || 60));
        return {
          "Rank": index + 1,
          "Candidate Name": c.student?.name || "N/A",
          "Roll Number / ID": c.student?.rollNumber || "N/A",
          "College / Institution": c.student?.college || "Aditya University",
          "Language Track": c.student?.language || "C++",
          "Score Obtained": c.score || 0,
          "Maximum Marks": c.maxScore || 0,
          "Percentage (%)": `${Math.round(c.percentage || 0)}%`,
          "Assessment Status": c.cheatingDetected ? "DISQUALIFIED (Cheating)" : isPass ? "PASSED" : "FAILED",
          "Time Taken (sec)": c.timeTakenSec || 0,
          "Proctoring Flags": c.cheatingDetected ? "YES" : "CLEAN",
          "Violation Reason": c.disqualificationReason || "None",
          "Submission Date & Time": c.timestamp || new Date().toLocaleString(),
          "Certificate ID / Reference": c.certId || c.id || "N/A"
        };
      });

      const wsCandidates = XLSX.utils.json_to_sheet(candidateRows);

      // Sheet 2: Quiz Statistics & Summary
      const totalCandidates = candidates.length;
      const passedCount = candidates.filter(c => !c.cheatingDetected && (c.percentage >= (quiz?.passingPercentage || 60))).length;
      const passRate = totalCandidates > 0 ? `${Math.round((passedCount / totalCandidates) * 100)}%` : "0%";
      const averageScore = totalCandidates > 0 ? (candidates.reduce((acc, c) => acc + (c.score || 0), 0) / totalCandidates).toFixed(1) : "0";
      const highestScore = totalCandidates > 0 ? Math.max(...candidates.map(c => c.score || 0)) : 0;
      const cheatingCount = candidates.filter(c => c.cheatingDetected).length;

      const summaryData = [
        { "Metric": "Institution Name", "Value": "Aditya University" },
        { "Metric": "Department", "Value": "Department of Computer Science & Engineering" },
        { "Metric": "Assessment Title", "Value": quiz?.title || "Custom Assessment" },
        { "Metric": "Quiz Access Code", "Value": quiz?.id || "N/A" },
        { "Metric": "Language / Track", "Value": quiz?.language || "Mixed" },
        { "Metric": "Duration Allotted", "Value": `${quiz?.durationMinutes || 15} Minutes` },
        { "Metric": "Passing Benchmark", "Value": `${quiz?.passingPercentage || 60}%` },
        { "Metric": "Total Candidates Attempted", "Value": totalCandidates },
        { "Metric": "Candidates Passed", "Value": passedCount },
        { "Metric": "Institutional Pass Rate", "Value": passRate },
        { "Metric": "Average Score", "Value": averageScore },
        { "Metric": "Highest Score Achieved", "Value": highestScore },
        { "Metric": "Proctoring Violations Flagged", "Value": cheatingCount },
        { "Metric": "Report Generated On", "Value": new Date().toLocaleString() }
      ];

      const wsSummary = XLSX.utils.json_to_sheet(summaryData);

      // Append sheets
      XLSX.utils.book_append_sheet(wb, wsCandidates, "Candidate Results");
      XLSX.utils.book_append_sheet(wb, wsSummary, "Quiz Analytics & Summary");

      // File download
      const safeTitle = (quiz?.title || "Assessment").replace(/[^a-zA-Z0-9_-]/g, "_");
      const filename = `Aditya_Quiz_Report_${quiz?.id || 'AU'}_${safeTitle}.xlsx`;
      XLSX.writeFile(wb, filename);

      return true;
    } catch (err) {
      console.error("Excel generation error:", err);
      alert("Failed to export Excel report. Please check console.");
      return false;
    }
  },

  /**
   * Generates and downloads an Excel report for all records in the leaderboard
   */
  exportLeaderboardToExcel: (records = []) => {
    try {
      const wb = XLSX.utils.book_new();

      const rows = records.map((r, idx) => ({
        "Rank": idx + 1,
        "Student Name": r.student?.name || "N/A",
        "Roll Number": r.student?.rollNumber || "N/A",
        "College": r.student?.college || "Aditya University",
        "Language": r.student?.language || "C++",
        "Difficulty": r.student?.difficulty || "MIXED",
        "Quiz Title / Code": r.quizTitle || r.quizId || "Standard Assessment",
        "Score": r.score || 0,
        "Max Score": r.maxScore || 0,
        "Percentage": `${Math.round(r.percentage || 0)}%`,
        "Time Taken (s)": r.timeTakenSec || 0,
        "Honesty Status": r.cheatingDetected ? "FLAGGED" : "VERIFIED",
        "Flag Reason": r.disqualificationReason || "None",
        "Timestamp": r.timestamp || "N/A"
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, "Master Leaderboard");
      XLSX.writeFile(wb, `Aditya_Master_Assessment_Leaderboard_${Date.now()}.xlsx`);
      return true;
    } catch (err) {
      console.error("Master Excel export error:", err);
      return false;
    }
  }
};

