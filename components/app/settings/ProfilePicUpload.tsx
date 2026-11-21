"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone, type FileRejection } from "react-dropzone";
import {
    Camera,
    ImagePlus,
    Loader2,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import { authClient } from "@/utils/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/** Maximum raw file size accepted by the client (must match the API route). */
const MAX_FILE_SIZE = 4 * 1024 * 1024;

interface ProfilePictureUploadProps {
    imageUrl?: string | null;
    userName?: string;
    onImageChange?: (url: string | null) => void;
}

interface UploadResponse {
    url?: string;
    error?: string;
}

async function deleteStoredAvatar(url: string): Promise<void> {
    const response = await fetch("/api/profile/avatar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
    });

    if (!response.ok) {
        throw new Error("Failed to delete previous image.");
    }
}

export function ProfilePictureUpload({
    imageUrl,
    userName,
    onImageChange,
}: ProfilePictureUploadProps) {
    const router = useRouter();

    const [currentImage, setCurrentImage] = useState<string | null>(imageUrl ?? null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const isBusy = isSaving || isRemoving;

    // Keep the component in sync with fresh user data passed from the parent.
    useEffect(() => {
        setCurrentImage(imageUrl ?? null);
    }, [imageUrl]);

    // Generate and clean up the local blob-URL preview.
    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    // ── Dropzone ───────────────────────────────────────────────────────────────

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            setFeedback(null);

            if (rejectedFiles.length > 0) {
                const errorCode = rejectedFiles[0].errors[0]?.code;
                setFeedback({
                    type: "error",
                    message:
                        errorCode === "file-too-large"
                            ? "Your image must be smaller than 4 MB."
                            : "Please select a JPEG or PNG image.",
                });
                return;
            }

            if (acceptedFiles[0]) {
                setSelectedFile(acceptedFiles[0]);
            }
        },
        []
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
        },
        maxSize: MAX_FILE_SIZE,
        maxFiles: 1,
        multiple: false,
        disabled: isBusy,
    });

    // ── Upload ─────────────────────────────────────────────────────────────────

    const savePhoto = async () => {
        if (!selectedFile || isBusy) return;

        setIsSaving(true);
        setFeedback(null);

        const previousImage = currentImage;
        let uploadedUrl: string | null = null;

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const uploadResponse = await fetch("/api/profile/avatar", {
                method: "POST",
                body: formData,
            });

            const uploadData = (await uploadResponse.json()) as UploadResponse;

            if (!uploadResponse.ok || !uploadData.url) {
                throw new Error(uploadData.error ?? "Image upload failed.");
            }

            uploadedUrl = uploadData.url;

            // Update the BetterAuth user record.
            const { error } = await authClient.updateUser({ image: uploadedUrl });
            if (error) throw new Error(error.message);

            // Reflect the change in the UI.
            setCurrentImage(uploadedUrl);
            setSelectedFile(null);
            onImageChange?.(uploadedUrl);

            setFeedback({
                type: "success",
                message: "Profile picture updated successfully.",
            });

            router.refresh();

            // Clean up the old stored file after the new one is confirmed.
            if (previousImage && previousImage !== uploadedUrl) {
                await deleteStoredAvatar(previousImage).catch(() => {
                    setFeedback({
                        type: "success",
                        message: "Picture updated, but the previous file could not be removed.",
                    });
                });
            }
        } catch (error) {
            console.error("Profile picture upload failed:", error);

            // Roll back the orphaned upload if BetterAuth update failed.
            if (uploadedUrl) {
                await deleteStoredAvatar(uploadedUrl).catch(() => undefined);
            }

            setFeedback({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to save profile picture. Please try again.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    // ── Remove ─────────────────────────────────────────────────────────────────

    const removePhoto = async () => {
        if (!currentImage || isBusy) return;

        setIsRemoving(true);
        setFeedback(null);

        const previousImage = currentImage;

        try {
            const { error } = await authClient.updateUser({ image: null });
            if (error) throw new Error(error.message);

            setCurrentImage(null);
            setSelectedFile(null);
            onImageChange?.(null);

            setFeedback({
                type: "success",
                message: "Profile picture removed successfully.",
            });

            router.refresh();

            // Delete the stored file only after the database row is updated.
            await deleteStoredAvatar(previousImage).catch(() => {
                setFeedback({
                    type: "success",
                    message: "Picture removed, but the stored file could not be deleted.",
                });
            });
        } catch (error) {
            setFeedback({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to remove profile picture.",
            });
        } finally {
            setIsRemoving(false);
        }
    };

    // ── Derived values ─────────────────────────────────────────────────────────

    const initials =
        userName
            ?.trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase() || "U";

    const displayedImage = previewUrl ?? currentImage;

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <section className="w-full rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            {/* Current avatar + description */}
            <div className="flex items-center gap-4">
                <Avatar className="size-20 shrink-0 border border-border ring-4 ring-background">
                    <AvatarImage
                        src={displayedImage ?? undefined}
                        alt={userName ?? "Profile picture"}
                    />
                    <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">Profile picture</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Upload a picture to personalize your profile.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        JPG or PNG · Maximum size: 4 MB.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Images are automatically cropped, resized to 512&nbsp;×&nbsp;512,
                        and stored in the cloud.
                    </p>
                </div>
            </div>

            {/* Dropzone */}
            <div className="mt-6">
                <div
                    {...getRootProps({
                        className: [
                            "flex cursor-pointer flex-col items-center justify-center",
                            "rounded-xl border-2 border-dashed p-7 text-center transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            isDragActive
                                ? "border-primary bg-primary/5"
                                : "border-border bg-background hover:border-ring hover:bg-muted/40",
                            isBusy ? "cursor-not-allowed opacity-60" : "",
                        ]
                            .join(" ")
                            .trim(),
                    })}
                >
                    <input {...getInputProps()} />

                    <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {isDragActive ? (
                            <Upload className="size-6" />
                        ) : (
                            <ImagePlus className="size-6" />
                        )}
                    </div>

                    <p className="text-sm font-medium text-foreground">
                        {isDragActive ? "Drop your image here" : "Drag and drop your image here"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        or{" "}
                        <span className="font-medium text-primary">browse files</span>
                    </p>
                </div>
            </div>

            {/* Selected file pill */}
            {selectedFile && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 p-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <Camera className="size-5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {(selectedFile.size / 1024).toFixed(0)} KB
                            </p>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        disabled={isBusy}
                        onClick={() => setSelectedFile(null)}
                        aria-label="Cancel image selection"
                    >
                        <X className="size-4" />
                    </Button>
                </div>
            )}

            {/* Feedback message */}
            {feedback && (
                <p
                    role={feedback.type === "error" ? "alert" : "status"}
                    className={`mt-4 text-sm ${feedback.type === "error" ? "text-destructive" : "text-primary"}`}
                >
                    {feedback.message}
                </p>
            )}

            {/* Action buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
                {selectedFile && (
                    <>
                        <Button
                            type="button"
                            onClick={savePhoto}
                            disabled={isBusy}
                            className="gap-2"
                        >
                            {isSaving ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Upload className="size-4" />
                            )}
                            {isSaving ? "Uploading…" : "Save picture"}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={isBusy}
                            onClick={() => setSelectedFile(null)}
                        >
                            Cancel
                        </Button>
                    </>
                )}

                {!selectedFile && currentImage && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={removePhoto}
                        disabled={isBusy}
                        className="gap-2 text-destructive hover:text-destructive"
                    >
                        {isRemoving ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Trash2 className="size-4" />
                        )}
                        {isRemoving ? "Removing…" : "Remove picture"}
                    </Button>
                )}
            </div>
        </section>
    );
}
