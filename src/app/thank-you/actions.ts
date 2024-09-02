"use server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user?.email) {
    throw new Error("User not found");
  }

  if (!orderId) {
    throw new Error("Order not found");
  }

  console.log("order Id  : " + orderId);

  const order = await db.order.findFirst({
    where: {
      id: orderId,
      userId: user.id,
    },
    include: {
      configuration: true,
      BillingAddress: true,
      ShippingAddress: true,
    },
  });

  if (!order) throw new Error("Order not found");

  console.log(order.isPaid);

  if (order.isPaid) {
    return order;
  } else {
    return false;
  }
};

export { getPaymentStatus };
