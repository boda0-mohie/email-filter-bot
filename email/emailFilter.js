function filterEmail({ from, subject, content }) {
  const fromLower = from.toLowerCase();
  const subjectLower = subject.toLowerCase();
  const contentLower = content.toLowerCase();

  if (
    fromLower.includes("linkedin") ||
    subjectLower.includes("job") ||
    contentLower.includes("job" || "career" || "hiring" || "position" || "vacancy")
  ) {
    return {
      category: "JOB",
      important: true,
    };
  }

  if (fromLower.includes("newsletter")) {
    return {
      category: "NEWSLETTER",
      important: false,
    };
  }

  return {
    category: "OTHER",
    important: false,
  };
}

module.exports = { filterEmail };
