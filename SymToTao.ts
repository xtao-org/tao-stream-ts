import { Feedback } from "./Feedback.ts";
import { Stream } from "./Stream.ts";
import { Sym } from "./Sym.ts";
import { TaoEvent,TaoEventTag,TaoEventOp } from "./TaoEvent.ts";

export class SymToTao<Output> implements Stream<Sym, Output> {
  private state = {
    depth: 0, 
    buffer: [] as Sym[], 
    isOp: false,
    isDone: false,
  }
  constructor(
    private next: Stream<TaoEvent, Output>,
    private meta: {
      op: Sym,
      open: Sym,
      close: Sym,
    } = {
      op: '`',
      open: '[',
      close: ']',
    },
  ) {}
  end(): Output {
    if (this.state.isDone) {
      // actually could and it would work
      throw Error(`Can't end more than once!`)
    } else if (this.state.isOp) {
      throw Error(`Unexpected stream end after op! ${this.debug()}`)
    } else if (this.state.depth > 0) {
      throw Error(`Unexpected end of stream before close! ${this.debug()}`)
    }
    this.state.isDone = true
    return this.next.end(new TaoEvent(TaoEventTag.finish, this.flushBuffer()))
  }
  push(symbol: Sym): Feedback {
    if (this.state.isOp) {
      this.state.isOp = false
      return this.next.push(new TaoEventOp(symbol, this.flushBuffer()))
    } else if (symbol === this.meta.open) {
      this.state.depth += 1
      return this.next.push(new TaoEvent(TaoEventTag.open, this.flushBuffer()))
    } else if (symbol === this.meta.close) {
      if (this.state.depth > 0) {
        this.state.depth -= 1
        return this.next.push(new TaoEvent(TaoEventTag.close, this.flushBuffer()))
      } else {
        throw Error(`Unexpected top-level close! ${this.debug(symbol)}`)
      }
    } else if (symbol === this.meta.op) {
      this.state.isOp = true
    } else {
      this.pushBuffer(symbol)
    }
    return Feedback.continue
  }
  private debug = (symbol?: Sym) => JSON.stringify({
    ...this.state, 
    ...(symbol === undefined? {done: true}: {symbol}),
  })
  private flushBuffer = () => {
    const ret = this.state.buffer; 
    this.state.buffer = []; 
    return ret
  }
  private pushBuffer = (symbol: Sym) => this.state.buffer.push(symbol)
}