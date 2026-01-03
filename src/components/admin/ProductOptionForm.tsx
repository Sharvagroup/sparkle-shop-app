import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductOption, ProductOptionInput } from "@/hooks/useProductOptions";
import { useState } from "react";

const optionSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  type: z.enum(["number", "select", "text", "boolean"]),
  unit: z.string().max(20).optional().nullable(),
  is_mandatory: z.boolean().default(false),
  is_enabled: z.boolean().default(true),
  min_value: z.coerce.number().optional().nullable(),
  max_value: z.coerce.number().optional().nullable(),
  step_value: z.coerce.number().optional().nullable(),
  display_order: z.coerce.number().int().min(0).default(0),
});

type OptionFormData = z.infer<typeof optionSchema>;

interface ProductOptionFormProps {
  option?: ProductOption | null;
  onSubmit: (data: ProductOptionInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ProductOptionForm = ({ option, onSubmit, onCancel, isLoading }: ProductOptionFormProps) => {
  const [selectOptions, setSelectOptions] = useState<string[]>(option?.select_options || []);
  const [newSelectOption, setNewSelectOption] = useState("");

  const form = useForm<OptionFormData>({
    resolver: zodResolver(optionSchema),
    defaultValues: {
      name: option?.name || "",
      type: option?.type || "number",
      unit: option?.unit || "",
      is_mandatory: option?.is_mandatory || false,
      is_enabled: option?.is_enabled ?? true,
      min_value: option?.min_value ?? null,
      max_value: option?.max_value ?? null,
      step_value: option?.step_value ?? 1,
      display_order: option?.display_order || 0,
    },
  });

  const watchType = form.watch("type");

  const addSelectOption = () => {
    if (newSelectOption.trim() && !selectOptions.includes(newSelectOption.trim())) {
      setSelectOptions([...selectOptions, newSelectOption.trim()]);
      setNewSelectOption("");
    }
  };

  const removeSelectOption = (opt: string) => {
    setSelectOptions(selectOptions.filter((o) => o !== opt));
  };

  const handleFormSubmit = async (data: OptionFormData) => {
    await onSubmit({
      name: data.name,
      type: data.type,
      unit: data.unit || null,
      is_mandatory: data.is_mandatory,
      is_enabled: data.is_enabled,
      display_order: data.display_order,
      min_value: data.min_value ?? null,
      max_value: data.max_value ?? null,
      step_value: data.step_value ?? null,
      select_options: selectOptions,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Weight, Size" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="select">Dropdown (Select)</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="boolean">Yes/No (Boolean)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Label</FormLabel>
              <FormControl>
                <Input placeholder="e.g., g, kg, pcs, ml" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Displayed next to the input (e.g., "100 g")</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Number type options */}
        {watchType === "number" && (
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="min_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="step_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Step</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? 1}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Select type options */}
        {watchType === "select" && (
          <div className="space-y-3">
            <FormLabel>Dropdown Options</FormLabel>
            <div className="flex gap-2">
              <Input
                placeholder="Add option (e.g., Small, Medium)"
                value={newSelectOption}
                onChange={(e) => setNewSelectOption(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSelectOption();
                  }
                }}
              />
              <Button type="button" variant="outline" size="icon" onClick={addSelectOption}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {selectOptions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectOptions.map((opt) => (
                  <div
                    key={opt}
                    className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm"
                  >
                    {opt}
                    <button
                      type="button"
                      onClick={() => removeSelectOption(opt)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name="display_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="is_mandatory"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <FormLabel className="text-sm">Mandatory</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Always required when enabled
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_enabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <FormLabel className="text-sm">Enabled</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Available for products
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {option ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductOptionForm;
