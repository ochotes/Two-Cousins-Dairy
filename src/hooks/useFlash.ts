"use client";

import { useState } from "react";

const FLASH_MS = 5000;

/**
 * True if `timestamp` was within the last 5 seconds at mount.
 *
 * Callers must remount the component when `timestamp` changes (e.g. by
 * including it in the element's `key`) so the flash retriggers — the CSS
 * `flash-glow` animation uses `forwards` fill mode, so no JS timer is
 * needed to turn it back off.
 */
export function useFlashOnMount(timestamp: number) {
  const [flashing] = useState(() => Date.now() - timestamp < FLASH_MS);
  return flashing;
}
