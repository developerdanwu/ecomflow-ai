import { AppProviders } from "@/components/app-providers";
import { OrderForm } from "@/components/order-form";
export default function Home() {
  return (
    <div>
      <AppProviders>
        <OrderForm />;
      </AppProviders>
    </div>
  );
}
