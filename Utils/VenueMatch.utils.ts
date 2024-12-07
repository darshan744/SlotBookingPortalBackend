export const venueMatch = (slotTime: string, venue: string): boolean => {
    if (slotTime !== null && slotTime !== undefined) {
      let slot = slotTime.split("|")[0].trim();
      return slot === venue;
    }
    return false;
  };