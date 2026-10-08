// Returns the last emoji typed in `text`, or null if there isn't one (letters, digits and spaces don't count).
export function lastEmoji(text) {
  const joiner = cp => cp === 0x200d || cp === 0xfe0f || cp === 0x20e3 || (cp >= 0x1f3fb && cp <= 0x1f3ff);
  const regional = cp => cp >= 0x1f1e6 && cp <= 0x1f1ff;
  const clusters = [];
  for (const ch of Array.from(text)) {
    const cp = ch.codePointAt(0);
    const prev = clusters[clusters.length - 1];
    const prevCp = prev && Array.from(prev).pop().codePointAt(0);
    if (prev && (joiner(cp) || prevCp === 0x200d || (regional(cp) && Array.from(prev).length === 1 && regional(prevCp)))) {
      clusters[clusters.length - 1] = prev + ch;
    } else {
      clusters.push(ch);
    }
  }
  const emojis = clusters.filter(cl => /[^\x00-\x7F]/.test(cl) && !/^\s+$/.test(cl));
  return emojis.length ? emojis[emojis.length - 1] : null;
}
