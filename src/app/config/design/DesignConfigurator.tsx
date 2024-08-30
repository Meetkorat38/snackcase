"use client";

import HandleComponent from "@/components/HandleComponent";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { BASE_PRICE } from "@/config/products";
import { useUploadThing } from "@/lib/uploadthing";
import { cn, formatePrice } from "@/lib/utils";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validators/option-validator";
import { Description, Radio, RadioGroup } from "@headlessui/react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check, ChevronDownCircle } from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { saveConfig as _saveConfig, saveConfigData } from "./actions";

interface DesignConfigurator {
  configId: string;
  imageUrl: string;
  imageDimension: {
    width: number;
    height: number;
  };
}

const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimension,
}: DesignConfigurator) => {
  // use state options
  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const [renderDimensions, setRenderDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: imageDimension.width,
    height: imageDimension.height,
  });

  const [renderPosition, setRenderPostion] = useState<{
    x: number;
    y: number;
  }>({
    x: 150,
    y: 205,
  });

  const phoneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { startUpload } = useUploadThing("imageUploader");

  const { toast } = useToast();
  const router = useRouter();

  const { mutate: saveConfig, isPending } = useMutation({
    mutationKey: ["save-congiguration"],
    mutationFn: async (args: saveConfigData) => {
      // Now both will work in simulationally
      await Promise.all([saveCongiguration(), _saveConfig(args)]);
    },
    onError: () => {
      toast({
        title: "Error at uploading",
        description:
          "Error uploading while uploading image, please try again later",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push(`/config/preview/?id=${configId}`);
    },
  });

  const saveCongiguration = async () => {
    try {
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneRef.current!.getBoundingClientRect();
      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderPosition.x - leftOffset;
      const actualY = renderPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const userImage: HTMLImageElement = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;

      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderDimensions.width,
        renderDimensions.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1]; // to get only dataURL

      const blob = base64ToBlob(base64Data, "image/png");

      const file = new File([blob], "filename.png", {
        type: "image/png",
      });

      await startUpload([file], { configId });
    } catch (error) {
      toast({
        title: "Error at uploading",
        description:
          "Error uploading while uploading image, please try again later",
        variant: "destructive",
      });
    }
  };

  const base64ToBlob = (base64Data: string, mimeType: string) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  return (
    <div className="main relative mt-20 grid gap-4 grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      {/* Phone case */}
      <div
        ref={containerRef}
        className="phone-cover relative  h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ref={phoneRef}
            ratio={896 / 1831}
            className=" pointer-events-none relative z-50 aspect-[896/1831]"
          >
            <NextImage
              fill
              src={"/phone-template.png"}
              alt="your-image"
              className="pointer-events-none  z-50 select-none"
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]  shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              "absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
              `bg-${options.color.tw}`
            )}
          />
        </div>

        {/* Rnd Part */}
        <Rnd
          default={{
            x: 150,
            y: 150,
            height: imageDimension.height / 4,
            width: imageDimension.width / 4,
          }}
          onResizeStop={(_, __, ref, ____, position) => {
            setRenderDimensions({
              height: parseInt(ref.style.height.slice(0, -2)), // "50px" -> 50
              width: parseInt(ref.style.width.slice(0, -2)),
            });

            setRenderPostion({
              x: position.x,
              y: position.y,
            });
          }}
          onDragStop={(_, data) => {
            setRenderPostion({
              x: data.x,
              y: data.y,
            });
          }}
          lockAspectRatio
          resizeHandleComponent={{
            bottomLeft: <HandleComponent />,
            bottomRight: <HandleComponent />,
            topLeft: <HandleComponent />,
            topRight: <HandleComponent />,
          }}
        >
          <div className="relative h-full w-full ">
            <NextImage
              fill
              src={imageUrl}
              alt="your custome image"
              className="pointer-events-none  aspect-[9/16]"
            />
          </div>
        </Rnd>
      </div>

      {/* Options Part */}
      <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
        <ScrollArea className="SCROLLAREA relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />

          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tighter font-bold text-3xl">
              Customize your case
            </h2>

            <div className="w-full h-px bg-zinc-200 my-6" />

            <div className="relative mt-4 h-full  flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <RadioGroup
                  value={options.color}
                  onChange={(value) => {
                    setOptions((prev) => ({
                      ...prev,
                      color: value,
                    }));
                  }}
                >
                  <Label>Color : {options.color.label}</Label>

                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                      <Radio
                        key={color.label}
                        value={color}
                        className={({ checked }) =>
                          cn(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                            {
                              [`border-${color.tw}`]: checked,
                            }
                          )
                        }
                      >
                        <span
                          className={cn(
                            `bg-${color.tw}`,
                            "h-8 w-8 rounded-full border border-black border-opacity-10"
                          )}
                        ></span>
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                <div className="DROPDOWN MENU relative flex flex-col  gap-3 max-w-max ">
                  <Label>Model</Label>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"outline"}
                        role={"checkbox"}
                        className="w-full select-none justify-between"
                      >
                        {options.model.label}
                        <ChevronDownCircle className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.value}
                          className={cn(
                            "flex  text-sm gap-1 items-center justify-start  p-1.5 cursor-default hover:bg-zinc-100",
                            {
                              "bg-zinc-100":
                                model.label === options.model.label,
                            }
                          )}
                          onClick={() => {
                            setOptions((prev) => ({ ...prev, model }));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 ",
                              model.label === options.model.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectedOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(val) => {
                        setOptions((prev) => ({ ...prev, [name]: val }));
                      }}
                    >
                      <Label className="select-none">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Label>
                      {selectedOptions.map((option) => (
                        <Radio
                          key={option.value}
                          value={option}
                          className={({ checked }) =>
                            cn(
                              "relative block select-none cursor-pointer my-1.5 rounded-lg bg-white px-6 py-4 shadow-md border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between",
                              {
                                "border-primary": checked,
                              }
                            )
                          }
                        >
                          <span className="flex items-center gap-3">
                            <span className="flex flex-col text-sm">
                              <Label className="font-medium text-gray-900">
                                {option.label}
                              </Label>

                              {option.description && (
                                <Description
                                  as="span"
                                  className="text-gray-500 mt-0.5"
                                >
                                  <span className="block sm:inline">
                                    {option.description}
                                  </span>
                                </Description>
                              )}
                            </span>
                          </span>

                          <Description
                            as="span"
                            className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                          >
                            <span className="font-medium text-gray-900">
                              {formatePrice(option.price / 100)}
                            </span>
                          </Description>
                        </Radio>
                      ))}
                    </RadioGroup>
                  )
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Continue Button */}
        <div className="CONTINYE-BUTTON w-full px-8 h-16 bg-white">
          <div className="h-px w-full bg-zinc-200" />
          <div className="w-full h-full flex justify-end items-center">
            <div className="w-full flex gap-6 items-center">
              <p className="font-medium whitespace-nowrap">
                {formatePrice(
                  (BASE_PRICE + options.finish.price + options.material.price) /
                    100
                )}
              </p>
              <Button
                disabled={isPending}
                isLoading={isPending}
                loadingText="Genrating"
                onClick={() =>
                  saveConfig({
                    color: options.color.value,
                    configId,
                    finish: options.finish.value,
                    material: options.material.value,
                    model: options.model.value,
                  })
                }
                className="w-full"
                size={"sm"}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;
