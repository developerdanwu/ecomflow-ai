import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { inngest } from "@/server/inngest";
import { useCallback } from "react";
import { z } from "zod";

const FormSchema = z.object({
  question: z.string().min(1, {
    message: "Please enter your question.",
  }),
  orderId: z.string().refine(
    (val) => {
      if (val && val.trim().length > 0 && val.trim().length < 3) {
        return false;
      }
      return true;
    },
    {
      message: "Order ID must be at least 3 characters long.",
    }
  ),
});

export function OrderForm() {
  const form = useAppForm({
    validators: { onChange: FormSchema },
    defaultValues: {
      question: "",
      orderId: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted:", value);
      const test = await inngest.send({
        name: "order-ai/query",
        data: {
          question: value.question,
          orderId: value.orderId,
          userId: "123",
          sessionId: "123",
        },
      });
      console.log("test", test);
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Order AI Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about your order or get general assistance.
        </p>
      </div>

      <form.AppForm>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <form.AppField
            name="question"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Your Question *</field.FormLabel>
                <field.FormControl>
                  <Textarea
                    placeholder="What would you like to know about your order?"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    rows={4}
                  />
                </field.FormControl>
                <field.FormDescription>
                  Ask anything about your order, delivery, returns, or general
                  questions.
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
          <form.AppField
            name="orderId"
            children={(field) => (
              <field.FormItem>
                <field.FormLabel>Order ID (Optional)</field.FormLabel>
                <field.FormControl>
                  <Input
                    placeholder="e.g., ORD-12345-678"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </field.FormControl>
                <field.FormDescription>
                  Enter your order ID if you have a specific order question.
                </field.FormDescription>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Ask AI Assistant
          </Button>
        </form>
      </form.AppForm>
    </div>
  );
}
