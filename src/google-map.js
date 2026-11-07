// The Google SDK is loaded only after the user submits a key in the online view.
const googleHost = document.querySelector('#google-map-host');
const googleSetup = document.querySelector('#google-map-setup');
const googleKeyField = document.querySelector('#google-map-key');
const googleSubmit = document.querySelector('#google-map-submit');
const googleMessage = document.querySelector('#google-map-message');
const googleMarkers = new Map();
let googleRequested = false;
let googleConnecting = false;
let googleReloadMessage = '';
let googleSdk = null;
let googleScene = null;
let cancelGoogleMount = null;

function showGoogleSetup(message = '') {
  googleSetup.hidden = false;
  googleKeyField.hidden = googleKeyField.disabled = googleConnecting || !!googleSdk || !!googleReloadMessage;
  googleSetup.querySelector('label').hidden = googleKeyField.hidden;
  googleSubmit.disabled = googleConnecting;
  googleSubmit.textContent = googleConnecting ? 'Connecting…'
    : googleReloadMessage ? 'Reload NearPresso'
    : googleSdk ? 'Try again' : 'Load Google map';
  googleMessage.textContent = message;
}

function setGoogleVisible(visible) {
  canvas.hidden = pins.hidden = visible;
  googleHost.hidden = !visible;
  googleHost.classList.remove('loading');
  mapSection.classList.toggle('google-mode', visible);
  if (!visible) resize();
}

function googleAuthError() {
  const help = location.protocol === 'file:'
    ? 'Use a Maps Demo Key or open NearPresso through a website allowed by your key.'
    : 'Check that your key allows this website and the Maps JavaScript API.';
  return new Error('Google rejected the key. ' + help);
}

function loadGoogleSdk(key) {
  if (googleSdk) return googleSdk;
  googleSdk = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const url = new URL('https://maps.googleapis.com/maps/api/js');
    url.search = new URLSearchParams({
      key, v:'weekly', loading:'async', libraries:'maps3d', callback:'nearPressoGoogleReady'
    });
    let scriptRan = false;
    let settled = false;
    const fail = message => {
      if (settled) return;
      settled = true;
      clearTimeout(deadline);
      script.remove();
      // A loaded SDK keeps its original key for the lifetime of this page.
      if (scriptRan) googleReloadMessage = message;
      else googleSdk = null;
      reject(new Error(message));
    };
    const deadline = setTimeout(() => fail('Google Maps took too long to respond. Check your connection and try again.'), 15000);
    window.nearPressoGoogleReady = async () => {
      if (settled) return;
      scriptRan = true;
      try {
        const library = await google.maps.importLibrary('maps3d');
        if (!library.Map3DElement || !library.MarkerInteractiveElement) {
          throw new Error('Missing 3D Maps classes');
        }
        if (!settled) {
          settled = true;
          clearTimeout(deadline);
          resolve(library);
        }
      } catch {
        fail('Google’s 3D Maps library could not start. Reload NearPresso to try again.');
      }
    };
    window.gm_authFailure = () => {
      const error = googleAuthError();
      googleReloadMessage = error.message;
      settled = true;
      clearTimeout(deadline);
      reject(error);
      if (cancelGoogleMount) cancelGoogleMount(error);
      else if (googleScene) failGoogleScene(error);
    };
    script.src = url.href;
    script.async = true;
    script.onerror = () => fail('Google Maps could not load. Check your connection and try again.');
    document.head.append(script);
  });
  return googleSdk;
}

function googleCameraFor(list) {
  const latitudes = list.map(cafe => cafe.lat);
  const longitudes = list.map(cafe => cafe.lng);
  const south = Math.min(...latitudes), north = Math.max(...latitudes);
  const west = Math.min(...longitudes), east = Math.max(...longitudes);
  const span = Math.max(north - south, east - west) * 111000;
  return {
    center: {lat:(south + north) / 2, lng:(west + east) / 2, altitude:0},
    range: Math.max(2200, span * 2.45)
  };
}

function moveGoogleTo(cafe) {
  if (!googleScene) return;
  googleScene.map.center = {lat:cafe.lat, lng:cafe.lng, altitude:0};
  googleScene.map.range = 3200;
}

function fitGoogleCafes(list = visibleCafes()) {
  if (googleScene) Object.assign(googleScene.map, googleCameraFor(list.length ? list : cafes));
}

