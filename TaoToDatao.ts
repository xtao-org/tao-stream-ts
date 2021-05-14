import { DataoEvent,DataoEventText,DataoEventTop,DataoEventTag,DataoEventKey, DataoEventOpenTable } from "./DataoEvent.ts";
import { Feedback } from "./Feedback.ts";
import { Stream } from "./Stream.ts";
import { Sym } from "./Sym.ts";
import { TaoEvent,TaoEventTag,TaoEventOp } from "./TaoEvent.ts";

export enum DataoParentType {
  unknown = 'unknown',
  table = 'table',
  list = 'list',
}

export class TaoToDatao<Output> implements Stream<TaoEvent, Output> {
  private buf: Sym[] = []
  private parents: DataoParentType[] = [DataoParentType.unknown]

  constructor(private next: Stream<DataoEvent, Output>) {}
  end(input: TaoEvent): Output {
      if (input.tag === TaoEventTag.finish) {
        this.buf.push(...input.buffer)
        const parent = this.parents[0]
        if (parent === DataoParentType.unknown) {
          // string/text (top level)
          return this.next.end(new DataoEventText(this.buf.join(''), true))
        }
        if (this.buf.join('').trim() !== '') throw Error(`Unexpected nonblank at structure end!`)
        // table or list end (top level)
        if (parent === DataoParentType.table) {
          return this.next.end(new DataoEventTop(DataoEventTag.closeTable, true))
        }
        return this.next.end(new DataoEventTop(DataoEventTag.closeList, true))
      }
      throw Error(`Unrecognized event: ${input}!`)
  }
  push(input: TaoEvent): Feedback {
    const id = input.tag
    this.buf.push(...input.buffer)
    // note: op doesn't generate event for now
    if (id === TaoEventTag.op) {
      this.buf.push((input as TaoEventOp).symbol)
      return Feedback.continue
    }
    const key = this.buf.join('').trim()
    if (id === TaoEventTag.open) {
      const parent = this.parents[0]
      let ret
      if (parent === DataoParentType.unknown) {
        if (key === '') {
          // open list
          ret = new DataoEvent(DataoEventTag.openList)
          this.parents[0] = DataoParentType.list
        } else {
          // open table with key
          ret = new DataoEventOpenTable(key)
          this.parents[0] = DataoParentType.table
        }
      } else {
        if (parent === DataoParentType.table) {
          // key
          if (key === '') throw Error('Unexpected empty key in object!')
          ret = new DataoEventKey(key)
        } else if (key !== '') {
          throw Error('Unexpected nonblank in list!')
        } else {
          ret = new DataoEvent(DataoEventTag.item)
        }
      }

      this.parents.unshift(DataoParentType.unknown)
      this.buf = []
      if (ret === undefined) return Feedback.continue
      return this.next.push(ret as DataoEvent)
    }
    if (id === TaoEventTag.close) {
      const parent = this.parents.shift()

      let ret
      if (parent === DataoParentType.unknown) {
        // string/text
        ret = new DataoEventText(this.buf.join('')) // {event: 'text', text: this.buf.join('')}
      } else {
        if (this.buf.join('').trim() !== '') throw Error(`Unexpected nonblank at structure end!`)
        // table or list end
        if (parent === DataoParentType.table) {
          ret = new DataoEvent(DataoEventTag.closeTable) // {event: 'table end'}
        } else {
          ret = new DataoEvent(DataoEventTag.closeList) // {event: 'list end'}
        }
      }

      this.buf = []
      return this.next.push(ret)
    }
    throw Error(`Unrecognized event: ${input}!`)
  }

}