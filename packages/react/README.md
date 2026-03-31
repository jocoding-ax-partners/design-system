# @demodev-ui/react

CSS-only design system built on [HeroUI v3](https://v3.heroui.com). Provides custom themes, design tokens, and component styles.

**All React components come from `@heroui/react`.** This package only provides style overrides via a single CSS import.

## Installation

```bash
npm install @demodev-ui/react @heroui/react@3.0.1 @heroui/styles@3.0.1 tailwindcss@^4 @tailwindcss/vite
```

### Claude Code Setup (recommended)

Install packages and set up AI context in one command:

```bash
npm install @demodev-ui/react @heroui/react@3.0.1 @heroui/styles@3.0.1 tailwindcss@^4 @tailwindcss/vite && echo -e '\n## @demodev-ui/react\nThis project uses @demodev-ui/react (CSS-only design system on HeroUI v3).\nAll components are imported from `@heroui/react`, NOT from `@demodev-ui/react`.\nFor full component API and usage examples, read `node_modules/@demodev-ui/react/llms.txt`.' >> CLAUDE.md
```

This appends a reference to `CLAUDE.md` so Claude Code automatically loads the component docs when you ask about UI implementation.

## Setup

### CSS (import order matters)

```css
@import "tailwindcss";
@import "@heroui/styles";
@import "@demodev-ui/react/styles";

@source "../node_modules/@heroui/react/dist";
```

### Vite Config

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
});
```

### App Root (Toast provider)

```tsx
import { Toast } from "@heroui/react";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* your app */}
      <Toast.Provider />
    </div>
  );
}
```

---

## Critical Rules

### 1. Import source

```tsx
// CORRECT
import { Button, Input, Modal } from "@heroui/react";

// WRONG — this package has no component exports
import { Button } from "@demodev-ui/react"; // does not exist
```

### 2. Collection components must be inside their parent

These crash at runtime if rendered outside their collection context:

| Component | Must be inside |
|-----------|---------------|
| `ListBox.Item` | `<ListBox>` |
| `Tag` | `<TagGroup.List>` |
| `Dropdown.Item` | `<Dropdown.Menu>` |
| `Tabs.Tab` | `<Tabs.List>` |

### 3. Trigger button nesting

Some Trigger components render their own `<button>`. Putting `<Button>` inside them creates invalid HTML (`<button>` inside `<button>`):

| Trigger | Renders as | Can contain `<Button>`? |
|---------|-----------|----------------------|
| `Modal.Trigger` | `<div>` | YES |
| `AlertDialog.Trigger` | `<div>` | YES |
| `Dropdown.Trigger` | `<div>` | YES |
| `Tooltip.Trigger` | `<button>` | NO — use `<span>` as child |
| `ComboBox.Trigger` | `<button>` | NO |

### 4. Button color via data attribute

`Button` does not have a `color` prop. Use `data-color` for outline/ghost color variants:

```tsx
<Button variant="outline" data-color="accent">Accent</Button>
<Button variant="ghost" data-color="danger">Danger</Button>
// Available: "accent" | "danger" | "success" | "warning"
```

---

## Design Tokens

### Colors

```css
/* Gray (oklch) */
--color-gray-50 ~ --color-gray-950  /* 11-step neutral scale */

/* Semantic */
--danger:  #ef1026;
--success: #27c961;
--warning: #ffdc18;
```

### Border Radius

```css
--radius-button-xs: var(--radius-md)
--radius-button-sm: var(--radius-lg)
--radius-button-md: 0.625rem   /* 10px */
--radius-button-lg: var(--radius-xl)
--radius-chip-sm:   var(--radius-md)
--radius-chip-md:   var(--radius-lg)
--radius-input-lg:  var(--radius-button-lg)
--radius-list-box:  var(--radius-xl)
--radius-toast:     var(--radius-2xl)
```

### Spacing (component heights)

```css
--spacing-button-sm: 36px
--spacing-button-md: 40px
--spacing-button-lg: 48px
--spacing-chip-sm:   24px
--spacing-chip-md:   32px
--spacing-chip-lg:   36px
--spacing-input-lg:  48px
```

---

## Component Reference

Every code example below is verified and runs without errors.

### Button

```tsx
import { Button } from "@heroui/react";

