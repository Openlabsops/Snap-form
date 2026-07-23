"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Reorder, useDragControls } from "motion/react";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Label } from "@repo/ui/components/ui/label";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
} from "@repo/ui/components/ui/select";
import {
  MessageSquare,
  Wrench,
  Type,
  Hash,
  Mail,
  Copy,
  Trash2,
  Send,
  Bot,
  User,
  Upload,
  GripVertical,
  ChevronDown,
  ScrollText,
  ListOrdered,
  MessageCircle,
  Star,
  ChevronUp,
  SquareCheck,
  Plus,
  X,
  CircleDot,
} from "lucide-react";

/* ── Types ───────────────────────────────────────────────────────── */

type FormFieldType =
  | "textInput"
  | "numberInput"
  | "email"
  | "dropdown"
  | "multipleChoice"
  | "checkbox"
  | "rating";

type FieldOption = {
  id: string;
  label: string;
};

type FormField = {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder: string;
  required: boolean;
  validateFormat: boolean;
  /** Options for dropdown, multipleChoice, checkbox */
  options: FieldOption[];
  /** Max rating for rating type */
  max?: number;
  /** Min value for number type */
  min?: number;
  /** Step for number type */
  step?: number;
};

type ChatMessage = {
  id: string;
  role: "ai" | "user";
  content: string;
  code?: string;
};

type FormType = "scroll" | "step" | "chat";

/* ── Field Type Metadata ─────────────────────────────────────────── */

const FIELD_TYPE_OPTIONS = [
  { value: "textInput" as const, label: "Text Input", icon: Type },
  { value: "numberInput" as const, label: "Number Input", icon: Hash },
  { value: "email" as const, label: "Email Input", icon: Mail },
  { value: "dropdown" as const, label: "Dropdown / Select", icon: ChevronDown },
  { value: "checkbox" as const, label: "Checkbox", icon: SquareCheck },
  { value: "multipleChoice" as const, label: "Multiple Choice", icon: CircleDot },
  { value: "rating" as const, label: "Rating / Scale", icon: Star },
] as const;

const FIELD_ICON_MAP = Object.fromEntries(
  FIELD_TYPE_OPTIONS.map((opt) => [opt.value, opt.icon])
) as Record<FormFieldType, typeof Type>;

function getFieldIcon(type: FormFieldType) {
  return FIELD_ICON_MAP[type] ?? Type;
}

function createField(type: FormFieldType): FormField {
  const meta = FIELD_TYPE_OPTIONS.find((o) => o.value === type);
  const base: FormField = {
    id: `field-${crypto.randomUUID()}`,
    type,
    label: meta?.label ?? "New Field",
    placeholder: "Enter value...",
    required: false,
    validateFormat: false,
    options: [],
  };

  if (type === "rating") {
    base.max = 5;
  }
  
  if (type === "numberInput") {
    base.step = 1;
  }

  // Seed default options for types that need them
  if (type === "dropdown" || type === "multipleChoice" || type === "checkbox") {
    base.options = [
      { id: crypto.randomUUID(), label: "Option 1" },
      { id: crypto.randomUUID(), label: "Option 2" },
    ];
  }

  // Sensible defaults
  if (type === "email") {
    base.placeholder = "you@example.com";
  }
  if (type === "dropdown") {
    base.placeholder = "Select an option…";
  }

  return base;
}

/* ── Mock Chat Data ──────────────────────────────────────────────── */

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "msg-1",
    role: "ai",
    content: "Hi! What kind of form do you want to build today?",
  },
];

/* ── Options Editor (shared for Dropdown, Checkbox, Multiple Choice) ─ */

