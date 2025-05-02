// Grab our elements
const entries    = document.getElementById('entries');
const addBtn     = document.getElementById('addBtn');
const importBtn  = document.getElementById('importBtn');
const bulkInput  = document.getElementById('bulkInput');
const rollBtn    = document.getElementById('rollBtn');
const rollCount  = document.getElementById('rollCount');
const resultsDiv = document.getElementById('results');

// Function to create one option row
function addOption(name = '', pct = '') {
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" class="opt-name" placeholder="Option name" value="${name}">
    <input type="number" class="opt-pct" placeholder="%" min="0" step="0.01" value="${pct}">
    <button class="remove">&times;</button>
  `;
  entries.append(row);
  row.querySelector('.remove')
     .addEventListener('click', () => row.remove());
}

// Start with two blank rows
addOption();
addOption();

// Single-add button
addBtn.onclick = () => addOption();

// —— Bulk-import handler —— 
importBtn.onclick = () => {
  const text = bulkInput.value.trim();
  if (!text) return alert('Please paste at least one line.');

  const lines = text.split(/\r?\n/);
  const parsed = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const m = line.match(/^(\d+(?:\.\d+)?)%\s+(.+)$/);
    if (!m) {
      return alert(`Line ${i+1} not in “19% Eevee” format:\n${line}`);
    }
    parsed.push({ pct: m[1], name: m[2] });
  }

  // Clear existing entries & repopulate
  entries.innerHTML = '';
  parsed.forEach(({ name, pct }) => addOption(name, pct));
  bulkInput.value = '';
};

// Roll-wheel handler
rollBtn.onclick = () => {
  const names = [...document.querySelectorAll('.opt-name')].map(i => i.value.trim());
  const pcts  = [...document.querySelectorAll('.opt-pct')].map(i => parseFloat(i.value) || 0);
  const total = pcts.reduce((a,b) => a+b, 0);

  if (total.toFixed(2) !== '100.00') {
    return alert(`Percentages must sum to 100 (current total: ${total})`);
  }

  const choices = names.map((n,i) => ({ name: n, pct: pcts[i] }));
  const counts  = Object.fromEntries(names.map(n => [n, 0]));
  const rolls   = parseInt(rollCount.value, 10) || 1;
  const out     = [];

  for (let r = 0; r < rolls; r++) {
    const rnd = Math.random()*100;
    let cum = 0;
    for (const c of choices) {
      cum += c.pct;
      if (rnd <= cum) {
        out.push(`Roll ${r+1}: ${c.name}`);
        counts[c.name]++;
        break;
      }
    }
  }

  // Render results + tally
  const resultsHtml = out.join('<br>');
  const countsHtml  = Object.entries(counts)
    .map(([name,c]) => `<strong>${name}:</strong> ${c}`)
    .join('<br>');

  resultsDiv.innerHTML = `
    <div class="roll-results">${resultsHtml}</div>
    <hr>
    <div class="roll-counts">${countsHtml}</div>
  `;
};
