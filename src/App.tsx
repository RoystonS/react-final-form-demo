import React from "react";
import { Field, Input, makeResetStyles } from "@fluentui/react-components";
import {
  Form,
  Field as FFField,
  useForm,
  useFormState,
  useField
} from "react-final-form";
import createFinalFormFocusDecorator from "final-form-focus";

import { GracefulField } from "./GracefulField";
import { getSetFieldData } from "./setFieldValues";

const usePreStatusStyles = makeResetStyles({
  display: "inline-block",
  margin: 0
});
const useStatusGridStyles = makeResetStyles({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gridGap: "0 4px"
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

interface FieldValues {
  username: string;
  phone: string;
  quantity: number | undefined;
}

const setFieldData = getSetFieldData<FieldValues>();

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, null, 2));
};

const normalizePhone = (value) => {
  if (!value) return value;
  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length <= 3) return onlyNums;
  if (onlyNums.length <= 7)
    return `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 7)}`;
  return `(${onlyNums.slice(0, 3)}) ${onlyNums.slice(3, 6)}-${onlyNums.slice(
    6,
    10
  )}`;
};

const mutators = { setFieldData };

const parseInteger = (value) => {
  value = value ? value.trim() : null;
  if (!value) return null;
  // BAD PARSING FOR EUROPE!
  value = value.replace(/,/g, "");
  const parsed = parseFloat(value);
  if (!Number.isFinite(parsed)) throw new Error(`invalid number`);
  if (parsed % 1) throw new Error(`must be an integer`);
  return parsed;
};

const formatNumber = (value) => (!Number.isFinite(value) ? "" : String(value));

const requiredPositiveNumber = (value) =>
  !Number.isFinite(value)
    ? "is required"
    : value <= 0
    ? "must be > 0"
    : undefined;

const TextField = ({ input, meta: { touched, error }, label }) => (
  <Field validationMessage={touched ? error : ""}>
    {label}
    <Input {...input} />
  </Field>
);

const focusOnError = createFinalFormFocusDecorator<FieldValues>();

const FormContent = () => {
  const form = useForm<FieldValues>();
  const formState = useFormState<FieldValues>();
  const statusPreClassName = usePreStatusStyles();
  const statusGridClassName = useStatusGridStyles();

  const { values, errors, touched, submitting, pristine } = formState;

  return (
    <form onSubmit={form.submit}>
      <div>
        <FFField
          name="username"
          label="Username"
          component={TextField}
          placeholder="Username"
          parse={(value) => value && value.toUpperCase()}
          format={(value) => (value ? value.toLowerCase() : "")}
        />
      </div>
      <div>
        <FFField<string, HTMLInputElement, string>
          name="phone"
          label="Phone"
          component={TextField}
          parse={normalizePhone}
          placeholder="(999) 999-9999"
          validate={(v) => (v && v.length > 8 ? "I am in error" : undefined)}
        />
      </div>
      <div>
        <GracefulField<number, string, HTMLInputElement>
          name="quantity"
          label="Quantity"
          component={TextField}
          format={formatNumber}
          parse={parseInteger}
          validate={requiredPositiveNumber}
        />
      </div>
      <div className="buttons">
        <button type="submit" disabled={submitting || pristine}>
          Submit
        </button>
        <button
          type="button"
          onClick={() => form.reset()}
          disabled={submitting || pristine}
        >
          Reset
        </button>
      </div>

      <div className={statusGridClassName}>
        <span>Values:</span>
        <pre className={statusPreClassName}>{JSON.stringify(values)}</pre>
        <span>Errors:</span>
        <pre className={statusPreClassName}>{JSON.stringify(errors)}</pre>
        <span>Touched:</span>
        <pre className={statusPreClassName}>{JSON.stringify(touched)}</pre>
      </div>
    </form>
  );
};

export const App = () => {
  return (
    <>
      <Form<FieldValues>
        onSubmit={onSubmit}
        initialValues={{
          quantity: 12
        }}
        decorators={[focusOnError]}
        mutators={mutators}
        component={FormContent}
      />
    </>
  );
};
