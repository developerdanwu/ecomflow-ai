import { AppProviders } from "@/components/app-providers";
import { OrderForm } from "@/components/order-form";
import z from "zod";

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

export default function Home() {
  return (
    <div>
      <AppProviders>
        <OrderForm />;
      </AppProviders>
    </div>
  );
}
