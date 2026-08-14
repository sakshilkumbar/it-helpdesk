import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, g as cn, w as Slot, x as Primitive, y as createContextScope, o as useNavigate, z as useCreateTicket, A as useCategories, q as usePriorities, B as Button, F as Badge, X, S as Separator } from "./index-y0UiSxHL.js";
import { F as FormProvider, C as Controller, L as Label, u as useFormContext, a as useFormState, b as useForm } from "./label-my991swb.js";
import { u as ue } from "./index-CICSQFzn.js";
import { P as PageHeader } from "./PageHeader-BOIic8f2.js";
import "./StatusBadge-C3JOGEpV.js";
import { I as Input } from "./input-BB_cSxD4.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BrG4Wbfu.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CardFooter } from "./card-xP9BGQcP.js";
import { T as Textarea } from "./textarea-34Xy4SLJ.js";
import { F as FileText } from "./file-text-XGrUmBPS.js";
import { C as CircleCheck } from "./circle-check-_t8Qr5P9.js";
import { C as CircleAlert } from "./circle-alert-C3atrgbq.js";
import { L as LoaderCircle } from "./loader-circle-B34IBkrX.js";
import { S as Sparkles } from "./sparkles-DBjc9UT4.js";
import "./index-BDSHvDZP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
const Form = FormProvider;
const FormFieldContext = reactExports.createContext(
  {}
);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = reactExports.useContext(FormFieldContext);
  const itemContext = reactExports.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = reactExports.createContext(
  {}
);
function FormItem({ className, ...props }) {
  const id = reactExports.useId();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "form-item",
      className: cn("grid gap-2", className),
      ...props
    }
  ) });
}
function FormLabel({
  className,
  ...props
}) {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Label,
    {
      "data-slot": "form-label",
      "data-error": !!error,
      className: cn("data-[error=true]:text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
}
function FormControl({ ...props }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Slot,
    {
      "data-slot": "form-control",
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
}
function FormDescription({ className, ...props }) {
  const { formDescriptionId } = useFormField();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "p",
    {
      "data-slot": "form-description",
      id: formDescriptionId,
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function FormMessage({ className, ...props }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String((error == null ? void 0 : error.message) ?? "") : props.children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "p",
    {
      "data-slot": "form-message",
      id: formMessageId,
      className: cn("text-destructive text-sm", className),
      ...props,
      children: body
    }
  );
}
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "progress-indicator",
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
function CreateTicket() {
  const navigate = useNavigate();
  const createTicket = useCreateTicket();
  const fileInputRef = reactExports.useRef(null);
  const { data: categoriesData, isLoading: catLoading } = useCategories();
  const { data: prioritiesData, isLoading: priLoading } = usePriorities();
  const categories = categoriesData ?? [];
  const priorities = prioritiesData ?? [];
  const [attachments, setAttachments] = reactExports.useState([]);
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      priorityId: ""
    }
  });
  const uploadOne = reactExports.useCallback(async (file) => {
    setAttachments((prev) => [
      ...prev,
      { file, progress: 0, status: "uploading" }
    ]);
    const interval = setInterval(() => {
      setAttachments(
        (prev) => prev.map(
          (a) => a.file === file ? { ...a, progress: Math.min(100, a.progress + Math.random() * 25) } : a
        )
      );
    }, 200);
    setTimeout(() => {
      clearInterval(interval);
      setAttachments(
        (prev) => prev.map(
          (a) => a.file === file ? { ...a, status: "done", progress: 100 } : a
        )
      );
    }, 1200);
  }, []);
  const handleFileSelect = reactExports.useCallback(
    (e) => {
      const files = Array.from(e.target.files ?? []);
      files.forEach(uploadOne);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [uploadOne]
  );
  const removeAttachment = reactExports.useCallback((file) => {
    setAttachments((prev) => prev.filter((a) => a.file !== file));
  }, []);
  const onSubmit = async (values) => {
    const pendingUploads = attachments.filter((a) => a.status === "uploading");
    if (pendingUploads.length > 0) {
      ue.warning("Please wait for file uploads to finish", {
        description: `${pendingUploads.length} file(s) still uploading.`
      });
      return;
    }
    try {
      const result = await createTicket.mutateAsync({
        title: values.title,
        description: values.description,
        categoryId: BigInt(values.categoryId),
        priorityId: BigInt(values.priorityId),
        attachments: []
      });
      ue.success("Ticket created", {
        description: "Your support request has been submitted."
      });
      const newId = result == null ? void 0 : result.id;
      if (newId !== void 0) {
        navigate({
          to: "/employee/tickets/$id",
          params: { id: String(newId) }
        });
      } else {
        navigate({ to: "/employee/tickets" });
      }
    } catch (err) {
      ue.error("Failed to create ticket", {
        description: (err == null ? void 0 : err.message) ?? "Please try again."
      });
    }
  };
  const uploadingCount = attachments.filter(
    (a) => a.status === "uploading"
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Create Ticket",
        description: "Submit a new support request. Provide as much detail as possible to help our agents resolve it quickly."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Ticket details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Required fields are marked with an asterisk." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormField,
              {
                control: form.control,
                name: "title",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Title *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      placeholder: "Briefly summarize the issue",
                      maxLength: 160,
                      ...form.register("title", {
                        required: "Title is required",
                        minLength: {
                          value: 8,
                          message: "Title must be at least 8 characters"
                        },
                        maxLength: {
                          value: 160,
                          message: "Title must be 160 characters or fewer"
                        }
                      })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(FormDescription, { children: [
                    field.value.length,
                    "/160 characters"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FormField,
                {
                  control: form.control,
                  name: "categoryId",
                  render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Category *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: field.value,
                        onValueChange: field.onChange,
                        disabled: catLoading,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a category" }) }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categories.filter((c) => c.isActive).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectItem,
                            {
                              value: String(c.id),
                              children: c.name
                            },
                            String(c.id)
                          )) })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FormField,
                {
                  control: form.control,
                  name: "priorityId",
                  render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Priority *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Select,
                      {
                        value: field.value,
                        onValueChange: field.onChange,
                        disabled: priLoading,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a priority" }) }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: priorities.filter((p) => p.isActive).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                            SelectItem,
                            {
                              value: String(p.id),
                              children: p.name
                            },
                            String(p.id)
                          )) })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                  ] })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormField,
              {
                control: form.control,
                name: "description",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Description *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      placeholder: "Describe the issue, including steps to reproduce, expected behavior, and actual behavior.",
                      className: "min-h-[180px] resize-y",
                      maxLength: 8e3,
                      ...form.register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 20,
                          message: "Description must be at least 20 characters"
                        },
                        maxLength: {
                          value: 8e3,
                          message: "Description must be 8000 characters or fewer"
                        }
                      })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(FormDescription, { children: [
                    field.value.length,
                    "/8000 characters"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                ] })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Attachments" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Optionally attach screenshots or files to help us understand the issue." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/30",
                onDragOver: (e) => e.preventDefault(),
                onDrop: (e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files ?? []);
                  files.forEach(uploadOne);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Upload,
                    {
                      className: "h-8 w-8 text-muted-foreground",
                      "aria-hidden": true
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Drag and drop files here, or" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      size: "sm",
                      onClick: () => {
                        var _a;
                        return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
                        "Choose files"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: fileInputRef,
                      type: "file",
                      multiple: true,
                      className: "hidden",
                      onChange: handleFileSelect,
                      accept: "image/*,.pdf,.doc,.docx,.txt,.zip"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Images, PDFs, documents, and archives up to platform limits." })
                ]
              }
            ),
            attachments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: attachments.map((a, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-center gap-3 rounded-md border p-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm font-medium", children: a.file.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        a.status === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                          "Uploaded"
                        ] }),
                        a.status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Badge,
                          {
                            variant: "destructive",
                            className: "gap-1",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
                              "Failed"
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            type: "button",
                            variant: "ghost",
                            size: "icon",
                            className: "h-7 w-7",
                            onClick: () => removeAttachment(a.file),
                            "aria-label": `Remove ${a.file.name}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        (a.file.size / 1024).toFixed(1),
                        " KB"
                      ] }),
                      a.status === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "· uploading… ",
                        Math.round(a.progress),
                        "%"
                      ] }),
                      a.status === "error" && a.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive", children: [
                        "· ",
                        a.error
                      ] })
                    ] }),
                    a.status === "uploading" && /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: a.progress, className: "h-1.5" })
                  ] })
                ]
              },
              `${a.file.name}-${idx}`
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "justify-end border-t bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                onClick: () => navigate({ to: "/employee/dashboard" }),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: createTicket.isPending || uploadingCount > 0,
                children: createTicket.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                  "Submitting…"
                ] }) : "Submit ticket"
              }
            )
          ] }) })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-dashed bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-md bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary", "aria-hidden": true }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "AI suggestions coming soon" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Intelligent assistance is on the way." })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "This section will soon provide intelligent help while you write your ticket:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-medium text-foreground", children: "Duplicate detection" }),
                  " ",
                  "— warnings when a similar ticket already exists, so you can avoid re-submitting."
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-medium text-foreground", children: "Suggested solutions" }),
                  " ",
                  "— relevant knowledge-base articles and fixes surfaced as you describe the issue."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "AI features are disabled in this release." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardFooter, { className: "border-t bg-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: true, className: "w-full", "aria-disabled": true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "mr-2 h-4 w-4" }),
            "AI suggestions (disabled)"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Tips for a great ticket" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Include clear steps to reproduce the issue." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Mention expected vs. actual behavior." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Attach screenshots or logs when possible." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "• Pick the lowest priority that fits — it helps us triage fairly." })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  CreateTicket,
  CreateTicket as default
};
