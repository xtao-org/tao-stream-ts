export enum DataoEventTag {
  text = 'text',
  key = 'key',
  item = 'item',
  openTable = 'open table',
  closeTable = 'close table',
  openList = 'open list',
  closeList = 'close list',
}

export class DataoEvent {
  constructor(
    public tag: DataoEventTag,
  ) {}
}

export class DataoEventTop extends DataoEvent {
  constructor(
    public tag: DataoEventTag,
    public top: boolean = false,
  ) {
    super(tag)
  }
}

export class DataoEventText extends DataoEventTop {
  constructor(
    public text: string,
    public top: boolean = false,
  ) {
    super(
      DataoEventTag.text,
      top,
    )
  }
}

export class DataoEventKey extends DataoEvent {
  constructor(
    public key: string,
  ) {
    super(
      DataoEventTag.key,
    )
  }
}

export class DataoEventOpenTable extends DataoEventTop {
  constructor(
    public key: string,
    public top: boolean = false,
  ) {
    super(
      DataoEventTag.openTable,
    )
  }
}