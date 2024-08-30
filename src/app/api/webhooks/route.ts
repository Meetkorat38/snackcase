import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = await headers().get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature provided", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_CHECKOUT_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_email) {
        return new Response("Missing customer email address");
      }

      const session = event.data.object as Stripe.Checkout.Session;

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };

      if (!userId || !orderId) {
        return new Response("Invalid user metadata received", { status: 400 });
      }

      const {
        city: billingAddressCity,
        postal_code: billingAddressPostalCode,
        state: billingAddressState,
        country: billingAddressCountry,
        line1: billingAddreStreet,
      } = session.customer_details!.address!;
      const {
        city: shippingAddressCity,
        country: shippingAddressCountry,
        postal_code: shippingAddressPostalCode,
        state: shippingAddressState,
        line1: shippingAddressStreet,
      } = session.shipping_details!.address!;

      await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          ShippingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: shippingAddressCity!,
              country: shippingAddressCountry!,
              postalCode: shippingAddressPostalCode!,
              state: shippingAddressState!,
              street: shippingAddressStreet!,
            },
          },
          BillingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: billingAddressCity!,
              country: billingAddressCountry!,
              postalCode: billingAddressPostalCode!,
              state: billingAddressState!,
              street: billingAddreStreet!,
            },
          },
        },
      });
    }
    return Response.json({ result: event, ok: true }, { status: 200 });
  } catch (error: any) {
    console.log(
      error.message || error || "Error when trying to connect to stripe payment"
    );
    return Response.json(
      {
        message:
          error.message ||
          error ||
          "Error when trying to connect to stripe payment",
        ok: false,
      },
      { status: 500 }
    );
  }
}
