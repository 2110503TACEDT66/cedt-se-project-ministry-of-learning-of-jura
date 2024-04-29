export default function filterKeyAllDepth(object: any, targetKey: string) {
  for (let key in object) {
    if (!object.hasOwnProperty(key)) {
    }
    if (key == targetKey) {
      delete object[key];
    }
    if (typeof object[key] == "object") {
      filterKeyAllDepth(object[key], targetKey);
    }
  }
}
