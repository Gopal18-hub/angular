export class QuestionBase<T> {
  value: T;
  defaultValue: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  type: string;
  options: any;
  upload_path: any;
  minimum: string | number | null;
  maximum: string | number | null;
  properties: any;
  childQuestions: any;
  multiple: boolean;
  conditions: any;
  customPath: any;
  hintText: string;
  replaceValue: string;
  readonly: boolean;
  generateOptions: any;
  step: number;
  elementRef: any;
  customErrorMessage: string;
  placeholder: string;
  pattern: string;

  constructor(
    options: {
      value?: T;
      key?: string;
      title?: string;
      required?: boolean;
      order?: number;
      type?: string;
      options?: any;
      upload_path?: any;
      minimum?: number;
      maximum?: number;
      properties?: any;
      childQuestions?: any;
      defaultValue?: any;
      multiple?: boolean;
      conditions?: any;
      customPath?: any;
      hintText?: string;
      replaceValue?: string;
      readonly?: boolean;
      generateOptions?: any;
      step?: number;
      elementRef?: any;
      customErrorMessage?: string;
      placeholder?: string;
      pattern?: string;
    } = {}
  ) {
    this.value = options.value || options.defaultValue;
    this.defaultValue = options.defaultValue;
    this.key = options.key || "";
    this.label = options.title || "";
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.type = options.type || "";
    this.options = options.options || [];
    this.upload_path = options.upload_path || "/";
    this.properties = options.properties || "";
    this.childQuestions = options.childQuestions || [];
    this.multiple = options.multiple || false;
    this.conditions = options.conditions || [];
    this.customPath = options.customPath || "";
    this.hintText = options.hintText || "";
    this.replaceValue = options.replaceValue || "";
    this.readonly = options.readonly || false;
    this.generateOptions = options.generateOptions || "";
    this.step = options.step || 1;
    this.minimum = options.minimum || "";
    this.maximum = options.maximum || "";
    this.elementRef = options.elementRef || "";
    this.customErrorMessage = options.customErrorMessage || "";
    this.placeholder = options.placeholder || "";
    this.pattern = options.pattern || "";
  }
}
