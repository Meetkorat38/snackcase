/* eslint-disable @next/next/no-img-element */
import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";

export type PageProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findFirst({
    where: {
      id,
    },
  });

  if (!configuration) {
    return notFound();
  }

  const { imageUrl, height, width } = configuration;

  return (
    <>
      <DesignConfigurator
        configId={configuration.id}
        imageUrl={imageUrl}
        imageDimension={{
          height,
          width,
        }}
      />
    </>
  );
};

export default page;
