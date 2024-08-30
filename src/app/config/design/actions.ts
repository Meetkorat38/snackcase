"use server";

import { db } from "@/db";
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from "@prisma/client";

export interface saveConfigData {
  color: CaseColor;
  finish: CaseFinish;
  material: CaseMaterial;
  model: PhoneModel;
  configId: string;
}

export const saveConfig = async ({
  color,
  configId,
  finish,
  material,
  model,
}: saveConfigData) => {
  await db.configuration.update({
    where: { id: configId },
    data: {
      color,
      material,
      finish,
      model,
    },
  });
};
