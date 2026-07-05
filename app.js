
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

  const escapeHtml = (value) =>
    value.replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return entities[character];
    });

  const clamp = (number, minimum, maximum) =>
    Math.min(Math.max(number, minimum), maximum);

  const countSignals = (text, signals) => {
    const normalizedText = text.toLowerCase();

    return signals.filter((signal) =>
      normalizedText.includes(signal)
    ).length;
  };

  const progressiveTextScore = (
    text,
    {
      shortLength,
      strongLength,
      signals = [],
      minimumSignalCount = 0
    }
  ) => {
    const value = text.trim();

    if (!value) {
      return 0;
    }

    const lengthProgress = clamp(
      value.length / strongLength,
      0,
      1
    );

    let score = Math.round(lengthProgress * 75);

    if (value.length >= shortLength) {
      score = Math.max(score, 35);
    }

    if (signals.length > 0) {
      const detectedSignals = countSignals(value, signals);
      const signalProgress = clamp(
        detectedSignals / Math.max(minimumSignalCount, 1),
        0,
        1
      );

      score += Math.round(signalProgress * 25);
    } else {
      score += 25;
    }

    return clamp(score, 0, 100);
  };

  const getDimensionStatus = (score) => {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Moderate";
    if (score >= 35) return "Developing";
    return "Weak";
  };

  const getStatusClass = (score) => {
    if (score >= 80) return "strong";
    if (score >= 60) return "moderate";
    if (score >= 35) return "developing";
    return "weak";
  };

  const createDimension = (
    label,
    score,
    weight,
    guidance
  ) => ({
    label,
    score,
    weight,
    guidance,
    status: getDimensionStatus(score)
  });

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

    const decisionDefinitionScore = Math.round(
      (
        progressiveTextScore(values.title, {
          shortLength: 12,
          strongLength: 45
        }) *
          0.3 +
        progressiveTextScore(values.context, {
          shortLength: 50,
          strongLength: 260,
          signals: [
            "problem",
            "constraint",
            "because",
            "now",
            "need",
            "impact",
            "scope",
            "deadline"
          ],
          minimumSignalCount: 3
        }) *
          0.7
      )
    );

    const objectiveScore = progressiveTextScore(
      values.objective,
      {
        shortLength: 35,
        strongLength: 180,
        signals: [
          "success",
          "measure",
          "target",
          "outcome",
          "reduce",
          "increase",
          "improve",
          "metric"
        ],
        minimumSignalCount: 3
      }
    );

    const evidenceScore = progressiveTextScore(
      values.evidence,
      {
        shortLength: 40,
        strongLength: 220,
        signals: [
          "data",
          "research",
          "report",
          "survey",
          "analysis",
          "benchmark",
          "expert",
          "financial",
          "customer"
        ],
        minimumSignalCount: 3
      }
    );

    const riskScore = progressiveTextScore(
      values.risks,
      {
        shortLength: 40,
        strongLength: 220,
        signals: [
          "financial",
          "operational",
          "ethical",
          "legal",
          "regulatory",
          "employee",
          "customer",
          "reputation",
          "implementation",
          "mitigation"
        ],
        minimumSignalCount: 4
      }
    );

    const alternativesScore = progressiveTextScore(
      values.alternatives,
      {
        shortLength: 35,
        strongLength: 190,
        signals: [
          "alternative",
          "option",
          "pilot",
          "delay",
          "do nothing",
          "phase",
          "outsource",
          "compare"
        ],
        minimumSignalCount: 3
      }
    );

    const stakeholdersScore = progressiveTextScore(
      values.stakeholders,
      {
        shortLength: 10,
        strongLength: 100,
        signals: [
          "employee",
          "customer",
          "regulator",
          "partner",
          "supplier",
          "manager",
          "shareholder",
          "community"
        ],
        minimumSignalCount: 3
      }
    );

    const ownerScore = values.owner
      ? values.owner.length >= 3
        ? 100
        : 50
      : 0;

    const dimensions = [
      createDimension(
        "Decision definition",
        decisionDefinitionScore,
        20,
        "Clarify the exact decision, why it is needed, relevant constraints, scope, and timing."
      ),
      createDimension(
        "Desired outcome",
        objectiveScore,
        15,
        "Define the intended result and explain how success will be measured."
      ),
      createDimension(
        "Evidence quality",
        evidenceScore,
        20,
        "Add data, research, benchmarks, expert input, or prior experience."
      ),
      createDimension(
        "Risk awareness",
        riskScore,
        15,
        "Identify material risks, affected groups, impact, likelihood, and mitigation."
      ),
      createDimension(
        "Alternative analysis",
        alternativesScore,
        15,
        "Compare the preferred option with credible alternatives, including delay, pilot, or no action."
      ),
      createDimension(
        "Stakeholder impact",
        stakeholdersScore,
        10,
        "Identify who is affected and explain the likely positive and negative effects."
      ),
      createDimension(
        "Decision ownership",
        ownerScore,
        5,
        "Assign one clearly accountable decision owner."
      )
    ];

    const totalScore = Math.round(
      dimensions.reduce(
        (total, dimension) =>
          total +
          dimension.score * (dimension.weight / 100),
        0
      )
    );

    let qualityLevel = "Weak";
    let readinessMessage =
      "The decision is not sufficiently developed for responsible commitment.";

    if (totalScore >= 80) {
      qualityLevel = "Strong";
      readinessMessage =
        "The decision is well structured, but validation and accountable human judgment are still required.";
    } else if (totalScore >= 60) {
      qualityLevel = "Moderate";
      readinessMessage =
        "The decision has a reasonable foundation, but important gaps remain.";
    } else if (totalScore >= 35) {
      qualityLevel = "Developing";
      readinessMessage =
        "The decision has begun to take shape, but material areas require further work.";
    }

    const dimensionMarkup = dimensions
      .map(
        (dimension) => `
          <li class="dimension-item">
            <div class="dimension-heading">
              <div>
                <strong>${dimension.label}</strong>
                <span>${dimension.status}</span>
              </div>

              <span class="dimension-score">
                ${dimension.score}/100
              </span>
            </div>

            <div class="dimension-bar">
              <div
                class="dimension-fill ${getStatusClass(dimension.score)}"
                style="width: ${dimension.score}%"
              ></div>
            </div>

            ${
              dimension.score < 80
                ? `<p>${dimension.guidance}</p>`
                : `<p>This dimension is sufficiently developed for the current review.</p>`
            }
          </li>
        `
      )
      .join("");

  const priorityGaps = [...dimensions]
  .filter((dimension) => dimension.score < 80)
  .sort((a, b) => a.score - b.score)
  .slice(0, 3);

    const priorityMarkup = priorityGaps
      .map(
        (dimension, index) => `
          <li class="priority-item">
            <span>${index + 1}</span>

            <div>
              <strong>${dimension.label}</strong>
              <p>${dimension.guidance}</p>
            </div>
          </li>
        `
      )
      .join("");

    result.classList.remove("hidden");

    result.innerHTML = `
      <div class="result-header">
        <p class="result-label">Decision Review Summary</p>
        <h3>${escapeHtml(values.title)}</h3>
      </div>

      <div class="score-panel">
        <div>
          <p class="score-caption">Decision Quality Score</p>
          <p class="score">${totalScore}<span>/100</span></p>
        </div>

        <div class="quality-status">
          <p class="score-caption">Quality Level</p>
          <p class="quality-level">${qualityLevel}</p>
        </div>
      </div>

      <p class="readiness-message">
        ${readinessMessage}
      </p>

      <section class="dimension-section">
        <h4>Dimension Breakdown</h4>

        <ul class="dimension-list">
          ${dimensionMarkup}
        </ul>
      </section>

      <section class="priority-section">
        <h4>Priority Improvements</h4>

        <ol class="priority-list">
          ${priorityMarkup}
        </ol>
      </section>

      <div class="governance-note">
        <h4>Governance recommendation</h4>

        <p>
          Record the rationale, evidence, alternatives, risks,
          accountable owner, approval date, and review date before commitment.
        </p>
      </div>

      <p class="prototype-note">
        Prototype v0.4 · Progressive rule-based scoring ·
        This tool supports judgment; it does not replace it.
      </p>
    `;

    result.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});
