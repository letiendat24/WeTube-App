import axios from "axios";
const API_KEY = import.meta.env.VITE_KEY_API;

const BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function fetchHomeVideos(pageToken = "") {
  try {
    const res = await axios.get(`${BASE_URL}/videos`, {
      params: {
        key: API_KEY,
        part: "snippet,statistics,contentDetails",
        chart: "mostPopular",
        maxResults: 20,
        pageToken,
        regionCode: "VN",
      },
    });

    return res.data;
  } catch (err) {
    console.log("fetchHomeVideos error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.error?.message || "Failed to fetch home videos"
    );
  }
}


export async function searchYoutube(query, pageToken = "") {
  try {
    const res = await axios.get(`${BASE_URL}/search`, {
      params: {
        key: API_KEY,
        part: "snippet",
        q: query,
        type: "video,channel,playlist",
        maxResults: 12,
        regionCode: "VN",
        pageToken,
      },
    });

    return {
      items: res.data.items,
      nextPageToken: res.data.nextPageToken || "",
    };

  } catch (err) {
    console.log("searchYoutube error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.error?.message || "Failed to search videos"
    );
  }
}

export async function fetchSuggestions(query) {
  const res = await axios.get(
    `http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${query}`
  );
  return res.data; // format: [query, ["gợi ý 1", "gợi ý 2", ...]]
}