// Variants: "primary" | "secondary" | "outline" | "ghost" | "danger" | "danger-soft" | "tertiary"
// Sizes: "sm" | "md" | "lg"
<Button variant="primary" size="md">Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button size="sm" isIconOnly>+</Button>
<Button isDisabled>Disabled</Button>

// Color variants for outline/ghost (use data-color, not color prop)
<Button variant="outline" data-color="accent">Accent</Button>
<Button variant="outline" data-color="danger">Danger</Button>
<Button variant="outline" data-color="success">Success</Button>
<Button variant="outline" data-color="warning">Warning</Button>
```

### ButtonGroup

```tsx
import { Button, ButtonGroup } from "@heroui/react";

// Horizontal (default)
<ButtonGroup>
  <Button>Left</Button>
  <ButtonGroup.Separator />
  <Button>Center</Button>
  <ButtonGroup.Separator />
  <Button>Right</Button>
</ButtonGroup>

// Vertical
<ButtonGroup orientation="vertical">
  <Button>Top</Button>
  <ButtonGroup.Separator />
  <Button>Bottom</Button>
</ButtonGroup>

// Group with size
<ButtonGroup size="sm">
  <Button>A</Button>
  <ButtonGroup.Separator />
  <Button>B</Button>
</ButtonGroup>
```

### Input

```tsx
import { Input } from "@heroui/react";

// Variants: "primary" | "secondary"
<Input placeholder="Primary" variant="primary" />
<Input placeholder="Secondary" variant="secondary" />
<Input placeholder="Disabled" disabled />
```

### TextField

```tsx
import { TextField, Input, Label, Description } from "@heroui/react";

<TextField variant="primary">
  <Label>Email</Label>
  <Input placeholder="you@example.com" />
  <Description>We'll never share your email.</Description>
</TextField>

<TextField variant="primary" isRequired>
  <Label>Password</Label>
  <Input type="password" placeholder="Enter password" />
</TextField>
```

### InputGroup

```tsx
import { InputGroup } from "@heroui/react";

<InputGroup variant="primary">
  <InputGroup.Prefix>https://</InputGroup.Prefix>
  <InputGroup.Input placeholder="example.com" />
</InputGroup>

<InputGroup variant="primary">
  <InputGroup.Input placeholder="Amount" />
  <InputGroup.Suffix>USD</InputGroup.Suffix>
</InputGroup>
```

### TextArea

```tsx
import { TextField, TextArea, Label } from "@heroui/react";

<TextField variant="primary">
  <Label>Message</Label>
  <TextArea placeholder="Type your message..." />
</TextField>
```

### NumberField

```tsx
import { NumberField, Label } from "@heroui/react";

<NumberField variant="primary" defaultValue={5} minValue={0} maxValue={100}>
  <Label>Quantity</Label>
  <NumberField.Group>
    <NumberField.DecrementButton>-</NumberField.DecrementButton>
    <NumberField.Input />
    <NumberField.IncrementButton>+</NumberField.IncrementButton>
  </NumberField.Group>
</NumberField>
```

### SearchField

```tsx
import { SearchField, Label } from "@heroui/react";

<SearchField variant="primary">
  <Label>Search</Label>
  <SearchField.Group>
    <SearchField.SearchIcon />
    <SearchField.Input placeholder="Search..." />
    <SearchField.ClearButton />
  </SearchField.Group>
</SearchField>
```

### ComboBox

```tsx
import { ComboBox, Input, Label, ListBox } from "@heroui/react";

<ComboBox variant="primary">
  <Label>Fruit</Label>
  <ComboBox.InputGroup>
    <Input placeholder="Select a fruit..." />
    <ComboBox.Trigger />
  </ComboBox.InputGroup>
  <ComboBox.Popover>
    <ListBox>
      <ListBox.Item id="apple" textValue="Apple">
        Apple
        <ListBox.ItemIndicator />
      </ListBox.Item>
      <ListBox.Item id="banana" textValue="Banana">
        Banana
        <ListBox.ItemIndicator />
      </ListBox.Item>
    </ListBox>
  </ComboBox.Popover>
