const mockSignals = [
  {
    pair: "EUR/USD",
    setup: "Break & retest",
    bias: "Bullish",
    status: "Live",
    updated: "2m ago",
  },
  {
    pair: "GBP/JPY",
    setup: "Liquidity sweep",
    bias: "Bearish",
    status: "Awaiting",
    updated: "7m ago",
  },
  {
    pair: "XAU/USD",
    setup: "Trend continuation",
    bias: "Bullish",
    status: "Live",
    updated: "12m ago",
  },
];

const mockTags = ["Asia sweep", "London open", "Daily bias", "FVG zone"];

const selectors = {
  status: "[data-live-status]",
  count: "[data-signal-count]",
  tags: "[data-market-tags]",
  table: "[data-signal-table]",
  feedStatus: "[data-feed-status]",
};

const updateDashboard = ({ signals, tags, feedStatus }) => {
  const statusEl = document.querySelector(selectors.status);
  const countEl = document.querySelector(selectors.count);
  const tagsEl = document.querySelector(selectors.tags);
  const tableEl = document.querySelector(selectors.table);
  const feedStatusEl = document.querySelector(selectors.feedStatus);

  if (statusEl) {
    statusEl.textContent = signals.length ? "Live feed active" : "Awaiting live feed";
  }

  if (countEl) {
    countEl.textContent = signals.length.toString();
  }

  if (tagsEl) {
    tagsEl.innerHTML = tags
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");
  }

  if (tableEl) {
    tableEl.innerHTML = signals
      .map(
        (signal) => `
          <tr>
            <td>${signal.pair}</td>
            <td>${signal.setup}</td>
            <td>${signal.bias}</td>
            <td><span class="status-chip">${signal.status}</span></td>
            <td>${signal.updated}</td>
          </tr>
        `
      )
      .join("");
  }

  if (feedStatusEl) {
    feedStatusEl.textContent = feedStatus;
  }
};

const loadLiveSignals = async () => {
  try {
    const response = await fetch("/api/signals/live");

    if (!response.ok) {
      throw new Error("Live API unavailable");
    }

    const payload = await response.json();
    const signals = payload.signals ?? [];
    const tags = payload.tags ?? [];

    updateDashboard({
      signals,
      tags,
      feedStatus: "Live API",
    });
  } catch (error) {
    updateDashboard({
      signals: mockSignals,
      tags: mockTags,
      feedStatus: "Mock data",
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  updateDashboard({
    signals: mockSignals,
    tags: mockTags,
    feedStatus: "Mock data",
  });

  loadLiveSignals();
});
