function _injectLoader(){
  const handler = document.createElement('div');
  handler.id = handler.className = 'loader';
  handler.innerHTML = '<div class="handler-content"><div id="spinner" class="spinner large"></div></div>';
  return handler;
}

async function _onDomLoaded(){
  const loader = _injectLoader();
  document.body.appendChild(loader);

  // TODO : Make a race between elara-app and the loader.

  // Wait for app defined in context
  await customElements.whenDefined('elara-app');

  const promises = [];
  const elara = document.querySelector('elara-app');
  promises.push(document.fonts.ready);
  // Load needed
  promises.push(...elara.needed);
  // Bootstrap the others
  promises.push(elara.bootstrap);

  await Promise.all(promises);

  window.requestAnimationFrame(() => {
    loader.classList.add('hidden');
    loader.parentElement.removeChild(handler);
  });
}

(() => {
  document.addEventListener('DOMContentLoaded', _onDomLoaded);
})();