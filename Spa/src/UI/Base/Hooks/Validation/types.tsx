import { ObjectSchema, Shape } from "yup";

export declare type SubmitValidationType = {
  submit: string
}

export declare type SubmitInputTouchedType = {
  submit: boolean
}

export declare type DomainValidationType<D extends object> = {
  [P in keyof D]: string
} 

export declare type DomainInputTouchedType<D extends object> = {
  [P in keyof D]: boolean
} 

export declare type ValidationType<D extends object> = DomainValidationType<D> & SubmitValidationType

export declare type InputTouchedType<D extends object> = DomainInputTouchedType<D> & SubmitInputTouchedType

export declare type UseValidationStatusInputType<D extends object> = {
  schema: ObjectSchema<Shape<object, D>> 
  domain: D
}

export declare type UseValidationStatusOutputType<D extends object> = {
  currentValidationError: ValidationType<D> 
  touch: (name: keyof D | keyof SubmitInputTouchedType) => void,
  validate: () => Promise<void>
}
