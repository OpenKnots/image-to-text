"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { IconCopy, IconLoader2 } from "@tabler/icons-react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { toast } from "sonner";
import Image from "next/image";
import { isSupportedImageType, schema } from "@/lib/utils";
import { track } from "@vercel/analytics";

export default function Converter() {
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [blobURL, setBlobURL] = useState<string | null>(null);
    const [finished, setFinished] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { submit, object, isLoading } = useObject({
        api: "/api/convert",
        schema,
        onError: (e) => {
            toast.error(e.message);
            setBlobURL(null);
        },
        onFinish: () => setFinished(true),
    });

    async function uploadImage(file?: File | Blob) {
        if (!file) return;

        if (!isSupportedImageType(file.type)) {
            return toast.error(
                "Unsupported format. Only JPEG, PNG, GIF, and WEBP files are supported."
            );
        }

        if (file.size > 4.5 * 1024 * 1024) {
            return toast.error("Image too large, maximum file size is 4.5MB.");
        }

        const base64 = await toBase64(file);

        // roughly 4.5MB in base64
        if (base64.length > 6_464_471) {
            return toast.error("Image too large, maximum file size is 4.5MB.");
        }

        setBlobURL(URL.createObjectURL(file));
        setFinished(false);
        submit(base64);
    }

    function handleDragLeave() {
        setIsDraggingOver(false);
    }

    function handleDragOver(e: DragEvent) {
        setIsDraggingOver(true);
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    }

    async function handleDrop(e: DragEvent) {
        track("Drop");

        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);

        const file = e.dataTransfer?.files?.[0];
        uploadImage(file);
    }

    useEffect(() => {
        addEventListener("paste", handlePaste);
        addEventListener("drop", handleDrop);
        addEventListener("dragover", handleDragOver);
        addEventListener("dragleave", handleDragLeave);

        return () => {
            removeEventListener("paste", handlePaste);
            removeEventListener("drop", handleDrop);
            removeEventListener("dragover", handleDragOver);
            removeEventListener("dragleave", handleDragLeave);
        };
    });

    async function handlePaste(e: ClipboardEvent) {
        track("Paste");
        const file = e.clipboardData?.files?.[0];
        uploadImage(file);
    }

    async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        track("Upload");
        const file = e.target.files?.[0];
        uploadImage(file);
    }

    function copyBoth() {
        navigator.clipboard.writeText(
            [object?.description?.trim(), object?.text?.trim()].join("\n\n")
        );
        toast.success("Copied to clipboard");
    }

    return (
        <>
            <div
                className={clsx(
                    "rounded-2xl border border-white/40 dark:border-slate-700/50 text-foreground cursor-pointer transition-all duration-200 ease-in-out glass-subtle relative group select-none w-full pointer-events-none [@media(hover:hover)]:pointer-events-auto overflow-hidden min-h-[260px] sm:min-h-[320px]",
                    {
                        "shadow-[0_20px_50px_-35px_rgba(15,23,42,0.45)] hover:shadow-[0_24px_70px_-40px_rgba(15,23,42,0.55)]":
                            !isDraggingOver,
                        "border-indigo-300 dark:border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.25)]":
                            isDraggingOver,
                    }
                )}
                onClick={() => inputRef.current?.click()}
            >
                {blobURL && (
                    <Image
                        src={blobURL}
                        unoptimized
                        fill
                        className="lg:object-contain object-cover min-h-16"
                        alt="Uploaded image"
                    />
                )}

                <div
                    className={clsx(
                        "flex flex-col w-full h-full p-6 sm:p-8 items-center justify-center text-center absolute bg-white/40 dark:bg-slate-900/50 text-lg backdrop-blur-2xl",
                        {
                            "opacity-0 group-hover:opacity-100 transition ease-in-out":
                                object?.description,
                        }
                    )}
                >
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-4">
                            <IconLoader2 className="animate-spin size-10 text-indigo-500" />
                            <p className="text-sm text-slate-500 dark:text-slate-300">
                                Extracting details...
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="font-semibold text-xl sm:text-2xl text-foreground">
                                Drag, drop, or paste your image.
                            </p>
                            <p className="mt-2 text-sm sm:text-base text-muted-foreground hidden [@media(hover:hover)]:block">
                                Drop or paste anywhere, or click to upload.
                            </p>

                            <div className="mt-6 w-60 space-y-4 [@media(hover:hover)]:hidden pointer-events-auto">
                                <button className="rounded-full w-full py-3 bg-slate-900 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.6)]">
                                    Tap to upload
                                </button>

                                <input
                                    type="text"
                                    onKeyDown={(e) => e.preventDefault()}
                                    placeholder="Hold to paste"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-center w-full rounded-full py-3 bg-white/70 dark:bg-slate-800/60 placeholder-slate-500 dark:placeholder-slate-300 focus:bg-white dark:focus:bg-slate-900 transition-colors ease-in-out focus:outline-hidden border border-transparent focus:border-indigo-300 dark:focus:border-indigo-500"
                                />
                            </div>

                            <p className="text-xs mt-4 text-muted-foreground">
                                (images are not stored)
                            </p>
                        </>
                    )}
                </div>

                <input
                    type="file"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleInputChange}
                    accept="image/jpeg, image/png, image/gif, image/webp"
                />
            </div>

            {(isLoading || object?.description) && (
                <div className="mt-6 space-y-4 p-4 sm:p-5 rounded-2xl glass-subtle w-full">
                    <Section finished={finished} content={object?.description}>
                        Description
                    </Section>
                    <Section finished={finished} content={object?.text}>
                        Text
                    </Section>
                    {finished && object?.text && (
                        <button
                            onClick={copyBoth}
                            className="w-full lg:w-auto rounded-full px-5 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center gap-2 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.6)]"
                        >
                            <IconCopy className="size-4" /> Copy All
                        </button>
                    )}
                </div>
            )}
        </>
    );
}

function toBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result !== "string") return;
            resolve(reader.result);
        };
        reader.onerror = (error) => reject(error);
    });
}

function Section({
    children,
    content,
    finished,
}: {
    children: string;
    content?: string;
    finished: boolean;
}) {
    function copy() {
        navigator.clipboard.writeText(content || "");
        toast.success("Copied to clipboard");
    }

    const loading = !content && !finished;

    return (
        <div>
            {content && (
                <button
                    className="float-right rounded-full p-2 bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700 transition-colors ease-in-out"
                    onClick={copy}
                    aria-label="Copy to clipboard"
                >
                    <IconCopy className="size-4" />
                </button>
            )}
            <h2 className="font-semibold select-none text-muted-foreground">
                {children}
            </h2>

            {loading && (
                <div className="bg-white/70 dark:bg-slate-800/70 animate-pulse rounded-full w-full h-6" />
            )}
            {content && (
                <p className="whitespace-pre-wrap break-words text-foreground">
                    {content.trim()}
                </p>
            )}
            {finished && !content && (
                <p className="text-muted-foreground select-none">
                    No text was found in that image.
                </p>
            )}
        </div>
    );
}