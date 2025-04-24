const entries    = document.getElementById('entries');
const addBtn     = document.getElementById('addBtn');
const rollBtn    = document.getElementById('rollBtn');
const rollCount  = document.getElementById('rollCount');
const resultsDiv = document.getElementById('results');

// Add a new option row
function addOption(name = '', pct = '') {
  const row = document.createElement('div');
  row.classList.add('row');
  row.innerHTML = `
    <input type="text" placeholder="Option name" class="opt-name" value="${name}">
    <input type="number" placeholder="%" class="opt-pct" value="${pct}" min="0" step="0.01">
    <button class="remove">&times;</button>
  `;
  entries.append(row);
  row.querySelector('.remove')
     .addEventListener('click', ()=> row.remove());
}

// Initial two blank options
addOption();
addOption();

addBtn.onclick = () => addOption();

rollBtn.onclick = () => {
  // 1) Gather names & percentages
  const names = [...document.querySelectorAll('.opt-name')].map(i=>i.value.trim());
  const pcts  = [...document.querySelectorAll('.opt-pct')].map(i=>parseFloat(i.value) || 0);

  const total = pcts.reduce((a,b)=>a+b, 0);
  if (total.toFixed(2) !== '100.00') {
    return alert('⚠️ Sum of percentages must be 100 (got '+total+')');
  }

  // 2) Build choices array and initialize counts
  const choices = names.map((n,i)=>({ name:n, pct:pcts[i] }));
  const counts  = {};
  choices.forEach(c => counts[c.name] = 0);

  // 3) Perform rolls
  const rolls = parseInt(rollCount.value) || 1;
  const out   = [];
  for (let r = 0; r < rolls; r++) {
    const rnd = Math.random() * 100;
    let cum = 0;
    for (const c of choices) {
      cum += c.pct;
      if (rnd <= cum) {
        out.push(`Roll ${r+1}: ${c.name}`);
        counts[c.name] += 1;
        break;
      }
    }
  }

  // 4) Render results + counts
  const resultsHtml = out.join('<br>');
  const countsHtml  = Object.entries(counts)
    .map(([name, cnt]) => `<strong>${name}:</strong> ${cnt}`)
    .join('<br>');

  resultsDiv.innerHTML = 
    `<div class="roll-results">${resultsHtml}</div>
     <hr>
     <div class="roll-counts">${countsHtml}</div>`;
};
