const STORAGE_KEY = 'phoenixville-dream-garden-entries';
const form = document.querySelector('#logForm');
const entriesEl = document.querySelector('#entries');
const searchEl = document.querySelector('#search');
const exportBtn = document.querySelector('#exportBtn');
const clearBtn = document.querySelector('#clearBtn');
const weekOf = document.querySelector('#weekOf');

const today = new Date();
weekOf.valueAsDate = today;

const sampleEntries = [
  {
    id: crypto.randomUUID(),
    weekOf: '2026-05-03',
    stage: 'Spring setup',
    notes: 'Baseline plan created: trellis on the north side, tomatoes and peppers in the sunniest middle beds, pollinator strip along the edge.',
    harvest: 'None yet',
    tasks: 'Confirm sun path, mark paths, add compost, choose tomato varieties.',
    photo: ''
  }
];

function loadEntries() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return sampleEntries;
  try { return JSON.parse(saved); } catch { return sampleEntries; }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

let entries = loadEntries();

function readPhoto(file) {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

function render() {
  const query = searchEl.value.trim().toLowerCase();
  const filtered = entries
    .filter((entry) => [entry.weekOf, entry.stage, entry.notes, entry.harvest, entry.tasks]
      .join(' ')
      .toLowerCase()
      .includes(query))
    .sort((a, b) => b.weekOf.localeCompare(a.weekOf));

  if (!filtered.length) {
    entriesEl.innerHTML = '<div class="card"><h3>No updates found</h3><p>Try another search or add this week’s garden note.</p></div>';
    return;
  }

  entriesEl.innerHTML = filtered.map((entry) => `
    <article class="entry">
      ${entry.photo ? `<img src="${entry.photo}" alt="Garden update photo for ${formatDate(entry.weekOf)}">` : '<div class="no-photo">No photo yet</div>'}
      <div>
        <h3>${formatDate(entry.weekOf)} · ${escapeHtml(entry.stage)}</h3>
        <p><strong>Growth:</strong> ${escapeHtml(entry.notes)}</p>
        <p><strong>Harvest:</strong> ${escapeHtml(entry.harvest || 'Not logged')}</p>
        <p><strong>Next tasks:</strong> ${escapeHtml(entry.tasks || 'Not logged')}</p>
        <div class="entry-actions">
          <button class="button danger" data-delete="${entry.id}" type="button">Delete</button>
        </div>
      </div>
    </article>
  `).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const photo = await readPhoto(document.querySelector('#photo').files[0]);
  entries.push({
    id: crypto.randomUUID(),
    weekOf: document.querySelector('#weekOf').value,
    stage: document.querySelector('#stage').value,
    photo,
    notes: document.querySelector('#notes').value.trim(),
    harvest: document.querySelector('#harvest').value.trim(),
    tasks: document.querySelector('#tasks').value.trim()
  });
  saveEntries(entries);
  form.reset();
  weekOf.valueAsDate = new Date();
  render();
});

entriesEl.addEventListener('click', (event) => {
  const id = event.target?.dataset?.delete;
  if (!id) return;
  entries = entries.filter((entry) => entry.id !== id);
  saveEntries(entries);
  render();
});

searchEl.addEventListener('input', render);

exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'phoenixville-garden-growth-log.json';
  a.click();
  URL.revokeObjectURL(url);
});

clearBtn.addEventListener('click', () => {
  if (!confirm('Clear all garden log entries in this browser?')) return;
  entries = [];
  saveEntries(entries);
  render();
});

render();
