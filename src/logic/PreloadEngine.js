const collectMenuImages = (menu) => {
  try {
    const imgs = [];
    menu.forEach((category) => {
      if (Array.isArray(category.items)) {
        category.items.forEach((item) => {
          if (item && typeof item.img === 'string') {
            imgs.push(item.img);
          }
        });
      }
    });
    return imgs;
  } catch (_) {
    return [];
  }
};

export const preloadImages = (menu) => {
  const staticAssets = ['/logo-iceberg.png', '/bebidas.png'];
  const dynamicAssets = collectMenuImages(menu);
  const imageAssets = Array.from(new Set([...staticAssets, ...dynamicAssets]));
  imageAssets.forEach((src) => {
    try {
      const img = new Image();
      img.loading = 'eager';
      img.fetchPriority = 'high';
      img.src = src;
    } catch (_) {}
  });
};
