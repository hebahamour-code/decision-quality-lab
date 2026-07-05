document.addEventListener("DOMContentLoaded", () => {
  const fields = {
    title: document.getElementById("decisionTitle"),
    context: document.getElementById("decisionContext"),
    objective: document.getElementById("objective"),
    evidence: document.getElementById("evidence"),
    risks: document.getElementById("risks"),
    alternatives: document.getElementById("alternatives"),
    stakeholders: document.getElementById("stakeholders"),
    owner: document.getElementById("owner")
  };

  const button = document.getElementById("reviewBtn");
  const result = document.getElementById("result");

  const escapeHtml = (value) => {
    return value.replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];
    });
  };

  const hasEnoughDetail = (value, minimumLength) => {
    return value.trim().length >= minimumLength;
  };

  const createFinding = (label, complete, guidance) => {
    return {
      label,
      complete,
      guidance
    };
  };

  button.addEventListener("click", () => {
    const values = {
      title: fields.title.value.trim(),
      context: fields.context.value.trim(),
      objective: fields.objective.value.trim(),
      evidence: fields.evidence.value.trim(),
      risks: fields.risks.value.trim(),
      alternatives: fields.alternatives.value.trim(),
      stakeholders: fields.stakeholders.value.trim(),
      owner: fields.owner.value.trim()
    };

    if (!values.title || !values.context) {
      result.classList.remove("hidden");
      result.innerHTML = `
        <div class="result-header">
          <p class="result-label">Incomplete Review</p>
          <h3>More information is required</h3>
        </div>

        <p>
          Add both a decision title and decision context before starting the review.
        </p>
      `;

      result.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      return;
    }

    const findings = [
      createFinding(
        "Decision definition",
        hasEnoughDetail(values.title, 15) && hasEnoughDetail(values.context, 80),
        "Clarify the decision, the problem it addresses, relevant constraints, and why action is needed now."
      ),

      createFinding(
        "Desired outcome",
        hasEnoughDetail(values.objective, 50),
        "Define the intended outcome and explain how success will be measured."
      ),

      createFinding(
        "Evidence quality",
        hasEnoughDetail(values.evidence, 60),
        "Add relevant facts, data, research, expert input, or prior experience."
      ),

      createFinding(
        "Risk awareness",
        hasEnoughDetail(values.risks, 60),
        "Identify operational, financial, human, ethical, regulatory, and implementation risks."
      ),

      createFinding(
        "Alternative analysis",
        hasEnoughDetail(values.alternatives, 50),
        "Compare the preferred option with at least two credible alternatives, including delaying or doing nothing."
      ),

      createFinding(
        "Stakeholder impact",
        hasEnoughDetail(values.stakeholders, 15),
        "Identify the people or groups affected by the decision and how they may be affected."
      ),

      createFinding(
        "Decision ownership",
        hasEnoughDetail(values.owner, 3),
        "Assign one accountable decision owner."
      )
    ];

    const weights = {
      "Decision definition": 20,
      "Desired outcome": 15,
      "Evidence quality": 20,
      "Risk awareness": 15,
      "Alternative analysis": 15,
      "Stakeholder impact": 10,
      "Decision ownership": 5
    };

    let score = 0;

    findings.forEach((finding) => {
      if (finding.complete) {
        score += weights[finding.label];
      }
    });

    let qualityLevel = "Weak";
    let readinessMessage =
      "The decision is not yet sufficiently developed for responsible commitment.";

    if (score >= 80) {
      qualityLevel = "Strong";
      readinessMessage =
        "The decision is well structured, but leadership judgment and validation are still required.";
    } else if (score >= 60) {
      qualityLevel = "Moderate";
      readinessMessage =
        "The decision has a reasonable foundation, but important gaps remain.";
    } else if (score >= 40) {
      qualityLevel = "Developing";
      readinessMessage =
        "The decision has begun to take shape, but several material areas require attention.";
    }

    const completedFindings = findings.filter((finding) => finding.complete);
    const missingFindings = findings.filter((finding) => !finding.complete);

    const completedMarkup =
      completedFindings.length > 0
        ? completedFindings
            .map(
              (finding) => `
                <li class="finding complete">
                  <span class="finding-icon">✓</span>
                  <span>${finding.label}</span>
                </li>
              `
            )
            .join("")
        : `
            <li class="finding">
              No review areas are sufficiently developed yet.
            </li>
          `;

    const missingMarkup =
      missingFindings.length > 0
        ? missingFindings
            .map(
              (finding) => `
                <li class="finding missing">
                  <div>
                    <strong>${finding.label}</strong>
                    <p>${finding.guidance}</p>
                  </div>
                </li>
              `
            )
            .join("")
        : `
            <li class="finding complete">
              No major structural gaps were detected.
            </li>
          `;

    result.classList.remove("hidden");

    result.innerHTML = `
      <div class="result-header">
        <p class="result-label">Decision Review Summary</p>
        <h3>${escapeHtml(values.title)}</h3>
      </div>

      <div class="score-panel">
        <div>
          <p class="score-caption">Decision Quality Score</p>
          <p class="score">${score}<span>/100</span></p>
        </div>

        <div class="quality-status">
          <p class="score-caption">Quality Level</p>
          <p class="quality-level">${qualityLevel}</p>
        </div>
      </div>

      <p class="readiness-message">${readinessMessage}</p>

      <div class="review-grid">
        <section class="review-column">
          <h4>What is present</h4>
          <ul class="finding-list">
            ${completedMarkup}
          </ul>
        </section>

        <section class="review-column">
          <h4>What needs attention</h4>
          <ul class="finding-list">
            ${missingMarkup}
          </ul>
        </section>
      </div>

      <div class="governance-note">
        <h4>Governance recommendation</h4>
        <p>
          Record the decision rationale, evidence, alternatives, key risks,
          accountable owner, approval date, and review date before commitment.
        </p>
      </div>

      <p class="prototype-note">
        Prototype v0.3 · Rule-based review · This tool supports judgment; it does not replace it.
      </p>
    `;

    result.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});