</ComboBox>
```

### Select

```tsx
import { Select, Label, ListBox } from "@heroui/react";

// Variants: "primary" | "secondary"
<Select variant="primary">
  <Label>Country</Label>
  <Select.Trigger>
    <Select.Value>Select a country</Select.Value>
    <Select.Indicator />
  </Select.Trigger>
  <Select.Popover>
    <ListBox>
      <ListBox.Item id="kr" textValue="South Korea">
        South Korea
        <ListBox.ItemIndicator />
      </ListBox.Item>
      <ListBox.Item id="us" textValue="United States">
        United States
        <ListBox.ItemIndicator />
      </ListBox.Item>
    </ListBox>
  </Select.Popover>
</Select>
```

### Checkbox

```tsx
import { Checkbox, Label, Description } from "@heroui/react";

// Variants: "primary" | "secondary"
<Checkbox variant="primary" id="terms">
  <Checkbox.Control />
  <Checkbox.Content>
    <Label>Accept terms</Label>
    <Description>You agree to the terms of service</Description>
  </Checkbox.Content>
</Checkbox>

<Checkbox variant="primary" id="newsletter" defaultSelected>
  <Checkbox.Control />
  <Checkbox.Content>
    <Label>Newsletter</Label>
  </Checkbox.Content>
</Checkbox>

<Checkbox variant="primary" id="disabled" isDisabled>
  <Checkbox.Control />
  <Checkbox.Content>
    <Label>Disabled</Label>
  </Checkbox.Content>
</Checkbox>
```

### RadioGroup

```tsx
import { RadioGroup, Radio, Label, Description } from "@heroui/react";

<RadioGroup variant="primary" defaultValue="option1">
  <Label>Select an option</Label>
  <Radio value="option1">
    <Radio.Control>
      <Radio.Indicator />
    </Radio.Control>
    <Radio.Content>
      <Label>Option 1</Label>
      <Description>First choice</Description>
    </Radio.Content>
  </Radio>
  <Radio value="option2">
    <Radio.Control>
      <Radio.Indicator />
    </Radio.Control>
    <Radio.Content>
      <Label>Option 2</Label>
    </Radio.Content>
  </Radio>
  <Radio value="option3" isDisabled>
    <Radio.Control>
      <Radio.Indicator />
    </Radio.Control>
    <Radio.Content>
      <Label>Option 3 (Disabled)</Label>
    </Radio.Content>
  </Radio>
</RadioGroup>
```

### ToggleButton

```tsx
import { ToggleButton } from "@heroui/react";

// Variants: "default" | "ghost"
// Sizes: "sm" | "md" | "lg"
<ToggleButton size="md" variant="default">Toggle</ToggleButton>
<ToggleButton size="sm" variant="ghost">Ghost</ToggleButton>
```

### ToggleButtonGroup

```tsx
import { ToggleButton, ToggleButtonGroup } from "@heroui/react";

// Single selection
<ToggleButtonGroup selectionMode="single" defaultSelectedKeys={["bold"]}>
  <ToggleButton id="bold">B</ToggleButton>
  <ToggleButton id="italic">I</ToggleButton>
  <ToggleButton id="underline">U</ToggleButton>
</ToggleButtonGroup>

// Multiple selection, detached style
<ToggleButtonGroup selectionMode="multiple" isDetached>
  <ToggleButton id="a">A</ToggleButton>
  <ToggleButton id="b">B</ToggleButton>
  <ToggleButton id="c">C</ToggleButton>
</ToggleButtonGroup>
```

### Tag + TagGroup

Tag MUST be inside `TagGroup.List`:

```tsx
import { Tag, TagGroup, Label } from "@heroui/react";

