export const normalizeHeaderName = (headers: any, normalizedName: string) => {
  for (let name in headers) {
    if (
      name !== normalizedName &&
      name.toUpperCase() === normalizedName.toUpperCase()
    ) {
      headers[normalizedName] = headers[name];
      delete headers[name];
    }
  }
};
