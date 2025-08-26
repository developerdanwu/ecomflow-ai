"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { fetchSubscriptionToken } from "@/lib/actions";
import { orpc } from "@/server/orpc/client";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useMutation } from "@tanstack/react-query";
import { UIMessage } from "ai";
import { z } from "zod";
import { MemoizedMarkdown } from "./ui/markdown";

const ZFormSchema = z.object({
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
  const { data } = useInngestSubscription({
    refreshToken: fetchSubscriptionToken,
  });
  const message = (
    data.length > 0 ? data[data.length - 1].data.data : null
  ) as UIMessage | null;

  const askNolanAi = useMutation({
    ...orpc.nolanAi.ask.mutationOptions(),
  });

  const form = useAppForm({
    validators: { onChange: ZFormSchema },
    defaultValues: {
      question: "",
      orderId: "",
    },
    onSubmit: async ({ value }) => {
      // use async for the loading state
      await askNolanAi.mutateAsync({
        question: value.question,
        orderId: value.orderId,
      });
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Order AI Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about your order or get general assistance.
        </p>
      </div>

      <form.AppForm>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("penis");
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
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
      <div>
        {message
          ? message.parts.map((part, index) => {
              if (part.type === "text") {
                return (
                  <MemoizedMarkdown
                    content={part.text}
                    id={`${message.id}-${index}`}
                  />
                );
              }

              // skip rendering other UI for simplicity
              return null;
            })
          : null}
      </div>
    </div>
  );
}
