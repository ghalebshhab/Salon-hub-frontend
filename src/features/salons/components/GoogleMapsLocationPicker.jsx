import { AlertCircle, CheckCircle2, LocateFixed, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../../../shared/lib/googleMapsLoader.js";
import {
  cityFromAddressComponents,
  googleMapsLink,
  isInsideJordan,
  JORDAN_MAP_BOUNDS,
} from "../model/jordanMapLocation.js";

const AMMAN = { lat: 31.9539, lng: 35.9106 };

function coordinates(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  return isInsideJordan(lat, lng) ? { lat, lng } : AMMAN;
}

export default function GoogleMapsLocationPicker({
  latitude,
  longitude,
  onLocationChange,
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
  const mapNodeRef = useRef(null);
  const searchNodeRef = useRef(null);
  const callbackRef = useRef(onLocationChange);
  const initialLocationRef = useRef({ latitude, longitude });
  const [state, setState] = useState(apiKey ? "loading" : "configuration");
  const [message, setMessage] = useState(
    apiKey
      ? "Loading the interactive map…"
      : "Add VITE_GOOGLE_MAPS_API_KEY to enable search and map selection.",
  );
  const [selectedAddress, setSelectedAddress] = useState("");

  useEffect(() => {
    callbackRef.current = onLocationChange;
  }, [onLocationChange]);

  useEffect(() => {
    if (!apiKey) return undefined;

    let active = true;
    const listeners = [];
    const searchHost = searchNodeRef.current;
    const initialLocation = initialLocationRef.current;

    loadGoogleMaps(apiKey)
      .then(async () => {
        if (!active || !mapNodeRef.current || !searchNodeRef.current) return;

        const [{ Map }, { PlaceAutocompleteElement }] = await Promise.all([
          window.google.maps.importLibrary("maps"),
          window.google.maps.importLibrary("places"),
        ]);
        if (!active) return;

        const initialPosition = coordinates(
          initialLocation.latitude,
          initialLocation.longitude,
        );
        const map = new Map(mapNodeRef.current, {
          center: initialPosition,
          zoom: initialPosition === AMMAN ? 8 : 16,
          restriction: {
            latLngBounds: JORDAN_MAP_BOUNDS,
            strictBounds: true,
          },
          clickableIcons: false,
          fullscreenControl: true,
          mapTypeControl: false,
          streetViewControl: false,
        });
        const marker = new window.google.maps.Marker({
          map,
          position: initialPosition,
          draggable: true,
          title: "Salon location",
        });
        const geocoder = new window.google.maps.Geocoder();
        const autocomplete = new PlaceAutocompleteElement({
          includedRegionCodes: ["jo"],
          placeholder: "Search for the salon or a place in Jordan",
        });
        searchNodeRef.current.replaceChildren(autocomplete);

        const applyLocation = async (position, placeDetails = {}) => {
          const lat = Number(position.lat);
          const lng = Number(position.lng);
          if (!isInsideJordan(lat, lng)) {
            setState("error");
            setMessage("Choose a location inside Jordan.");
            return;
          }

          let address = placeDetails.formattedAddress || "";
          let addressComponents = placeDetails.addressComponents || [];
          if (!address || !addressComponents.length) {
            try {
              const response = await geocoder.geocode({ location: { lat, lng } });
              const result = response.results?.[0];
              address ||= result?.formatted_address || "";
              addressComponents = result?.address_components || [];
            } catch {
              // Coordinates are still valid when an address label cannot be resolved.
            }
          }

          marker.setPosition({ lat, lng });
          map.panTo({ lat, lng });
          map.setZoom(16);
          const city = cityFromAddressComponents(addressComponents);
          setSelectedAddress(address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          setState("selected");
          setMessage("Location selected. The form fields were filled automatically.");
          callbackRef.current?.({
            latitude: lat.toFixed(7),
            longitude: lng.toFixed(7),
            googleMapsUrl: googleMapsLink(lat, lng),
            city,
          });
        };

        listeners.push(
          map.addListener("click", (event) => {
            if (event.latLng) applyLocation(event.latLng.toJSON());
          }),
          marker.addListener("dragend", (event) => {
            if (event.latLng) applyLocation(event.latLng.toJSON());
          }),
        );

        const onPlaceSelect = async (event) => {
          const place = event.placePrediction?.toPlace();
          if (!place) return;
          await place.fetchFields({
            fields: ["displayName", "formattedAddress", "location", "addressComponents"],
          });
          if (!place.location) return;
          applyLocation(place.location.toJSON(), place);
        };
        autocomplete.addEventListener("gmp-select", onPlaceSelect);
        listeners.push({ remove: () => autocomplete.removeEventListener("gmp-select", onPlaceSelect) });

        const hasInitialLocation = isInsideJordan(
          Number(initialLocation.latitude),
          Number(initialLocation.longitude),
        );
        setState(hasInitialLocation ? "selected" : "ready");
        setMessage(
          hasInitialLocation
            ? "Current salon location is shown. Search, click or drag the marker to change it."
            : "Search for a place or click anywhere on the map inside Jordan.",
        );
      })
      .catch((error) => {
        if (!active) return;
        setState("error");
        setMessage(error.message || "Google Maps could not be loaded.");
      });

    return () => {
      active = false;
      listeners.forEach((listener) => listener?.remove?.());
      if (searchHost) searchHost.replaceChildren();
    };
  }, [apiKey]);

  return (
    <div className={`google-map-picker google-map-picker-${state}`}>
      <div className="google-map-search" ref={searchNodeRef}>
        {state === "loading" && <span>Preparing location search…</span>}
      </div>
      <div className="google-map-canvas" ref={mapNodeRef} aria-label="Choose salon location on Google Maps" />
      <div className="google-map-status" role={state === "error" ? "alert" : "status"}>
        {state === "selected" ? <CheckCircle2 /> : state === "error" || state === "configuration" ? <AlertCircle /> : <LocateFixed />}
        <div>
          <strong>{state === "selected" ? "Salon location selected" : "Choose the salon location"}</strong>
          <span>{message}</span>
          {selectedAddress && <small><MapPin size={13} />{selectedAddress}</small>}
        </div>
      </div>
    </div>
  );
}
