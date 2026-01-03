export interface HistoryEntry {
  id: string;
  prompt: string;
  imageDataUrl: string;
  mimeType: string;
  generatedAt: number;
  brandName?: string;
}

const STORAGE_KEY = "image_generation_history";
const MAX_ENTRIES = 100;
const MAX_SIZE_BYTES = 4.5 * 1024 * 1024;

function estimateSize(entries: HistoryEntry[]): number {
  const json = JSON.stringify(entries);
  return json.length * 2;
}

export function getHistory(): HistoryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addToHistory(entry: HistoryEntry): { success: boolean; pruned: number } {
  try {
    let history = getHistory();
    
    if (history.some(h => h.id === entry.id)) {
      return { success: true, pruned: 0 };
    }
    
    history.unshift(entry);
    
    let pruned = 0;
    
    while (history.length > MAX_ENTRIES) {
      history.pop();
      pruned++;
    }
    
    while (estimateSize(history) > MAX_SIZE_BYTES && history.length > 1) {
      history.pop();
      pruned++;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return { success: true, pruned };
  } catch {
    return { success: false, pruned: 0 };
  }
}

export function removeFromHistory(id: string): boolean {
  try {
    const history = getHistory().filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}

export function clearHistory(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function getHistoryCount(): number {
  return getHistory().length;
}
