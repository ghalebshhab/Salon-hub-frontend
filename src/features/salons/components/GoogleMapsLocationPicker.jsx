import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../../../shared/lib/googleMapsLoader.js";
import {
  cityFromAddressComponents,
  DEFAULT_MAP_CENTER,
  isInsideJordan,
  JORDAN_MAP_BOUNDS,
} from "../model/jordanMapLocation.js";

const OVERVIEW_ZOOM = 8;
const STREET_ZOOM = 17;

/**
 * Interactive Google Map limited to Jordan. The owner can search a place,
 * click the map or drag the pin. `point` is controlled by the parent, so the
 * parent can also move the pin (for example from the device location).
 */
export default function GoogleMapsLocationPicker({
  apiKey,
  point,
  onPick,
  onUnavailable,
  onOutsideJordan,
}) {
  const mapNodeRef = useRef(null);
  const searchNodeRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const callbacksRef = useRef({ onPick, onUnavailable, onOutsideJordan });
  const initialPointRef = useRef(point);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    callbacksRef.current = { onPick, onUnavailable, onOutsideJordan };
  }, [onPick, onUnavailable, onOutsideJordan]);

  useEffect(() => {
    let active = true;
    const listeners = [];
    const searchHost = searchNodeRef.current;

    loadGoogleMaps(apiKey)
      .then(async () => {
        const [{ Map }, { PlaceAutocompleteElement }] = await Promise.all([
          window.google.maps.importLibrary("maps"),
          window.google.maps.importLibrary("places"),
        ]);
        if (!active || !mapNodeRef.current || !searchHost) return;

        const initialPoint = initialPointRef.current;
        const map = new Map(mapNodeRef.current, {
          center: initialPoint || DEFAULT_MAP_CENTER,
          zoom: initialPoint ? STREET_ZOOM : OVERVIEW_ZOOM,
          restriction: { latLngBounds: JORDAN_MAP_BOUNDS, strictBounds: true },
          clickableIcons: false,
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          gestureHandling: "greedy",
        });
        const marker = new window.google.maps.Marker({
          map: initialPoint ? map : null,
          position: initialPoint || DEFAULT_MAP_CENTER,
          draggable: true,
          title: "Salon location",
        });
        mapRef.current = map;
        markerRef.current = marker;

        const geocoder = new window.google.maps.Geocoder();
        const search = new PlaceAutocompleteElement({
          includedRegionCodes: ["jo"],
          placeholder: "Search the salon name, street or area",
        });
        searchHost.replaceChildren(search);

        const pick = async ({ lat, lng }, place = {}) => {
          if (!isInsideJordan(lat, lng)) {
            callbacksRef.current.onOutsideJordan?.();
            return;
          }
          marker.setPosition({ lat, lng });
          marker.setMap(map);
          map.panTo({ lat, lng });
          if (map.getZoom() < STREET_ZOOM - 2) map.setZoom(STREET_ZOOM);

          let address = place.formattedAddress || "";
          let components = place.addressComponents || [];
          if (!address || !components.length) {
            try {
              const { results } = await geocoder.geocode({
                location: { lat, lng },
              });
              address ||= results?.[0]?.formatted_address || "";
              components = results?.[0]?.address_components || [];
            } catch {
              // The point stays valid even when Google cannot name the address.
            }
          }
          callbacksRef.current.onPick?.({
            point: { lat, lng },
            address,
            city: cityFromAddressComponents(components),
          });
        };

        listeners.push(
          map.addListener("click", (event) => {
            if (event.latLng) pick(event.latLng.toJSON());
          }),
          marker.addListener("dragend", (event) => {
            if (event.latLng) pick(event.latLng.toJSON());
          }),
        );

        const onPlaceSelect = async (event) => {
          const place = event.placePrediction?.toPlace();
          if (!place) return;
          await place.fetchFields({
            fields: ["formattedAddress", "location", "addressComponents"],
          });
          if (place.location) pick(place.location.toJSON(), place);
        };
        search.addEventListener("gmp-select", onPlaceSelect);
        listeners.push({
          remove: () => search.removeEventListener("gmp-select", onPlaceSelect),
        });

        setReady(true);
      })
      .catch((error) => {
        if (active) callbacksRef.current.onUnavailable?.(error);
      });

    return () => {
      active = false;
      listeners.forEach((listener) => listener?.remove?.());
      markerRef.current?.setMap(null);
      markerRef.current = null;
      mapRef.current = null;
      searchHost?.replaceChildren();
    };
  }, [apiKey]);

  // Follow pin changes that come from the parent (device location).
  const lat = point?.lat;
  const lng = point?.lng;
  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    if (!ready || !map || !marker || lat == null || lng == null) return;
    const current = marker.getMap() ? marker.getPosition()?.toJSON() : null;
    if (current && current.lat === lat && current.lng === lng) return;
    marker.setPosition({ lat, lng });
    marker.setMap(map);
    map.panTo({ lat, lng });
    map.setZoom(STREET_ZOOM);
  }, [ready, lat, lng]);

  return (
    <div className="map-picker" data-ready={ready}>
      <div className="map-picker-search" ref={searchNodeRef} />
      <div className="map-picker-stage">
        <div
          className="map-picker-canvas"
          ref={mapNodeRef}
          role="application"
          aria-label="Map of Jordan. Click to place the salon pin."
        />
        {!ready && (
          <div className="map-picker-loading" role="status">
            <LoaderCircle className="spin" aria-hidden="true" />
            Loading Google Maps…
          </div>
        )}
      </div>
    </div>
  );
}
