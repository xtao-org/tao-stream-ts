import { Sym } from "./Sym.ts";

export enum TaoEventTag {
  op = 'op',
  open = 'open',
  close = 'close',
  finish = 'finish',
}

export class TaoEvent {
  constructor(
    public tag: TaoEventTag,
    public buffer: Sym[],
  ) {}
}

export class TaoEventOp extends TaoEvent {
  constructor(
    public symbol: Sym,
    public buffer: Sym[],
  ) {
    super(
      TaoEventTag.op,
      buffer,
    )
  }
}