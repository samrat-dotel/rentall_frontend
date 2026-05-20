import { items as localItems } from "../data/items";
import { categories as localCategories } from "../data/categories";

const API_BASE_URL = "http://127.0.0.1:8000";

function normalizeLocalItem(item) {
  return {
    ...item,
    source: "local",
    ownerName: "",
    ownerEmail: "",
    ownerProfilePic: "",
  };
}

function normalizeBackendItem(item) {
  return {
    _id: item._id,
    name: item.name,
    price: Number(item.price || 0),
    stock: Number(item.stock || 0),
    featured: Boolean(item.featured),
    availableDate: item.availableDate || "",
    description: item.description || "",
    category: item.category || "",
    userId: item.userId || "",
    image: item.image || "",
    images: Array.isArray(item.images) ? item.images : [],
    source: "backend",

    // Real owner details from backend
    ownerName: item.ownerName || "",
    ownerEmail: item.ownerEmail || "",
    ownerProfilePic: item.ownerProfilePic || "",
  };
}

function dedupeById(list) {
  const map = new Map();

  list.forEach((item) => {
    if (item && item._id) {
      map.set(item._id, item);
    }
  });

  return Array.from(map.values());
}

export async function getBackendItems() {
  try {
    const res = await fetch(`${API_BASE_URL}/items?t=${Date.now()}`, {
      cache: "no-store",
    });

    console.log("BACKEND FETCH STATUS:", res.status);

    if (!res.ok) {
      console.error("Failed to fetch backend items:", res.status);
      return [];
    }

    const data = await res.json();

    console.log("BACKEND ITEMS FROM SERVICE:", data);

    return data.map(normalizeBackendItem);
  } catch (error) {
    console.error("Backend items fetch error:", error);
    return [];
  }
}

export async function getHybridItems() {
  const backendItems = await getBackendItems();
  const local = localItems.map(normalizeLocalItem);

  const sortedBackendItems = [...backendItems].sort((a, b) => {
    const aId = Number(String(a._id || "").replace("bi", ""));
    const bId = Number(String(b._id || "").replace("bi", ""));

    return bId - aId;
  });

  return dedupeById([...sortedBackendItems, ...local]);
}

export async function getHybridFeaturedItems() {
  const items = await getHybridItems();

  return items.filter((item) => item.featured);
}

export async function getHybridItemById(itemId) {
  const items = await getHybridItems();

  return items.find((item) => item._id === itemId) || null;
}

export async function getBackendCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/categories?t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch backend categories:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Backend categories fetch error:", error);
    return [];
  }
}

export async function getHybridCategories() {
  const backendCategories = await getBackendCategories();

  const map = new Map();

  localCategories.forEach((category) => {
    map.set(category._id, {
      ...category,
      source: "local",
    });
  });

  backendCategories.forEach((category) => {
    if (!map.has(category._id)) {
      map.set(category._id, {
        ...category,
        source: "backend",
      });
    }
  });

  return Array.from(map.values());
}

export async function createBackendItem(itemData, token) {
  const res = await fetch(`${API_BASE_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(itemData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Could not create item.");
  }

  return normalizeBackendItem(data);
}

export async function uploadItemImage(file, token) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/items/upload-image`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Could not upload image.");
  }

  return data.imageUrl;
}