function renderGooglePins(list) {
  if (!googleScene) return;
  const {map, MarkerInteractiveElement} = googleScene;
  const visible = new Set(list.map(cafe => cafe.id));
  for (const [id, marker] of googleMarkers) {
    if (visible.has(id)) continue;
    marker.remove();
    googleMarkers.delete(id);
  }
  for (const cafe of list) {
    let marker = googleMarkers.get(cafe.id);
    if (!marker) {
      marker = new MarkerInteractiveElement({
        position:{lat:cafe.lat, lng:cafe.lng},
        title:cafe.name,
        anchorLeft:'-50%',
        anchorTop:'-50%',
        collisionBehavior:'OPTIONAL_AND_HIDES_LOWER_PRIORITY'
      });
      const pin = document.createElement('span');
      pin.className = 'map-pin single google-pin';
      pin.innerHTML = espressoPinIcon;
      marker.append(pin);
      marker.addEventListener('gmp-click', () => openCafe(cafe, {move:false}));
      map.append(marker);
      googleMarkers.set(cafe.id, marker);
    }
    const current = cafe.id === state.selected;
    marker.firstElementChild.classList.toggle('current', current);
    marker.collisionPriority = current ? 10 : 0;
    marker.setAttribute('aria-pressed', String(current));
  }
}

function mountGoogleMap(map) {
  return new Promise((resolve, reject) => {
    const finish = error => {
      clearTimeout(deadline);
      map.removeEventListener('gmp-steadychange', onSteady);
      map.removeEventListener('gmp-error', onError);
      cancelGoogleMount = null;
      if (error) reject(error);
      else resolve();
    };
    const onSteady = event => {
      if (event.isSteady) finish();
    };
    const onError = () => finish(new Error('Google’s 3D map could not start on this device.'));
    const deadline = setTimeout(() => finish(new Error('The Google map took too long to render. You can retry or use the offline atlas.')), 25000);
    cancelGoogleMount = finish;
    map.addEventListener('gmp-steadychange', onSteady);
    map.addEventListener('gmp-error', onError);
    googleHost.classList.add('loading');
    googleHost.hidden = false;
    googleHost.replaceChildren(map);
  });
}

function failGoogleScene(error) {
  googleScene = null;
  googleMarkers.clear();
  googleHost.replaceChildren();
  setGoogleVisible(false);
  if (googleRequested) showGoogleSetup(error.message);
}

function revealGoogleScene() {
  googleSetup.hidden = true;
  setGoogleVisible(true);
  update();
}

async function connectGoogle(key) {
  if (googleConnecting) return;
  googleConnecting = true;
  showGoogleSetup('Loading Google’s dark 3D map…');
  try {
    const {Map3DElement, MarkerInteractiveElement} = await loadGoogleSdk(key);
    if (!googleRequested) return;
    if (googleReloadMessage) throw new Error(googleReloadMessage);
    const list = visibleCafes();
    const cafe = selected();
    const camera = cafe
      ? {center:{lat:cafe.lat, lng:cafe.lng, altitude:0}, range:3200}
      : googleCameraFor(list.length ? list : cafes);
    const map = new Map3DElement({
      ...camera,
      mode:'ROADMAP',
      colorScheme:'DARK',
      tilt:55,
      heading:330,
      gestureHandling:'COOPERATIVE',
      description:'Dark Google 3D map of NearPresso café stops'
    });
    await mountGoogleMap(map);
    if (!googleRequested) return;
    googleScene = {map, MarkerInteractiveElement};
    map.addEventListener('gmp-error', () => {
      if (googleScene?.map === map) failGoogleScene(new Error('Google’s 3D map became unavailable.'));
    });
    revealGoogleScene();
    document.querySelector('[data-mode="google"]').focus({preventScroll:true});
  } catch (error) {
    failGoogleScene(error);
  } finally {
    googleConnecting = false;
    if (googleRequested && !googleScene) showGoogleSetup(googleMessage.textContent);
  }
}

function selectGoogleView() {
  if (googleRequested) return;
  googleRequested = true;
  state.cluster = null;
  if (googleScene) {
    revealGoogleScene();
    fitGoogleCafes();
    return;
  }
  showGoogleSetup(googleReloadMessage || (googleConnecting ? 'Loading Google’s dark 3D map…' : ''));
  update();
  if (googleKeyField.hidden) googleSubmit.focus({preventScroll:true});
  else googleKeyField.focus({preventScroll:true});
}

function leaveGoogleView() {
  if (!googleRequested) return;
  googleRequested = false;
  googleSetup.hidden = true;
  googleKeyField.value = '';
  cancelGoogleMount?.(new Error('Google view closed'));
  setGoogleVisible(false);
}

googleSetup.addEventListener('submit', event => {
  event.preventDefault();
  if (googleReloadMessage) {
    location.reload();
    return;
  }
  const key = googleKeyField.value.trim();
  if (!googleSdk && !key) {
    showGoogleSetup('Enter your Google Maps API key.');
    googleKeyField.focus();
    return;
  }
  googleKeyField.value = '';
  connectGoogle(key);
});
googleSetup.querySelector('[data-google-cancel]').addEventListener('click', () => {
  leaveGoogleView();
  update();
  document.querySelector(`[data-mode="${view.mode}"]`).focus({preventScroll:true});
});
document.querySelector('[data-google-fit]').addEventListener('click', () => fitGoogleCafes());
