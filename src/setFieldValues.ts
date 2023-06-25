import { Mutator } from "final-form";
import untypedSetFieldValues from "final-form-set-field-data";

export function getSetFieldData<TFieldValues>() {
  return (untypedSetFieldValues as any) as Mutator<
    TFieldValues,
    Partial<TFieldValues>
  >;
}
