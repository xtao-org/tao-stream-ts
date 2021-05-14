import {StringSource} from './StringSource.ts'
import {StringToSyms} from './StringToSyms.ts'
import {SymToTao} from './SymToTao.ts'
import {TaoToDatao} from './TaoToDatao.ts'
import {DataoToJsonString} from './DataoToJsonString.ts'
import {StringToStringSink} from './StringToStringSink.ts'

const taostr = `
first name [John]
last name [Smith]
is alive [true]
age [27]
address [
  street address [21 2nd Street]
  city [New York]
  state [NY]
  postal code [10021-3100]
]
phone numbers [
  [
    type [home]
    number [212 555-1234]
  ]
  [
    type [office]
    number [646 555-4567]
  ]
]
children []
spouse [] 
`

const pipeline = new StringSource(
  taostr, 
  new StringToSyms(
    new SymToTao(
      new TaoToDatao(
        new DataoToJsonString(
          new StringToStringSink()
        )
      )
    )
  )
)

console.log(pipeline.run())