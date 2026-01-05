export interface BrandProfile {
  brandName: string;
  primaryColor: string;
  secondaryColor: string;
  fontStyle: string;
  visualStyle: string;
  targetGender: string;
  targetAgeRange: string;
  targetAudienceDescription: string;
  selectedAudienceProfileId: string;
  audiencePromptInsert: string;
  additionalNotes: string;
  targetAudience: string;
  logoDataUrl: string | null;
  lastModified: number;
  // New generic audience fields
  targetLocation?: string;
  targetIncome?: string;
  targetInterests?: string;
  targetLanguage?: string;
}

const STORAGE_KEY = "brand_profiles";
const ACTIVE_PROFILE_KEY = "active_brand_profile";

export function getAllProfiles(): BrandProfile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as BrandProfile[];
  } catch {
    return [];
  }
}

export function getProfileByName(brandName: string): BrandProfile | null {
  const profiles = getAllProfiles();
  return profiles.find((p) => p.brandName.toLowerCase() === brandName.toLowerCase()) || null;
}

export function saveProfile(profile: BrandProfile): void {
  const profiles = getAllProfiles();
  const existingIndex = profiles.findIndex(
    (p) => p.brandName.toLowerCase() === profile.brandName.toLowerCase()
  );
  
  const updatedProfile = {
    ...profile,
    lastModified: Date.now(),
  };

  if (existingIndex >= 0) {
    profiles[existingIndex] = updatedProfile;
  } else {
    profiles.push(updatedProfile);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function deleteProfile(brandName: string): void {
  const profiles = getAllProfiles();
  const filtered = profiles.filter(
    (p) => p.brandName.toLowerCase() !== brandName.toLowerCase()
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  
  const active = getActiveProfileName();
  if (active?.toLowerCase() === brandName.toLowerCase()) {
    clearActiveProfile();
  }
}

export function getActiveProfileName(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY);
  } catch {
    return null;
  }
}

export function setActiveProfileName(brandName: string): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, brandName);
}

export function clearActiveProfile(): void {
  localStorage.removeItem(ACTIVE_PROFILE_KEY);
}

export function loadActiveProfile(): BrandProfile | null {
  const activeName = getActiveProfileName();
  if (!activeName) return null;
  return getProfileByName(activeName);
}
