let googleMapsPromise;

export function loadGoogleMaps(apiKey) {
  if (window.google?.maps?.importLibrary) {
    return Promise.resolve(window.google.maps);
  }

  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key is not configured."));
  }

  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    const callbackName = "__salonHubGoogleMapsReady";
    const existingScript = document.querySelector(
      'script[data-salonhub-google-maps="true"]',
    );

    window[callbackName] = () => {
      delete window[callbackName];
      resolve(window.google.maps);
    };

    if (existingScript) {
      existingScript.addEventListener("error", () =>
        reject(new Error("Google Maps could not be loaded.")),
      );
      return;
    }

    const script = document.createElement("script");
    const parameters = new URLSearchParams({
      key: apiKey,
      loading: "async",
      callback: callbackName,
      libraries: "places,geocoding",
      language: "en",
      region: "JO",
      v: "weekly",
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${parameters}`;
    script.async = true;
    script.defer = true;
    script.dataset.salonhubGoogleMaps = "true";
    script.onerror = () => {
      googleMapsPromise = undefined;
      delete window[callbackName];
      reject(new Error("Google Maps could not be loaded."));
    };
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
