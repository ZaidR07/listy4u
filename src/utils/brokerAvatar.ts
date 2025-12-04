/**
 * Utility functions for broker avatar handling
 */

const initials = (name?: string) => {
  if (!name) return "B";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase()).join("") || "B";
};

export const svgAvatarDataUrl = (name?: string) => {
  const text = initials(name);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
    <rect width='100%' height='100%' rx='64' ry='64' fill='#f3f4f6'/>
    <text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='48' fill='#374151'>${text}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const getBrokerImageSrc = (image?: string, brokerName?: string) => {
  return image ? image : svgAvatarDataUrl(brokerName);
};

export const handleBrokerImageError = (e: React.SyntheticEvent<HTMLImageElement>, brokerName?: string) => {
  const img = e.currentTarget as HTMLImageElement;
  img.onerror = null;
  img.src = svgAvatarDataUrl(brokerName);
};
