import { Feedback } from "./Feedback.ts";

export type Stream<Input, Output> = {
  end(input?: Input): Output,
  push(input: Input): Feedback
}