function OptionsEditor({
  options,
  onUpdate,
}: {
  options: FieldOption[];
  onUpdate: (options: FieldOption[]) => void;
}) {
  const addOption = () => {
    onUpdate([
      ...options,
      { id: crypto.randomUUID(), label: `Option ${options.length + 1}` },
    ]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 1) return;
    onUpdate(options.filter((o) => o.id !== id));
  };

  const updateOptionLabel = (id: string, label: string) => {
    onUpdate(options.map((o) => (o.id === id ? { ...o, label } : o)));
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Options
      </Label>
      <div className="flex flex-col gap-1.5">
        {options.map((option, idx) => (
          <div key={option.id} className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-5 shrink-0 text-right">
              {idx + 1}.
            </span>
            <Input
              className="flex-1"
              type="text"
              value={option.label}
              onChange={(e) => updateOptionLabel(option.id, (e.target as HTMLInputElement).value)}
              placeholder={`Option ${idx + 1}`}
            />
            <button
              onClick={() => removeOption(option.id)}
              disabled={options.length <= 1}
              className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label={`Remove option ${idx + 1}`}
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addOption}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1 self-start"
      >
        <Plus className="size-3.5" />
        Add option
      </button>
    </div>
  );
}

/* ── Edit Settings Panel (type-specific config) ──────────────────── */

function EditSettingsPanel({
  field,
  onUpdate,
}: {
  field: FormField;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
}) {
  return (
    <div className="px-4 pb-4 flex flex-col gap-3 border-t border-border pt-3">
      {/* Field Type */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Field Type
        </Label>
        <Select
          value={field.type}
          onValueChange={(val) => {
            const newType = val as FormFieldType;
            const newFieldDefaults = createField(newType);
            onUpdate(field.id, {
              ...newFieldDefaults,
              id: field.id,
              label: field.label,
              required: field.required,
            });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectPopup>
            {FIELD_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </div>

      {/* Label — all types */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Label
        </Label>
        <Input
          type="text"
          value={field.label}
          onChange={(e) => onUpdate(field.id, { label: (e.target as HTMLInputElement).value })}
        />
      </div>

      {/* Placeholder — textInput, numberInput, email, dropdown */}
      {(field.type === "textInput" ||
        field.type === "numberInput" ||
        field.type === "email" ||
        field.type === "dropdown") && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Placeholder
          </Label>
          <Input
            type="text"
            value={field.placeholder}
            onChange={(e) =>
              onUpdate(field.id, { placeholder: (e.target as HTMLInputElement).value })
            }
          />
        </div>
      )}

      {/* Number-specific: Min, Max, Step */}
      {field.type === "numberInput" && (
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Min
            </Label>
            <Input
              type="number"
              value={field.min ?? ""}
              onChange={(e) => {
                const val = (e.target as HTMLInputElement).value;
                onUpdate(field.id, { min: val === "" ? undefined : Number(val) });
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Max
            </Label>
            <Input
              type="number"
              value={field.max ?? ""}
              onChange={(e) => {
                const val = (e.target as HTMLInputElement).value;
                onUpdate(field.id, { max: val === "" ? undefined : Number(val) });
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step
            </Label>
            <Input
              type="number"
              value={field.step ?? ""}
              min={1}
              onChange={(e) => {
                const val = (e.target as HTMLInputElement).value;
                onUpdate(field.id, { step: val === "" ? undefined : Number(val) });
              }}
            />
          </div>
        </div>
      )}

      {/* Rating-specific: Max stars */}
      {field.type === "rating" && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Max Stars
          </Label>
          <Select
            value={String(field.max ?? 5)}
            onValueChange={(val) =>
              onUpdate(field.id, { max: Number(val) })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectPopup>
              {Array.from({ length: 9 }, (_, i) => i + 2).map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} stars
                </SelectItem>
              ))}
            </SelectPopup>
          </Select>
        </div>
      )}

      {/* Options editor — dropdown, multipleChoice, checkbox */}
      {(field.type === "dropdown" ||
        field.type === "multipleChoice" ||
        field.type === "checkbox") && (
        <OptionsEditor
          options={field.options}
          onUpdate={(options) => onUpdate(field.id, { options })}
        />
      )}

      {/* Validation toggles */}
      <div className="flex items-center gap-4 mt-1">
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <Checkbox
            checked={field.required}
            onCheckedChange={(checked) =>
              onUpdate(field.id, { required: !!checked })
            }
          />
          Required
        </label>
        {field.type === "email" && (
          <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
            <Checkbox
              checked={field.validateFormat}
              onCheckedChange={(checked) =>
                onUpdate(field.id, { validateFormat: !!checked })
              }
            />
            Validate Format
          </label>
        )}
      </div>
    </div>
  );
}

/* ── Snippet Palette Item (Left Panel — draggable) ───────────────── */

function SnippetPreviewImage({ type }: { type: FormFieldType }) {
  const commonInputClass = "h-5 w-full rounded border border-border/50 bg-background/50";
  return (
    <div className="w-24 h-12 rounded border border-border/50 bg-background/30 flex flex-col justify-center px-2 pointer-events-none select-none">
      {type === "textInput" && (
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-8 rounded-sm bg-muted-foreground/30" />
          <div className={commonInputClass} />
        </div>
      )}
      {type === "numberInput" && (
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-8 rounded-sm bg-muted-foreground/30" />
          <div className={`${commonInputClass} flex items-center justify-end px-1`}>
            <div className="flex flex-col gap-[2px]">
              <div className="h-1 w-2 bg-muted-foreground/40 rounded-sm" />
              <div className="h-1 w-2 bg-muted-foreground/40 rounded-sm" />
            </div>
          </div>
        </div>
      )}
      {type === "email" && (
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-8 rounded-sm bg-muted-foreground/30" />
          <div className={`${commonInputClass} flex items-center px-1.5`}>
            <span className="text-[8px] font-bold text-muted-foreground/50">@</span>
          </div>
        </div>
      )}
      {type === "dropdown" && (
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-8 rounded-sm bg-muted-foreground/30" />
          <div className={`${commonInputClass} flex items-center justify-between px-1.5`}>
            <div className="h-1 w-6 bg-muted-foreground/20 rounded-sm" />
            <ChevronDown className="size-2.5 text-muted-foreground/50" />
          </div>
        </div>
      )}
      {type === "checkbox" && (
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-[2px] border border-border bg-background/80" />
            <div className="h-1.5 w-10 rounded-sm bg-muted-foreground/30" />
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-[2px] border border-border bg-background/80" />
            <div className="h-1.5 w-6 rounded-sm bg-muted-foreground/30" />
          </div>
        </div>
      )}
      {type === "multipleChoice" && (
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full border border-border bg-background/80" />
            <div className="h-1.5 w-10 rounded-sm bg-muted-foreground/30" />
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full border border-border bg-background/80" />
            <div className="h-1.5 w-6 rounded-sm bg-muted-foreground/30" />
          </div>
        </div>
      )}
      {type === "rating" && (
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-8 rounded-sm bg-muted-foreground/30" />
          <div className="flex gap-0.5">
            <Star className="size-3.5 text-muted-foreground/30 fill-muted-foreground/30" />
            <Star className="size-3.5 text-muted-foreground/30 fill-muted-foreground/30" />
            <Star className="size-3.5 text-muted-foreground/30 fill-muted-foreground/30" />
          </div>
        </div>
      )}
    </div>
  );
}

function SnippetItem({
  type,
  label,
  icon: Icon,
}: {
  type: FormFieldType;
  label: string;
  icon: typeof Type;
}) {
  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("application/snippet-type", type);
    e.dataTransfer.effectAllowed = "copy";
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex flex-col border border-border rounded-lg cursor-grab overflow-hidden bg-background hover:border-foreground/40 hover:bg-muted/50 transition-all select-none active:scale-95 active:shadow-lg active:border-foreground group"
    >
      <div className="p-3 border-b border-border/50 bg-muted/10 flex justify-center group-hover:bg-muted/30 transition-colors">
        <SnippetPreviewImage type={type} />
      </div>
      <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span className="font-medium truncate">{label}</span>
        <GripVertical className="size-3.5 ml-auto text-muted-foreground/40 shrink-0" />
      </div>
    </div>
  );
}

/* ── Canvas Field Card (Right Panel — Editable, draggable) ───────── */

function CanvasFieldCard({
  field,
  index,
  totalFields,
  onUpdate,
  onDuplicate,
  onDelete,
  isExpanded,
  onToggleExpand,
  onMoveField,
  onSnippetDropOnCard,
}: {
  field: FormField;
  index: number;
  totalFields: number;
  onUpdate: (id: string, updates: Partial<FormField>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onMoveField: (fromIndex: number, toIndex: number) => void;
  onSnippetDropOnCard: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
}) {
  const IconComponent = getFieldIcon(field.type);
  const dragControls = useDragControls();

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const hasSnippet = e.dataTransfer.types.includes("application/snippet-type");
    if (hasSnippet) {
      e.dataTransfer.dropEffect = "copy";
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    const snippetType = e.dataTransfer.getData("application/snippet-type");
    if (snippetType) {
      e.preventDefault();
      e.stopPropagation();
      onSnippetDropOnCard(e, index);
    }
  }

  return (
    <Reorder.Item
      value={field}
      dragListener={false}
      dragControls={dragControls}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border border-border rounded-lg bg-background transition-all hover:border-foreground/30 relative"
    >
      {/* Collapsed Header (always visible) */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer"
        onClick={() => onToggleExpand(field.id)}
      >
        <span
          role="button"
          tabIndex={0}
          className="cursor-grab p-0.5 text-muted-foreground hover:text-foreground touch-none"
          aria-label={`Reorder ${field.label}, position ${index + 1} of ${totalFields}. Use arrow keys to move.`}
          aria-roledescription="sortable"
          onPointerDown={(e) => {
            e.stopPropagation();
            dragControls.start(e);
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" && index > 0) {
              e.preventDefault();
              e.stopPropagation();
              onMoveField(index, index - 1);
            } else if (e.key === "ArrowDown" && index < totalFields - 1) {
              e.preventDefault();
              e.stopPropagation();
              onMoveField(index, index + 1);
            }
          }}
        >
          <GripVertical className="size-4" />
        </span>
        <IconComponent className="size-4 text-muted-foreground" />
        <span className="font-medium text-sm text-foreground flex-1 truncate">
          {field.label}
        </span>
        {field.required && (
          <Badge variant="outline" size="sm" className="text-xs">
            Required
          </Badge>
        )}
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(field.id); }}
            className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
            aria-label="Duplicate field"
          >
            <Copy className="size-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(field.id); }}
            className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
            aria-label="Delete field"
          >
            <Trash2 className="size-3.5" />
          </button>
          {isExpanded ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expanded Edit Settings */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <EditSettingsPanel field={field} onUpdate={onUpdate} />
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}

/* ── Chat Message Bubble ─────────────────────────────────────────── */

function ChatBubble({ message }: { message: ChatMessage }) {
  const isAI = message.role === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2.5 ${isAI ? "" : "flex-row-reverse"}`}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
          isAI ? "bg-muted border border-border" : "bg-foreground"
        }`}
      >
        {isAI ? (
          <Bot className="size-3.5 text-foreground" />
        ) : (
          <User className="size-3.5 text-background" />
        )}
      </div>
      <div
        className={`rounded-lg p-3 text-sm max-w-[85%] flex flex-col gap-2 ${
          isAI
            ? "bg-muted border border-border text-foreground"
            : "bg-background border border-border text-foreground"
        }`}
      >
        <span>{message.content}</span>
        {message.code && (
          <div className="bg-background border border-border rounded p-2 text-xs font-mono text-muted-foreground">
            {message.code}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Main Create Form Component ──────────────────────────────────── */

export function CreateFormPage() {
  const [mode, setMode] = useState<"chat" | "manual">("manual");
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<FormType>("scroll");
  const [fields, setFields] = useState<FormField[]>([]);
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");
  const [saveState, setSaveState] = useState<"unsaved" | "saving" | "saved">("unsaved");
  const [dropHighlight, setDropHighlight] = useState(false);

  /* ── Refs for timeout cleanup ─────────────────────────────────── */
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const publishTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  /* ── Cleanup on unmount ──────────────────────────────────────── */
  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
      publishTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  /* ── Auto-scroll chat to bottom ──────────────────────────────── */
  useEffect(() => {
    chatScrollRef.current?.scrollTo({
      top: chatScrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatMessages]);

  /* ── Field Operations ────────────────────────────────────────── */

  const updateField = useCallback(
    (id: string, updates: Partial<FormField>) => {
      setFields((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
      setSaveState("unsaved");
    },
    []
  );

  const duplicateField = useCallback((id: string) => {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx === -1) return prev;
      const clone = {
        ...prev[idx],
        id: `field-${crypto.randomUUID()}`,
        label: `${prev[idx].label} (Copy)`,
        options: prev[idx].options.map((o) => ({ ...o, id: crypto.randomUUID() })),
      };
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
    setSaveState("unsaved");
  }, []);

  const deleteField = useCallback((id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setExpandedFieldId((prev) => (prev === id ? null : prev));
    setSaveState("unsaved");
  }, []);

  const toggleExpandField = useCallback((id: string) => {
    setExpandedFieldId((prev) => (prev === id ? null : id));
  }, []);

  /* ── Native HTML5 Drag & Drop — Canvas handlers ──────────────── */

  /** Drop snippet on the canvas background (appends to end) */
  const handleCanvasDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDropHighlight(false);

      const snippetType = e.dataTransfer.getData("application/snippet-type");
      if (snippetType) {
        const newField = createField(snippetType as FormFieldType);
        setFields((prev) => [...prev, newField]);
        setExpandedFieldId(newField.id);
        setSaveState("unsaved");
      }
    },
    []
  );

  /** Drop snippet on a specific card — insert above or below based on cursor Y */
  const handleSnippetDropOnCard = useCallback(
    (e: React.DragEvent<HTMLDivElement>, cardIndex: number) => {
      setDropHighlight(false);
      const snippetType = e.dataTransfer.getData("application/snippet-type");
      if (!snippetType) return;

      // Determine if cursor is in the top or bottom half of the card
      const rect = e.currentTarget.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const insertIndex = e.clientY < midY ? cardIndex : cardIndex + 1;

      const newField = createField(snippetType as FormFieldType);
      setFields((prev) => {
        const next = [...prev];
        next.splice(insertIndex, 0, newField);
        return next;
      });
      setExpandedFieldId(newField.id);
      setSaveState("unsaved");
    },
    []
  );

  const handleCanvasDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setDropHighlight(true);
    },
    []
  );

  const handleCanvasDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      // Only reset if leaving the canvas itself, not entering a child
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setDropHighlight(false);
      }
    },
    []
  );



  /* ── Chat Operations ─────────────────────────────────────────── */

  const sendChatMessage = useCallback(() => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `msg-${crypto.randomUUID()}`,
      role: "user",
      content: chatInput,
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    aiTimeoutRef.current = setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `msg-${crypto.randomUUID()}`,
        role: "ai",
        content:
          "I've updated the form based on your request. Check the canvas on the right.",
        code: "Modified fields: Updated structure",
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  }, [chatInput]);

  /* ── Mock Save ───────────────────────────────────────────────── */

  const handlePublish = useCallback(() => {
    publishTimersRef.current.forEach(clearTimeout);
    publishTimersRef.current = [];
    setSaveState("saving");
    publishTimersRef.current.push(setTimeout(() => setSaveState("saved"), 1500));
    publishTimersRef.current.push(setTimeout(() => setSaveState("unsaved"), 5000));
  }, []);

  return (
    <div className="bg-background text-foreground h-screen flex flex-col overflow-hidden">
      {/* ─── Top Navigation ──────────────────────────────────────── */}
      <nav className="border-b border-border bg-background shrink-0 z-10">
        <div className="flex justify-between items-center w-full h-14 px-6 lg:px-8 max-w-[1440px] mx-auto">
          <Link
            href="/dashboard"
            className="font-bold text-lg font-[family-name:var(--font-space-grotesk)] text-foreground"
          >
            Snap-Form
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              {saveState === "unsaved" && "Unsaved changes"}
              {saveState === "saving" && "Saving..."}
              {saveState === "saved" && "✓ Published"}
            </span>
            <Button size="sm" onClick={handlePublish}>
              <Upload className="size-3.5" />
              Publish
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Main Workspace (Split Screen) ───────────────────────── */}
      <main className="flex-1 flex overflow-hidden">
        {/* ── Left Panel: Snippet Palette ───────────────────────── */}
        <aside className="w-full md:w-[320px] border-r border-border bg-background flex flex-col shrink-0 h-full">
          {/* Tab Switcher */}
          <div className="p-4 border-b border-border shrink-0">
            <div className="flex w-full border border-border rounded-lg p-1 bg-muted/30">
              <button
                onClick={() => setMode("chat")}
                className={`flex-1 py-2 text-sm font-medium rounded-md flex justify-center items-center gap-2 transition-all ${
                  mode === "chat"
                    ? "bg-background text-foreground border border-border shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare className="size-4" />
                Chat
              </button>
              <button
                onClick={() => setMode("manual")}
                className={`flex-1 py-2 text-sm font-medium rounded-md flex justify-center items-center gap-2 transition-all ${
                  mode === "manual"
                    ? "bg-background text-foreground border border-border shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Wrench className="size-4" />
                Manual
              </button>
            </div>
          </div>

          {/* Form Type Selector */}
          <div className="px-4 py-3 border-b border-border shrink-0">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Form Type
            </Label>
            <div className="flex gap-2 mt-2">
              {(
                [
                  { id: "scroll", label: "Scroll", icon: ScrollText },
                  { id: "step", label: "Step", icon: ListOrdered },
                  { id: "chat", label: "Chat", icon: MessageCircle },
                ] as const
              ).map((ft) => (
                <button
                  key={ft.id}
                  onClick={() => setFormType(ft.id)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md flex items-center justify-center gap-1.5 border transition-all ${
                    formType === ft.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  <ft.icon className="size-3.5" />
                  {ft.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {mode === "manual" ? (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full overflow-y-auto p-4 flex flex-col gap-2"
                >
                  {/* Section Header */}
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Drag snippets to canvas
                  </p>

                  {/* Draggable Snippet List */}
                  <div className="flex flex-col gap-2">
                    {FIELD_TYPE_OPTIONS.map((opt) => (
                      <SnippetItem
                        key={opt.value}
                        type={opt.value}
                        label={opt.label}
                        icon={opt.icon}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  {/* Chat History */}
                  <div
                    ref={chatScrollRef}
                    className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
                  >
                    {chatMessages.map((msg) => (
                      <ChatBubble key={msg.id} message={msg} />
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-3 border-t border-border shrink-0">
                    <div className="flex items-center bg-background border border-border rounded-lg focus-within:border-foreground/50 transition-colors">
                      <input
                        aria-label="Chat prompt input"
                        className="flex-1 bg-transparent border-none text-sm p-3 placeholder:text-muted-foreground outline-none"
                        placeholder="Input prompt..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") sendChatMessage();
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="mr-1 text-foreground"
                        onClick={sendChatMessage}
                      >
                        <Send className="size-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* ── Right Panel: Editing Canvas ───────────────────────── */}
        <section className="flex-1 bg-accent/20 overflow-y-auto hidden md:flex flex-col">
          <div className="flex-1 flex justify-center p-8">
            <div className="w-full max-w-2xl flex flex-col gap-6">
              {/* Form Header (Editable) */}
              <div className="bg-background border border-border rounded-lg p-6">
                <input
                  className="w-full font-bold text-2xl md:text-3xl font-[family-name:var(--font-space-grotesk)] text-foreground bg-transparent outline-none placeholder:text-muted-foreground"
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                    setSaveState("unsaved");
                  }}
                  placeholder="Form Title"
                />
                <input
                  className="w-full text-sm text-muted-foreground mt-2 bg-transparent outline-none placeholder:text-muted-foreground/50"
                  value={formDescription}
                  onChange={(e) => {
                    setFormDescription(e.target.value);
                    setSaveState("unsaved");
                  }}
                  placeholder="Add a description..."
                />
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="outline" size="sm" className="capitalize gap-1">
                    {formType === "scroll" && <ScrollText className="size-3" />}
                    {formType === "step" && <ListOrdered className="size-3" />}
                    {formType === "chat" && <MessageCircle className="size-3" />}
                    {formType} form
                  </Badge>
                </div>
              </div>

              {/* Droppable Canvas */}
              <div
                onDrop={handleCanvasDrop}
                onDragOver={handleCanvasDragOver}
                onDragLeave={handleCanvasDragLeave}
                className={`flex flex-col gap-3 min-h-[200px] rounded-lg transition-colors p-2 ${
                  dropHighlight
                    ? "bg-foreground/5 border-2 border-dashed border-foreground/20"
                    : fields.length === 0
                      ? "border-2 border-dashed border-border"
                      : ""
                }`}
              >
                {fields.length === 0 && !dropHighlight && (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <GripVertical className="size-8 mb-3 opacity-30" />
                    <p className="text-sm font-medium">
                      Drag snippets here to build your form
                    </p>
                    <p className="text-xs mt-1 opacity-60">
                      Drag field types from the left panel and drop here
                    </p>
                  </div>
                )}

                <Reorder.Group
                  axis="y"
                  values={fields}
                  onReorder={(newFields) => {
                    setFields(newFields);
                    setSaveState("unsaved");
                  }}
                  className="w-full flex flex-col gap-3"
                >
                  {fields.map((field, index) => (
                    <CanvasFieldCard
                      key={field.id}
                      field={field}
                      index={index}
                      totalFields={fields.length}
                      onUpdate={updateField}
                      onDuplicate={duplicateField}
                      onDelete={deleteField}
                      isExpanded={expandedFieldId === field.id}
                      onToggleExpand={toggleExpandField}
                      onMoveField={(from, to) => {
                        setFields((prev) => {
                          const next = [...prev];
                          const [removed] = next.splice(from, 1);
                          next.splice(to, 0, removed);
                          return next;
                        });
                        setSaveState("unsaved");
                      }}
                      onSnippetDropOnCard={handleSnippetDropOnCard}
                    />
                  ))}
                </Reorder.Group>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
