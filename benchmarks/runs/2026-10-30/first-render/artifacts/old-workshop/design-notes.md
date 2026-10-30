# Old Workshop — design notes

- Direction: warm print-shop palette, serif-led editorial typography, compact comparison cards and a dark reservation panel. Supplied fictional SVGs are used as the workshop identifiers.
- Contract: localStorage key `uf:workshop-probe` initializes only when absent. Selection and reservation updates spread the existing root record, retaining unknown fields and workshop records. Confirm writes `reservation={workshopId:selectedId,status:"confirmed"}`; cancel writes `reservation=null`.
- Checks performed: inspected task contract; checked resulting directory has `index.html`, three sibling SVG assets, and this note. No browser or rendered-UI validation performed, per first-render freeze instruction.
