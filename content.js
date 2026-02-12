chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggle_converter") {
    showConverterPanel();
  }
});

function showConverterPanel() {
  if (document.getElementById('win-to-mac-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'win-to-mac-overlay';
  Object.assign(overlay.style, {
    position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)', zIndex: '999999',
    display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'
  });

  const panel = document.createElement('div');
  Object.assign(panel.style, {
    background: '#ffffff', padding: '20px', borderRadius: '12px',
    width: '420px', boxShadow: '0 20px 40px rgba(2,6,23,0.08)', 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#0f1724', border: '1px solid #e6e9ee'
  });

  // Structure HTML inspirée de l'UI de QuickSwap
  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
      <h2 style="margin:0; font-size:18px; font-weight:700; color:#0b63ff">Convertisseur Win ↔ Mac</h2>
      <span id="closeOverlay" style="cursor:pointer; opacity:0.6; font-size:20px; color:#6b7280">&times;</span>
    </div>
    
    <div style="margin-bottom:12px;">
      <label style="font-size:11px; text-transform:uppercase; color:#55606a; font-weight:600; display:block; margin-bottom:6px;">Entrée (Windows ou SMB)</label>
      <textarea id="winInput" style="width:100%; height:60px; background:#ffffff; border:1px solid #e6e9ee; border-radius:8px; color:#0f1724; padding:10px; box-sizing:border-box; outline:none; font-family:monospace; resize:vertical;" placeholder="Ex: \\\\serveur\partage\dossier or smb://serveur/partage"></textarea>
    </div>

    <button id="convertBtn" style="width:100%; padding:12px; background:#0b63ff; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:700; margin-bottom:16px; transition: background 0.2s;">Convertir le lien</button>

    <div id="resultArea" style="display:none; border-top:1px solid #eef2f6; padding-top:12px;">
      <label for="macResult" style="font-size:11px; text-transform:uppercase; color:#55606a; font-weight:600; display:block; margin-bottom:6px; margin-top:6px;">Résultat</label>
      <div style="display:flex; gap:8px;">
        <input id="macResult" readonly style="flex:1; background:#fff; border:1px solid #e6e9ee; border-radius:8px; color:#0f1724; padding:10px; outline:none; font-family:monospace;">
        <button id="copyBtn" style="background:#6b7280; border:none; color:#fff; padding:0 15px; border-radius:8px; cursor:pointer; font-size:13px;">Copier</button>
      </div>
      <div id="direction" style="font-size:12px;color:#6b7280; margin-top:8px">Direction : —</div>
      <p id="feedback" style="font-size:11px; color:#16a34a; margin-top:8px; display:none; text-align:center;">Copié dans le presse-papier !</p>
    </div>
  `;

  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  const winInput = panel.querySelector('#winInput');
  const macResult = panel.querySelector('#macResult');
  const convertBtn = panel.querySelector('#convertBtn');
  const copyBtn = panel.querySelector('#copyBtn');
  const resultArea = panel.querySelector('#resultArea');
  const feedback = panel.querySelector('#feedback');

  // Logique de conversion
  convertBtn.addEventListener('click', () => {
    const raw = (winInput.value || '').trim();
    if (!raw) return;

    // Detect SMB -> Windows or Windows -> SMB
    const lower = raw.toLowerCase();
    let converted = '';
    let direction = '';

    if (lower.startsWith('smb:') || lower.startsWith('smb://')) {
        let without = raw.replace(/^smb:\/\//i, '').replace(/^smb:/i, '');
      without = without.replace(/^\/+/, '');
      converted = '\\\\' + without.replace(/\//g, '\\\\');
      direction = 'SMB → Windows';
    } else if (/^\\\\|\\/.test(raw)) {
      let without = raw.replace(/^\\+/, '');
      converted = 'smb://' + without.replace(/\\+/g, '/');
      direction = 'Windows → SMB';
    } else if (raw.startsWith('//')) {
      converted = 'smb:' + raw;
      direction = 'Assumé SMB';
    } else {
      // Fallback: treat windows-like path
      const fallback = raw.replace(/\\\\/g, '/').replace(/\\/g, '/');
      converted = 'smb://' + fallback.replace(/^\/+/, '');
      direction = 'Windows → SMB';
    }

    macResult.value = converted;
    const label = panel.querySelector('label[for="macResult"]');
    const directionEl = panel.querySelector('#direction');
    if (directionEl) directionEl.textContent = 'Direction : ' + direction;
    resultArea.style.display = 'block';
    copyToClipboard(converted);
  });

  // Bouton de copie manuel
  copyBtn.addEventListener('click', () => {
    copyToClipboard(macResult.value);
  });

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        feedback.style.display = 'block';
      // store previous inline background so we can restore it
      const prevBg = copyBtn.style.background || '';
      const prevText = copyBtn.innerText;
      copyBtn.innerText = 'Fait !';
      copyBtn.style.background = '#34C759';
      setTimeout(() => {
        feedback.style.display = 'none';
        copyBtn.innerText = prevText || 'Copier';
        // restore previous background (may be empty)
        copyBtn.style.background = prevBg;
      }, 2000);
    });
  }

  // Fermeture
  panel.querySelector('#closeOverlay').onclick = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}