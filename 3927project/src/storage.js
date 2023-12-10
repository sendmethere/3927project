export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Saving to localStorage failed', err);
  }
};

export const  loadFromLocalStorage = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (err) {
    console.error('Loading from localStorage failed', err);
    return defaultValue;
  }
};