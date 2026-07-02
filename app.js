document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("reviewBtn");
  const titleInput = document.querySelector("input");
  const contextInput = document.querySelector("textarea");
  const result = document.getElementById("result");

  button.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const context = contextInput.value.trim();

    if (!title || !context) {
      result.classList.remove("hidden");
      result.innerHTML = `
        <h3>Missing Information</h3>
        <p>Please enter both the decision title and context before reviewing.</p>
      `;
      return;
    }

    let score = 40;

    if (title.length > 20) score += 10;
    if (context.length > 100) score += 15;
    if (context.length > 250) score += 10;

    const governanceWords = ["risk", "owner", "stakeholder", "evidence", "cost", "timeline", "impact", "alternative"];
    const matchedWords = governanceWords.filter(word =>
      context.toLowerCase().includes(word)
    );

    score += matchedWords.length * 3;

    if (score > 100) score = 100;

    let qualityLevel = "Weak";
    if (score >= 70) qualityLevel = "Strong";
    else if (score >= 55) qualityLevel = "Moderate";

    result.classList.remove("hidden");

    result.innerHTML = `
      <h3>Decision Review Summary</h3>

      <p><strong>Decision:</strong> ${title}</p>

      <h4>Decision Quality Score</h4>
      <p class="score">${score} / 100</p>
      <p><strong>Quality Level:</strong> ${qualityLevel}</p>

      <h4>Assumption Check</h4>
      <p>This decision may depend on assumptions that should be tested before commitment.</p>

      <h4>Risk Signal</h4>
      <p>Review risks related to ownership, evidence, implementation effort, stakeholder alignment, and unintended consequences.</p>

      <h4>Alternative Thinking</h4>
      <p>Compare this decision with at least two alternatives: a smaller pilot, delayed execution, or a different implementation path.</p>

      <h4>Governance Note</h4>
      <p>Create a decision record that includes the rationale, evidence, risk owner, decision owner, and review date.</p>

      <h4>Detected Governance Signals</h4>
      <p>${matchedWords.length > 0 ? matchedWords.join(", ") : "No strong governance signals detected yet."}</p>

      <p class="note">Prototype v0.2 — scoring is rule-based. Future versions will include AI-assisted review.</p>
    `;
  });
});
