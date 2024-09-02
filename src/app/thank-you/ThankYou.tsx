"use client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getPaymentStatus } from "./actions";
import { Loader2 } from "lucide-react";
import PhonePreview from "@/components/PhonePreview";
import { formatePrice } from "@/lib/utils";

const ThankYou = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId")!;

  console.log(orderId);

  const { data } = useQuery({
    queryKey: ["get-order-done"],
    queryFn: async () => await getPaymentStatus({ orderId: orderId }),
    retry: true,
    retryDelay: 500,
  });

  if (data === undefined) {
    return <Loader titleText="Loading your order..." />;
  }

  if (data === false) {
    return <Loader titleText="Verifying your payment." />;
  }

  const { configuration, BillingAddress, ShippingAddress, amount } = data;
  const { color, croppedImageUrl } = configuration;

  return (
    <div className="bg-white">
      {/* Brand Details */}
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-base font-medium text-primary">Thank You!</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Your case on the way!
          </p>
          <p className="mt-2 text-base text-zinc-500">
            we recived your order and now processing it.{" "}
            <span className="text-green-500">check your email</span>
          </p>

          <div className="mt-12 text-sm font-medium">
            <p className="text-zinc-900">Order Number</p>
            <p className="mt-2 text-zinc-500">{orderId}</p>
          </div>

          <div className="mt-10 border-t border-zinc-200">
            <div className="mt-10 flex flex-auto flex-col">
              <h4 className="font-semibold text-zinc-900">
                You mad a great choice!
              </h4>
              <p className="mt-2 text-sm text-zinc-600">
                We at SnackCase belive that a phone case doesnt only need to
                look good, but also last you for the years to come
              </p>
            </div>
          </div>
        </div>

        {/* Phon Preview */}
        <div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
          <PhonePreview color={color!} imageUrl={croppedImageUrl!} />
        </div>

        {/* Billign, Shipping Address and Payment */}
        <div>
          {/* Billign, Shipping Address */}
          <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
            {/* Shipping */}
            <div>
              <p className="font-medium text-gray-900">Shipping Address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">{ShippingAddress?.name}</span>
                  <span className="block">{ShippingAddress?.street}</span>
                  <span className="block">
                    {ShippingAddress?.postalCode} : {ShippingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
            {/* Billing */}
            <div>
              <p className="font-medium text-gray-900">Billing Address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">{BillingAddress?.name}</span>
                  <span className="block">{BillingAddress?.street}</span>
                  <span className="block">
                    {BillingAddress?.postalCode} : {BillingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
          </div>

          {/* Payment*/}
          <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
            <div>
              <p className="font-medium text-zinc-900">Payment status</p>
              <p className="mt-2 text-zinc-700">Paid</p>
            </div>
            <div>
              <p className="font-medium text-zinc-900">SHipping Methods</p>
              <p className="mt-2 text-zinc-700">shipping takes up to 3 days</p>
            </div>
          </div>
        </div>

        {/* amount */}
        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Subtotal</p>
            <p className="text-zinc-700">{formatePrice(amount)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Shipping charges</p>
            <p className="text-zinc-700">{formatePrice(0)}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Total</p>
            <p className="text-zinc-700">{formatePrice(amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Loader = ({ titleText }: { titleText: string }) => {
  return (
    <div className="w-full mt-32 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        <h3 className="font-semibold text-xl ">{titleText}</h3>
        <p>This wont take long.</p>
      </div>
    </div>
  );
};

export default ThankYou;
