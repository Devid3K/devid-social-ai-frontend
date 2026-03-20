export const VIDEO_STYLES = [
  { id: 'anime', label: 'Anime น่ารัก', icon: 'mdi:animation', description: 'สไตล์อนิเมะ kawaii' },
  { id: 'realistic', label: 'สมจริง', icon: 'mdi:camera', description: 'วิดีโอเหมือนจริง' },
  { id: 'drama', label: 'ดราม่า', icon: 'mdi:theater', description: 'บทละครดราม่า' },
  { id: 'kawaii', label: 'Kawaii', icon: 'mdi:heart', description: 'น่ารัก pastel' },
  { id: 'cinematic', label: 'Cinematic', icon: 'mdi:movie-open', description: 'แบบหนัง cinematic' },
  { id: 'nature', label: 'ธรรมชาติ', icon: 'mdi:tree', description: 'ธีมธรรมชาติ' },
  { id: 'dark', label: 'Dark/Cool', icon: 'mdi:weather-night', description: 'ธีมเท่ มืด' },
] as const

export type VideoStyleId = (typeof VIDEO_STYLES)[number]['id']
