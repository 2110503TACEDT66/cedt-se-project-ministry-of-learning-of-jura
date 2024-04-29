export default function (discounts: any, currentDiscountsLength: number) {
  let set: Set<number> = new Set();
  let max = -1;
  for (let key in discounts) {
    let indexStr = key.match(/discounts\.(\d+)/)![1];
    let index = parseInt(indexStr);
    if (index >= currentDiscountsLength) {
      max = Math.max(index, max);
      set.add(index);
    }
  }
  for (let i = currentDiscountsLength; i <= max; i++) {
    if (!set.has(i)) {
      return false;
    }
  }
  return true;
}
