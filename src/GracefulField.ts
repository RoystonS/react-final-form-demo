import * as React from "react";
import { useGracefulField } from "react-final-form-graceful-field";
import type { FieldRenderProps } from "react-final-form";
import type { FieldValidator, FieldSubscription } from "final-form";

// Redeclare forwardRef to pass through generics correctly.
// https://fettblog.eu/typescript-react-generic-forward-refs/
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type GracefulFieldProps<FieldValue, InputValue> = {
  name: string;
  afterSubmit?: () => void;
  allowNull?: boolean;
  beforeSubmit?: () => void | false;
  component?: React.ComponentType<any> | "input" | "select" | "textarea";
  children?: ((props: any) => React.ReactNode) | React.ReactNode;
  render?: (props: any) => React.ReactNode;
  data?: Object;
  defaultValue?: FieldValue;
  format?: (value: FieldValue, name: string) => InputValue;
  initialValue?: FieldValue;
  invalidValue?: any;
  isEqual?: (a: any, b: any) => boolean;
  label?: string;
  multiple?: boolean;
  parse?: (value: InputValue, name: string) => FieldValue;
  type?: string;
  validate?: FieldValidator<FieldValue>;
  validateFields?: string[];
  value?: any;
  subscription?: FieldSubscription;
};

function InnerGracefulField<FieldValue, InputValue, TRef = any>(
  {
    afterSubmit,
    allowNull,
    beforeSubmit,
    children,
    component,
    render,
    data,
    defaultValue,
    format,
    initialValue,
    invalidValue,
    isEqual,
    multiple,
    name,
    parse,
    subscription,
    type,
    validate,
    validateFields,
    value,
    ..._rest
  }: GracefulFieldProps<FieldValue, InputValue>,
  ref: React.ForwardedRef<TRef>
): JSX.Element {
  const rest: any = _rest;
  if (!name) {
    throw new Error(
      "prop name cannot be undefined in <GracefulField> component"
    );
  }

  const field = useGracefulField(name, {
    afterSubmit,
    allowNull,
    beforeSubmit,
    children,
    component,
    data,
    defaultValue,
    format,
    initialValue,
    isEqual,
    multiple,
    parse,
    subscription,
    type,
    validate,
    validateFields,
    value
  });

  if (typeof children === "function") {
    return children({ ...field, ...rest }) as JSX.Element;
  }

  if (typeof component === "string") {
    // ignore meta, combine input with any other props
    // eslint-disable-next-line react/no-children-prop
    return React.createElement(component, {
      ...field.input,
      children,
      ref,
      ...rest
    });
  }

  if (component) {
    return React.createElement(component, { ref, ...rest, ...field });
  }
  if (typeof render !== "function") {
    throw new Error(
      `Must specify either a render prop, a render function as children, or a component prop to GracefulField(${name})`
    );
  }
  return render(
    children === undefined
      ? { ref, ...rest, ...field }
      : { ref, ...rest, ...field, children }
  ) as JSX.Element;
}

type GF<
  FieldValue = any,
  T extends HTMLElement = HTMLElement,
  InputValue = FieldValue,
  RP extends FieldRenderProps<FieldValue, T, InputValue> = FieldRenderProps<
    FieldValue,
    T,
    InputValue
  >
> = React.FC<GracefulFieldProps<FieldValue>>;

export const GracefulField = React.forwardRef(InnerGracefulField);
