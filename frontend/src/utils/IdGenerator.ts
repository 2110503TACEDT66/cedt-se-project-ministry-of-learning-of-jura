export class IdGenerator {
  current = 0;
  next() {
    this.current += 1;
    return this.current;
  }
}
