"use client";

import { Button } from "@/components/ui/button";
import { InngestStatus } from "@/components/ui/inngest-status";
import { Input } from "@/components/ui/input";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";
import { fetchSubscriptionToken } from "@/lib/actions";
import { EcomflowUIMessage } from "@/server/ai/types";
import { orpc } from "@/server/orpc/client";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useStore } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { match } from "ts-pattern";
import { z } from "zod";
import { Badge } from "./ui/badge";
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
  const { latestData, state, error } = useInngestSubscription({
    refreshToken: fetchSubscriptionToken,
  });
  const message = latestData?.data.data as EcomflowUIMessage | null;

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
      form.reset();
    },
  });
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Nolan AI Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about your order or get general assistance.
        </p>
      </div>
      <InngestStatus state={state} />
      <form.AppForm>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
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
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.setFieldValue(
                  "question",
                  "What is the status of my order?"
                );
                form.setFieldValue("orderId", "297b2cc5e3c97637");
              }}
              className="flex-1"
            >
              Try Example
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              Ask AI Assistant
            </Button>
          </div>
        </form>
      </form.AppForm>
      <div>
        {error && <div>Error occured while streaming: {error.message}</div>}
        {message
          ? message.parts.map((part, index) => {
              return match(part)
                .with(
                  {
                    type: "text",
                  },
                  (p) => {
                    return (
                      <MemoizedMarkdown
                        key={`${message.id}-text-${index}`}
                        content={p.text}
                        id={`${message.id}-${index}`}
                      />
                    );
                  }
                )
                .with(
                  {
                    type: "tool-findOrderById",
                  },
                  (p) => {
                    const output = p.output;
                    if (!output) return null;

                    return (
                      <div
                        key={`${message.id}-tool-${index}`}
                        className="flex items-center gap-2 p-3 rounded-lg border bg-muted/20 my-2"
                      >
                        {output.success ? (
                          <>
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
                              ✓
                            </div>
                            <div className="flex-1">
                              <Badge variant="secondary" className="mb-1">
                                Order Found
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                {output.message}
                              </p>
                              {output.order && (
                                <div className="mt-2 text-xs space-y-1">
                                  <p>
                                    <span className="font-medium">
                                      Customer:
                                    </span>{" "}
                                    {output.order.customerName}
                                  </p>
                                  <p>
                                    <span className="font-medium">Email:</span>{" "}
                                    {output.order.customerEmail}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Order ID:
                                    </span>{" "}
                                    {output.order.orderPublicId}
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                              ✕
                            </div>
                            <div className="flex-1">
                              <Badge variant="destructive" className="mb-1">
                                Order Not Found
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                {output.message}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  }
                )
                .otherwise(() => {
                  // not implemented for simplicity
                  return (
                    <div key={`${message.id}-tool-${index}`}>
                      Not implemented
                    </div>
                  );
                });
            })
          : null}
      </div>
    </div>
  );
}
