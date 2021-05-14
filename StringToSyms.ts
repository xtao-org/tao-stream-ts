import { Sym } from "./Sym.ts";
import { Feedback } from "./Feedback.ts";
import { Stream } from "./Stream.ts";

export class StringToSyms<Output> implements Stream<string, Output> {
  constructor(
    private next: Stream<Sym, Output>,
  ) {}
  end(_input?: string): Output {
    return this.next.end()
  }
  push(input: string): Feedback {
    for (let i = 0; i < input.length; ++i) {
      const ret = this.next.push(input[i])
      if (ret === Feedback.abort) return ret
    }
    return Feedback.continue
  }
}