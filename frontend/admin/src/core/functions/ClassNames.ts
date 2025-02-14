export function ClassNames(...className: (string | undefined | boolean)[]) {
  return className.filter(v => typeof v === "string").join(' ');
}