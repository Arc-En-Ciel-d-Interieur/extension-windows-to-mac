chrome.action.onClicked.addListener((tab) => {
  // N'envoyer le message que si l'onglet est une page web normale
  if (!tab || !tab.id) return;
  const url = tab.url || '';
  if (!/^https?:/.test(url)) {
    // Certains onglets (chrome://, extensions, file://, etc.) n'ont pas de content script
    console.warn('WinToMac: content script non disponible pour', url);
    return;
  }

  // Utiliser le callback pour éviter l'uncaught (in promise) si aucun listener
  chrome.tabs.sendMessage(tab.id, { action: "toggle_converter" }, (response) => {
    if (chrome.runtime.lastError) {
      // Pas de receiving end — on logge proprement sans provoquer d'erreur non interceptée
      console.warn('WinToMac: envoi du message échoué:', chrome.runtime.lastError.message);
    }
  });
});