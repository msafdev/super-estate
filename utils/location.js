import { getDistance } from "@/utils/distance";

const CLOSE_LOCATION_LIMIT = 500;

export const filterCloseLocations = (data) => {
  const filtered = [];

  data.forEach((location) => {
    const isClose = filtered.some((filteredLocation) => {
      return (
        getDistance(
          location.lat,
          location.lng,
          filteredLocation.lat,
          filteredLocation.lng
        ) < CLOSE_LOCATION_LIMIT
      );
    });

    if (!isClose) {
      filtered.push(location);
    }
  });

  return filtered;
};

export const fetchLocations = async (supabase, bounds) => {
  const { data, error } = await supabase
    .from("properties-production")
    .select("*")
    .gt("lat", bounds.south)
    .lt("lat", bounds.north)
    .gt("lng", bounds.west)
    .lt("lng", bounds.east)
    .order("id", { ascending: true })
    .limit(50);

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  } else {
    console.log("Fetched locations:", data[0]);
  }

  return data || [];
};
