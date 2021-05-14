import { Source } from "./Source.ts";
import { Stream } from "./Stream.ts";

export class StringSource<Output> implements Source<Output> {
  constructor(
    private str: string,
    private next: Stream<string, Output>,
  ) {}
  run(): Output {
    this.next.push(this.str)
    return this.next.end()
  }
}