document.addEventListener('DOMContentLoaded', () => {
  const winInput = document.getElementById('winInput');
  const convertBtn = document.getElementById('convertBtn');
  const macResult = document.getElementById('macResult');
  const resultArea = document.getElementById('resultArea');
  const copyBtn = document.getElementById('copyBtn');
  const feedback = document.getElementById('feedback');

  function convertPath(val) {
    const raw = (val || '').trim();
    if (!raw) return { result: '', direction: '' };

    const lower = raw.toLowerCase();

    // If input looks like an SMB URL, convert to Windows UNC path
    if (lower.startsWith('smb:') || lower.startsWith('smb://')) {
      // strip leading smb:// or smb:
      let without = raw.replace(/^smb:\/\//i, '').replace(/^smb:/i, '');
      // Remove any leading slashes to avoid triple slashes
      without = without.replace(/^\/+/, '');
      // Convert forward slashes to backslashes and add leading \\\\\\\\ for UNC
      const windows = '\\\\' + without.replace(/\//g, '\\\\');
      return { result: windows, direction: 'Mac → Windows' };
    }

    // If input looks like a Windows UNC path (\server\share) or contains backslashes, convert to SMB
    if (/^\\\\|\\/.test(raw)) {
      let without = raw.replace(/^\\+/, '');
      // convert backslashes to forward slashes
      const smbPath = 'smb://' + without.replace(/\\+/g, '/');
      return { result: smbPath, direction: 'Windows → Mac' };
    }

    // Otherwise, if it's already a forward-slash path like //server/share, assume SMB-like
    if (raw.startsWith('//')) {
      return { result: 'smb:' + raw, direction: 'Assumé Mac → Windows?' };
    }

    // Fallback: treat as Windows path with slashes
    const fallback = raw.replace(/\\\\/g, '/').replace(/\\/g, '/');
    return { result: 'smb://' + fallback.replace(/^\/+/, ''), direction: 'Windows → Mac' };
  }

  convertBtn.addEventListener('click', () => {
    const val = winInput.value;
    const { result, direction } = convertPath(val);
    if (!result) return;
    macResult.value = result;
    const dirEl = document.getElementById('direction');
    if (dirEl) dirEl.textContent = 'Direction : ' + (direction || '—');
    resultArea.style.display = 'block';
  });

  copyBtn.addEventListener('click', async () => {
    const text = macResult.value;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      feedback.style.display = 'block';
      // Visuel: rendre le bouton vert puis revenir à son état initial
      const prev = copyBtn.classList.contains('is-success');
      copyBtn.classList.add('is-success');
      setTimeout(() => {
        feedback.style.display = 'none';
        if (!prev) copyBtn.classList.remove('is-success');
      }, 1600);
    } catch (e) {
      // Fallback for older environments
      const tmp = document.createElement('textarea');
      tmp.value = text;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      tmp.remove();
      feedback.style.display = 'block';
      const prev = copyBtn.classList.contains('is-success');
      copyBtn.classList.add('is-success');
      setTimeout(() => {
        feedback.style.display = 'none';
        if (!prev) copyBtn.classList.remove('is-success');
      }, 1600);
    }
  });
});
