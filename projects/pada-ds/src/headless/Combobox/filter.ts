/** Decides whether an item matches the typed text. Return true to show it. */
export type ComboboxFilter = (itemText: string, inputValue: string) => boolean;

/** Case-insensitive "contains", ignoring accents. */
export const defaultComboboxFilter: ComboboxFilter = (itemText, inputValue) => {
  const normalise = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  return normalise(itemText).includes(normalise(inputValue.trim()));
};
