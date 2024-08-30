import { db } from "@/db";
import { notFound } from "next/navigation";
import React from "react";
import DesignPreview from "./DesignPreview";
import { PageProps } from "../design/page";

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findFirst({
    where: {
      id,
    },
  });

  return <DesignPreview Configuration={configuration!}></DesignPreview>;
};

export default Page;
