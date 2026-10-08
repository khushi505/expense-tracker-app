import { useState } from 'react';

// Whether the home screen's total is hidden. It starts hidden every time the app opens.
export function useHiddenTotal() {
  const [hidden, setHidden] = useState(true);
  return { hidden, setHidden };
}