// Sizes: "sm" | "md" | "lg"
// Variants: "default" | "surface"
<TagGroup selectionMode="multiple">
  <Label>Select tags</Label>
  <TagGroup.List>
    <Tag id="tag1" size="sm">Small</Tag>
    <Tag id="tag2" size="md">Medium</Tag>
    <Tag id="tag3" size="lg">Large</Tag>
  </TagGroup.List>
</TagGroup>

// Removable
<TagGroup onRemove={(keys) => console.log(keys)}>
  <Label>Removable tags</Label>
  <TagGroup.List>
    <Tag id="r1">
      Tag 1
      <Tag.RemoveButton />
    </Tag>
    <Tag id="r2">
      Tag 2
      <Tag.RemoveButton />
    </Tag>
  </TagGroup.List>
</TagGroup>
```

### Chip

```tsx
import { Chip } from "@heroui/react";

// Variants: "primary" | "secondary" | "tertiary"
// Sizes: "sm" | "md" | "lg"
// Colors: "accent" | "success" | "warning" | "danger"
<Chip size="md" variant="primary" color="accent"><Chip.Label>Accent</Chip.Label></Chip>
<Chip variant="secondary" color="success"><Chip.Label>Success</Chip.Label></Chip>
<Chip variant="tertiary" color="warning"><Chip.Label>Warning</Chip.Label></Chip>
```

### Modal

`Modal.Trigger` renders `<div>`, so `<Button>` inside is safe.

```tsx
import { Modal, Button } from "@heroui/react";

// Container sizes: "sm" | "md" | "lg"
<Modal>
  <Modal.Trigger>
    <Button variant="outline">Open Modal</Button>
  </Modal.Trigger>
  <Modal.Backdrop />
  <Modal.Container size="md">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Heading>Title</Modal.Heading>
        <Modal.CloseTrigger />
      </Modal.Header>
      <Modal.Body>
        <p>Modal content here.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="ghost">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </Modal.Footer>
    </Modal.Dialog>
  </Modal.Container>
</Modal>
```

### AlertDialog

`AlertDialog.Trigger` renders `<div>`, so `<Button>` inside is safe.

```tsx
import { AlertDialog, Button } from "@heroui/react";

// AlertDialog.Icon status: "danger" | "success" | "warning"
<AlertDialog>
  <AlertDialog.Trigger>
    <Button variant="danger">Delete</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Backdrop />
  <AlertDialog.Container size="sm">
    <AlertDialog.Dialog>
      <AlertDialog.Header>
        <AlertDialog.Icon status="danger" />
        <AlertDialog.Heading>Delete Item?</AlertDialog.Heading>
      </AlertDialog.Header>
      <AlertDialog.Body>
        This action cannot be undone. Are you sure?
      </AlertDialog.Body>
      <AlertDialog.Footer>
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </AlertDialog.Footer>
    </AlertDialog.Dialog>
  </AlertDialog.Container>
</AlertDialog>
```

### Dropdown

`Dropdown.Trigger` renders `<div>`, so `<Button>` inside is safe.

```tsx
import { Dropdown, Button } from "@heroui/react";

<Dropdown>
  <Dropdown.Trigger>
    <Button variant="outline">Open Menu</Button>
  </Dropdown.Trigger>
  <Dropdown.Popover>
    <Dropdown.Menu onAction={(key) => console.log(key)}>
      <Dropdown.Item id="edit">Edit</Dropdown.Item>
      <Dropdown.Item id="duplicate">Duplicate</Dropdown.Item>
      <Dropdown.Item id="delete">Delete</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown.Popover>
</Dropdown>
```

### Tooltip

`Tooltip.Trigger` IS a `<button>` — use `<span>` as child, not `<Button>`.

```tsx
import { Tooltip } from "@heroui/react";

<Tooltip>
  <Tooltip.Trigger>
    <span className="inline-block cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm">
      Hover me
    </span>
  </Tooltip.Trigger>
  <Tooltip.Content>Tooltip text</Tooltip.Content>
</Tooltip>

