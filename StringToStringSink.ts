import { Feedback } from "./Feedback.ts";
import { Stream } from "./Stream.ts";

export class StringToStringSink implements Stream<string, string> {
  private ret = ''
  end(input: string): string {
    this.ret += input
    return this.ret
  }
  push(input: string): Feedback {
    this.ret += input
    return Feedback.continue
  }
}