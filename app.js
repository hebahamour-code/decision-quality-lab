
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

    result.classList.remove("hidden");

    result.innerHTML = `
      <h3>Decision Review Summary</h3>

      <p><strong>Decision:</strong> ${title}</p>

      <h4>Assumption Check</h4>
      <p>This decision may depend on assumptions that should be tested before commitment.</p>

      <h4>Risk Signal</h4>
      <p>Key risks may include unclear ownership, weak evidence, stakeholder misalignment, or underestimated implementation effort.</p>

      <h4>Alternative Thinking</h4>
      <p>Before committing, compare this option with at least two alternatives: doing less, doing later, or testing through a small pilot.</p>

      <h4>Governance Note</h4>
      <p>A decision record should capture the rationale, evidence, risks, owner, and review date.</p>

      <h4>Decision Quality Score</h4>
      <p class="score">62 / 100</p>

      <p class="note">This is an early prototype. Future versions will include AI-assisted analysis and scoring.</p>
    `;
  });
});