// With arrow
<Tooltip>
  <Tooltip.Trigger>
    <span>Hover</span>
  </Tooltip.Trigger>
  <Tooltip.Content showArrow>With arrow</Tooltip.Content>
</Tooltip>
```

### Toast

Add `<Toast.Provider />` once at app root, then trigger from anywhere:

```tsx
import { Toast, Button } from "@heroui/react";

// In your app root: <Toast.Provider />

// Trigger toasts:
<Button onPress={() => Toast.toast("Default message")}>Toast</Button>
<Button onPress={() => Toast.toast.success("Done!")}>Success</Button>
<Button onPress={() => Toast.toast.danger("Error!")}>Danger</Button>
<Button onPress={() => Toast.toast.warning("Warning!")}>Warning</Button>
```

### Tabs

```tsx
import { Tabs } from "@heroui/react";

<Tabs variant="primary">
  <Tabs.List>
    <Tabs.Tab id="tab1">General</Tabs.Tab>
    <Tabs.Tab id="tab2">Settings</Tabs.Tab>
    <Tabs.Tab id="tab3">Profile</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="tab1">
    <div className="p-4 border border-gray-200 rounded-lg mt-2">
      General content
    </div>
  </Tabs.Panel>
  <Tabs.Panel id="tab2">
    <div className="p-4 border border-gray-200 rounded-lg mt-2">
      Settings content
    </div>
  </Tabs.Panel>
  <Tabs.Panel id="tab3">
    <div className="p-4 border border-gray-200 rounded-lg mt-2">
      Profile content
    </div>
  </Tabs.Panel>
</Tabs>
```

### Pagination

```tsx
import { Pagination } from "@heroui/react";

// Sizes: "sm" | "md" | "lg"
<Pagination size="md">
  <Pagination.Content>
    <Pagination.Item>
      <Pagination.Previous>
        <Pagination.PreviousIcon />
      </Pagination.Previous>
    </Pagination.Item>
    <Pagination.Item>
      <Pagination.Link isActive>1</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
      <Pagination.Link>2</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
      <Pagination.Ellipsis />
    </Pagination.Item>
    <Pagination.Item>
      <Pagination.Link>10</Pagination.Link>
    </Pagination.Item>
    <Pagination.Item>
      <Pagination.Next>
        <Pagination.NextIcon />
      </Pagination.Next>
    </Pagination.Item>
  </Pagination.Content>
</Pagination>
```

### Slider

```tsx
import { Slider, Label } from "@heroui/react";

// Single value
<Slider defaultValue={50} minValue={0} maxValue={100}>
  <div className="flex justify-between">
    <Label>Volume</Label>
    <Slider.Output />
  </div>
  <Slider.Track>
    <Slider.Fill />
    <Slider.Thumb />
  </Slider.Track>
</Slider>

// Range (two thumbs)
<Slider defaultValue={[20, 80]} minValue={0} maxValue={100}>
  <div className="flex justify-between">
    <Label>Range</Label>
    <Slider.Output />
  </div>
  <Slider.Track>
    <Slider.Fill />
    <Slider.Thumb />
    <Slider.Thumb />
  </Slider.Track>
</Slider>
```

### Alert

```tsx
import { Alert, Button } from "@heroui/react";

// Status: "default" | "accent" | "success" | "warning" | "danger"
<Alert status="success">
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Success</Alert.Title>
    <Alert.Description>Your action completed.</Alert.Description>
  </Alert.Content>
</Alert>

// With action button
<Alert status="warning">
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Warning</Alert.Title>
    <Alert.Description>Please review.</Alert.Description>
  </Alert.Content>
  <Button size="sm" variant="outline">Action</Button>
</Alert>
```

### CloseButton

```tsx
import { CloseButton } from "@heroui/react";

<CloseButton variant="default" onPress={() => {}} />
```

---

## Full App Example

```tsx
import { Toast } from "@heroui/react";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="mx-auto max-w-3xl space-y-12">
        {/* your components here */}
      </div>
      <Toast.Provider />
    </div>
  );
}
```

## License

MIT
