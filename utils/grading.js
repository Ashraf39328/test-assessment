// Converts a percentage score into a letter grade
function percentageToGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  if (percentage >= 40) return "E";
  return "F";
}

// Determines if a submission is fully graded (no subjective answers left pending)
function isFullyGraded(answers) {
  return answers.every((a) => a.marksAwarded !== null && a.marksAwarded !== undefined);
}

module.exports = { percentageToGrade, isFullyGraded };
