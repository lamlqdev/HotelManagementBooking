# React Hook Form & Zod Guide - Hotel Booking Management Project

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. Installation & Setup](#2-installation--setup)
- [3. Creating Zod Schemas](#3-creating-zod-schemas)
- [4. Basic Form Setup](#4-basic-form-setup)
- [5. Form Components](#5-form-components)
- [6. Advanced Validation](#6-advanced-validation)
- [7. Common Patterns in This Project](#7-common-patterns-in-this-project)

---

## 1. Introduction

### What is React Hook Form?

React Hook Form is a performant, flexible, and extensible form library for React. It uses uncontrolled components and refs to minimize re-renders and improve performance.

### What is Zod?

Zod is a TypeScript-first schema validation library. It provides a simple and powerful way to validate data with excellent TypeScript inference.

### Why Use React Hook Form with Zod?

- **Performance**: Minimal re-renders with uncontrolled components
- **Type Safety**: Full TypeScript support with Zod schema inference
- **Validation**: Powerful validation with Zod's schema system
- **Developer Experience**: Less boilerplate, more intuitive API
- **Error Handling**: Built-in error management and display
- **Integration**: Works seamlessly with UI libraries (Shadcn/ui, etc.)

### Versions Used

This project uses:

- **react-hook-form v7.54.2**
- **@hookform/resolvers v4.1.3**
- **zod v3.24.2**

---

## 2. Installation & Setup

### Step 1: Install Packages

```bash
npm install react-hook-form @hookform/resolvers zod
```

### Step 2: Import Required Modules

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
```

---

## 3. Creating Zod Schemas

### Basic Schema

Create a Zod schema to define your form's validation rules.

**File: `api/auth/types.ts`**

```tsx
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

**Key Concepts:**

- `z.object()`: Creates an object schema
- `z.string()`: String validation
- `z.email()`: Email format validation
- `z.min()`: Minimum length/value
- `z.infer<>`: Infers TypeScript type from schema

### Advanced Schema with Refinement

Use `.refine()` for custom validation logic.

**File: `api/auth/types.ts`**

```tsx
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .max(100, "Email must be less than 100 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Error appears on confirmPassword field
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
```

**Schema Features:**

- **Nested validation**: Validate object properties
- **Custom messages**: Provide error messages for each rule
- **Refinement**: Cross-field validation with `.refine()`
- **Type inference**: Automatically generate TypeScript types

### Complex Schema Example

**File: `api/room/types.ts`**

```tsx
export const createRoomSchema = z.object({
  hotelId: z.string().min(1, "Please select a hotel"),
  name: z.string().min(1, "Please enter room name"),
  description: z.string().min(1, "Please enter room description"),
  floor: z
    .number()
    .min(1, "Please enter floor number")
    .max(100, "Invalid floor number"),
  roomType: z.enum(["Standard", "Superior", "Deluxe", "Suite", "Family"], {
    required_error: "Please select room type",
  }),
  bedType: z.enum(["Single", "Twin", "Double", "Queen", "King"], {
    required_error: "Please select bed type",
  }),
  price: z.number().min(0, "Price cannot be negative"),
  capacity: z
    .number()
    .min(1, "Please enter maximum capacity")
    .max(10, "Invalid capacity"),
  squareMeters: z
    .number()
    .min(1, "Please enter room area")
    .max(1000, "Invalid room area"),
  amenities: z.array(z.string()).min(2, "Please select at least 2 amenities"),
  images: z
    .array(z.instanceof(File))
    .min(1, "Please select at least one image"),
  cancellationPolicy: z.enum(["flexible", "moderate", "strict"], {
    required_error: "Please select cancellation policy",
  }),
  status: z
    .enum(["available", "booked", "maintenance"])
    .optional()
    .default("available"),
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
```

**Advanced Zod Features:**

- `z.enum()`: Restrict to specific values
- `z.array()`: Array validation
- `z.instanceof()`: Type checking (e.g., File)
- `z.coerce.number()`: Coerce string to number
- `z.optional()`: Optional fields
- `z.default()`: Default values

---

## 4. Basic Form Setup

### useForm Hook

Initialize the form with `useForm` and connect it to your Zod schema.

**Basic Example:**

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/api/auth/types";

const LoginPage = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data); // Validated form data
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>{/* form fields */}</form>
  );
};
```

**useForm Options:**

- `resolver`: Validation resolver (zodResolver for Zod)
- `defaultValues`: Initial form values
- `mode`: When validation runs (`onSubmit`, `onChange`, `onBlur`, etc.)
- `reValidateMode`: When to re-validate after error

### Real Example: Login Form

**File: `pages/auth/LoginPage.tsx`**

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/api/auth/types";

const LoginPage = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
    resetOptions: {
      keepValues: true,
      keepErrors: true,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    // Handle form submission
    loginMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{/* form fields */}</form>
    </Form>
  );
};
```

### Form Methods

Access form methods and state:

```tsx
const form = useForm<FormData>({ ... });

// Form state
form.formState.isValid;      // Is form valid?
form.formState.isDirty;      // Has form been modified?
form.formState.errors;       // Form errors object
form.formState.isSubmitting; // Is form submitting?

// Form methods
form.handleSubmit(onSubmit); // Submit handler
form.reset();                 // Reset form
form.setValue("field", value); // Set field value programmatically
form.getValues();            // Get all form values
form.watch("field");         // Watch field changes
```

---

## 5. Form Components

### FormField Component

Use `FormField` to connect form fields to React Hook Form.

**Basic Example:**

```tsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} type="email" placeholder="Enter email" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>;
```

**FormField Props:**

- `control`: Form control from `form.control`
- `name`: Field name (must match schema)
- `render`: Render function with field props

**Field Props:**

- `field.value`: Current field value
- `field.onChange`: Change handler
- `field.onBlur`: Blur handler
- `field.ref`: Input ref

### Real Example: Register Form

**File: `pages/auth/RegisterPage.tsx`**

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Full Name</FormLabel>
          <FormControl>
            <Input {...field} type="text" placeholder="Enter full name" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} type="email" placeholder="Enter email" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="agreeToTerms"
      render={({ field }) => (
        <FormItem className="flex items-center space-x-2">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel>I agree to the terms</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />

    <Button type="submit" disabled={form.formState.isSubmitting}>
      Register
    </Button>
  </form>
</Form>
```

### Different Input Types

**Text Input:**

```tsx
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Name</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Select:**

```tsx
<FormField
  control={form.control}
  name="roomType"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Room Type</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="Standard">Standard</SelectItem>
          <SelectItem value="Deluxe">Deluxe</SelectItem>
          <SelectItem value="Suite">Suite</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Checkbox:**

```tsx
<FormField
  control={form.control}
  name="agreeToTerms"
  render={({ field }) => (
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <FormLabel>I agree</FormLabel>
      <FormMessage />
    </FormItem>
  )}
/>
```

**File Input:**

```tsx
<FormField
  control={form.control}
  name="images"
  render={({ field: { value, onChange, ...field } }) => (
    <FormItem>
      <FormLabel>Images</FormLabel>
      <FormControl>
        <Input
          {...field}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            onChange(files);
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## 6. Advanced Validation

### Conditional Validation

Validate fields based on other field values:

```tsx
const schema = z
  .object({
    hasDiscount: z.boolean(),
    discountCode: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.hasDiscount) {
        return data.discountCode && data.discountCode.length > 0;
      }
      return true;
    },
    {
      message: "Discount code is required when discount is enabled",
      path: ["discountCode"],
    }
  );
```

### Custom Validation Functions

```tsx
const schema = z.object({
  email: z
    .string()
    .email()
    .refine(
      async (email) => {
        // Check if email exists
        const exists = await checkEmailExists(email);
        return !exists;
      },
      {
        message: "Email already exists",
      }
    ),
});
```

### Array Validation

```tsx
const schema = z.object({
  amenities: z
    .array(z.string())
    .min(2, "Select at least 2 amenities")
    .max(10, "Select at most 10 amenities"),
});
```

### Number Coercion

```tsx
const schema = z.object({
  price: z.coerce
    .number()
    .min(0, "Price must be positive")
    .max(10000, "Price too high"),
  quantity: z.coerce.number().int().positive(),
});
```

### Date Validation

```tsx
const schema = z
  .object({
    checkIn: z.string().refine(
      (date) => {
        const checkInDate = new Date(date);
        const today = new Date();
        return checkInDate >= today;
      },
      {
        message: "Check-in date must be today or later",
      }
    ),
    checkOut: z.string(),
  })
  .refine(
    (data) => {
      const checkIn = new Date(data.checkIn);
      const checkOut = new Date(data.checkOut);
      return checkOut > checkIn;
    },
    {
      message: "Check-out must be after check-in",
      path: ["checkOut"],
    }
  );
```

---

## 7. Common Patterns in This Project

### Pattern 1: Form with Mutation

```tsx
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    /* ... */
  },
});

const mutation = useMutation({
  mutationFn: api.submitForm,
  onSuccess: () => {
    toast.success("Success!");
    form.reset();
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

const onSubmit = (data: FormData) => {
  mutation.mutate(data);
};

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>
  </Form>
);
```

### Pattern 2: Form with Default Values from API

```tsx
const { data: user } = useQuery({
  queryKey: ["user"],
  queryFn: () => userApi.getMe(),
});

const form = useForm<UpdateProfileData>({
  resolver: zodResolver(updateProfileSchema),
  defaultValues: {
    name: user?.name || "",
    phone: user?.phone || "",
  },
});

// Update form when user data loads
useEffect(() => {
  if (user) {
    form.reset({
      name: user.name,
      phone: user.phone,
    });
  }
}, [user, form]);
```

### Pattern 3: Multiple Forms on Same Page

```tsx
const contactForm = useForm<ContactFormData>({
  resolver: zodResolver(contactFormSchema),
  defaultValues: {
    /* ... */
  },
});

const specialRequestsForm = useForm<SpecialRequestsData>({
  resolver: zodResolver(specialRequestsSchema),
  defaultValues: {
    /* ... */
  },
});

const handleContactSubmit = (data: ContactFormData) => {
  // Handle contact form
};

const handleRequestsSubmit = (data: SpecialRequestsData) => {
  // Handle special requests form
};
```

### Pattern 4: Form with File Upload

```tsx
const schema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, "Please select at least one image"),
});

const form = useForm<FormData>({
  resolver: zodResolver(schema),
});

<FormField
  control={form.control}
  name="images"
  render={({ field: { value, onChange, ...field } }) => (
    <FormItem>
      <FormLabel>Images</FormLabel>
      <FormControl>
        <Input
          {...field}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            onChange(files);
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>;
```

### Pattern 5: Form Validation Modes

```tsx
// Validate on submit only
const form = useForm({
  resolver: zodResolver(schema),
  mode: "onSubmit",
});

// Validate on change
const form = useForm({
  resolver: zodResolver(schema),
  mode: "onChange",
});

// Validate on blur
const form = useForm({
  resolver: zodResolver(schema),
  mode: "onBlur",
});
```

---

## Troubleshooting

### Validation Not Working

**Problem**: Form submits even with invalid data

**Solutions**:

- ✅ Check `resolver: zodResolver(schema)` is set
- ✅ Verify schema matches form field names
- ✅ Ensure `FormField` name matches schema property
- ✅ Check `mode` option is set correctly

### Type Errors

**Problem**: TypeScript errors with form data

**Solutions**:

- ✅ Use `z.infer<typeof schema>` for form data type
- ✅ Ensure schema and form type match
- ✅ Check field names match between schema and form

### Errors Not Displaying

**Problem**: Validation errors don't show

**Solutions**:

- ✅ Include `<FormMessage />` in FormField
- ✅ Check error messages in schema
- ✅ Verify `Form` component wraps form
- ✅ Check `control={form.control}` is passed to FormField

### Default Values Not Working

**Problem**: Default values don't appear

**Solutions**:

- ✅ Set `defaultValues` in `useForm`
- ✅ Use `form.reset()` to update values
- ✅ Check values match schema types
- ✅ Ensure values are set before form renders

---

## Summary

React Hook Form with Zod provides a powerful, type-safe form solution. Key takeaways:

1. **Zod Schemas** define validation rules and TypeScript types
2. **useForm** initializes form with zodResolver
3. **FormField** connects inputs to form state
4. **FormMessage** displays validation errors
5. **Type Safety** with `z.infer<typeof schema>`

### Common Hooks

#### useForm

Initialize form with validation.

```tsx
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    /* ... */
  },
});
```

#### Form Components

```tsx
<Form {...form}>
  <FormField
    control={form.control}
    name="fieldName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

### Common Patterns

#### Creating a Schema

```tsx
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Too short"),
});

type FormData = z.infer<typeof schema>;
```

#### Form Submission

```tsx
const onSubmit = (data: FormData) => {
  // Handle submission
};

<form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>;
```

This project demonstrates a production-ready form setup with React Hook Form and Zod, providing excellent type safety, validation, and developer experience.

---

## Additional Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- [Hookform Resolvers](https://github.com/react-hook-form/resolvers)
- [Shadcn/ui Form Components](https://ui.shadcn.com/docs/components/form)
