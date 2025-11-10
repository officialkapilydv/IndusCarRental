export const buildQuery = (obj) =>
  new URLSearchParams(Object.entries(obj).filter(([, v]) => v !== undefined && v !== "")).toString();

export const readQuery = (search) => Object.fromEntries(new URLSearchParams(search));
