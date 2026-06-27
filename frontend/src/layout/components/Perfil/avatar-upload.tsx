import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/layout/components/ui/avatar";
import { Button } from "../ui/button";
import { useRef } from "react";

interface AvatarUploadProps {
  image?: string;
  initials?: string;
  uploading?: boolean;
  onChange?: (file: File) => void;
}

export function AvatarUpload({
  image,
  initials = "?",
  uploading = false,
  onChange,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    onChange?.(file);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar className="h-28 w-28 border">
          <AvatarImage src={image} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Loader2 className="h-7 w-7 text-white animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        hidden
        accept="image/png,image/jpeg,image/webp"
        type="file"
        onChange={handleFileChange}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="gap-2"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
        {uploading ? "Enviando..." : "Alterar foto"}
      </Button>

      <p className="text-xs text-muted-foreground">
        JPG, PNG ou WebP até 5 MB
      </p>
    </div>
  );
}
