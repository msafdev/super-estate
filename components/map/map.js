"use client";

import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useState, useMemo } from "react";
import { debounce } from "lodash";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Control from "@/components/map/control";
import Search from "@/components/map/search";
import { MapStyle } from "@/constants/map-styles";
import { fetchLocations, filterCloseLocations } from "@/utils/location";
import { Loader2 } from "lucide-react";
import "../../devlink-demo/global.css";
import Pill from "./pill";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 40.748817,
  lng: -73.985428,
};

const pin = "./icons/pin.png";

const libraries = ["places"];

const MapWidget = () => {
  const supabase = createClientComponentClient();
  const [map, setMap] = useState(null);
  const [locations, setLocations] = useState([]);
  const [mapBounds, setMapBounds] = useState(null);
  const [prevBounds, setPrevBounds] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const throttledGetLocations = useMemo(
    () =>
      debounce(async (bounds) => {
        const fetchedLocations = await fetchLocations(supabase, bounds);
        const filteredLocations = filterCloseLocations(fetchedLocations);
        setLoading(false);
        setLocations(filteredLocations);
      }, 2000),
    [supabase, map]
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries: libraries,
  });

  const onLoad = useCallback((map) => {
    setMap(map);
    const bounds = map.getBounds();
    if (bounds) {
      setMapBounds(bounds.toJSON());
    }
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onBoundsChanged = useCallback(() => {
    setLoading(true);

    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        setMapBounds(bounds.toJSON());
        throttledGetLocations(bounds.toJSON());
      }
    }
  }, [map, throttledGetLocations]);

  useEffect(() => {
    if (
      mapBounds &&
      (!prevBounds || JSON.stringify(mapBounds) !== JSON.stringify(prevBounds))
    ) {
      setPrevBounds(mapBounds);
      throttledGetLocations(mapBounds);
    }
  }, [mapBounds, prevBounds, throttledGetLocations]);

  const mapOptions = useMemo(
    () => ({
      styles: MapStyle,
      disableDefaultUI: true,
      minZoom: 8,
      maxZoom: 16,
    }),
    []
  );

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return (
        new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        }).format(price / 1000000) + " M"
      );
    } else if (price >= 100000) {
      return (
        new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(price / 1000) + " K"
      );
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    }
  };

  if (!isLoaded) return <div className="w-svw h-svh bg-[#F9F5ED]"></div>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onBoundsChanged={onBoundsChanged}
        clickableIcons={false}
        onClick={() => setSelected(null)}
      >
        {locations.map((location) => (
          <OverlayView
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <Pill
              address={location.address}
              name={location.name}
              price={`$ ${formatPrice(location.price_sell)}`}
              type={location.listing_type}
            />
          </OverlayView>
        ))}
      </GoogleMap>
      <Control map={map} />
      <Search />
      {loading && (
        <div className="absolute flex items-center justify-center bottom-8 rounded-full size-10 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur">
          <Loader2 className="text-white size-5 animate-spin mx-auto" />
        </div>
      )}
    </>
  );
};

export default MapWidget;
