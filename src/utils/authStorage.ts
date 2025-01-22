export const getUserEmail = (): string => {
  return sessionStorage.getItem("userEmail") || "";
};
  
export const clearUserEmail = (): void => {
  sessionStorage.removeItem("userEmail");
};

export const getDisplayName = (): string => {
  return sessionStorage.getItem("displayName") || ""
}

export const clearDisplayName = (): void => {
  sessionStorage.removeItem("displayName")
}

export const getPhotoUrl = (): string => {
  return sessionStorage.getItem("photoUrl") || ""
}

export const clearPhotoUrl = (): void => {
  return sessionStorage.removeItem("photoUrl")
}