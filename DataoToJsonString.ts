import { DataoEvent,DataoEventTag,DataoEventText,DataoEventKey, DataoEventOpenTable } from "./DataoEvent.ts";
import { Feedback } from "./Feedback.ts";
import { Stream } from "./Stream.ts";

export class DataoToJsonString<Output> implements Stream<DataoEvent, Output> {
  constructor(private next: Stream<string, Output>) {}
  end(input: DataoEvent): Output {
    const id = input.tag
    if (id === DataoEventTag.text) {
      return this.next.end(JSON.stringify((input as DataoEventText).text))
    }
    if (id === DataoEventTag.closeTable) {
      return this.next.end(`}`)
    }
    if (id === DataoEventTag.closeList) {
      return this.next.end(`]`)
    }
    throw Error(`Unrecognized event: ${input}!`)
  }
  push(input: DataoEvent): Feedback {
    const id = input.tag
    if (id === DataoEventTag.openList) {
      return this.next.push('[')
    }
    if (id === DataoEventTag.openTable) {
      const {key} = input as DataoEventOpenTable
      return this.next.push(`{${JSON.stringify(key)}:`)
    }
    if (id === DataoEventTag.key) {
      const {key} = input as DataoEventKey
      return this.next.push(`,${JSON.stringify(key)}:`)
    }
    if (id === DataoEventTag.item) {
      return this.next.push(`,`)
    }
    if (id === DataoEventTag.text) {
      const {text} = input as DataoEventText
      return this.next.push(JSON.stringify(text))
    }
    if (id === DataoEventTag.closeTable) {
      return this.next.push(`}`)
    }
    if (id === DataoEventTag.closeList) {
      return this.next.push(`]`)
    }
    throw Error(`Unrecognized event: ${input}!`)
  }

}