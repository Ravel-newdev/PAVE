import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/layout/components/ui/avatar";
import { Button } from "../ui/button";
import { useRef } from "react";

interface AvatarUploadProps {
  image?: string;
  onChange?: (file: File) => void;
}

export function AvatarUpload({
  image,
  onChange,
}: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelectFile() {
    inputRef.current?.click();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    onChange?.(file);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Avatar className="h-28 w-28 border">
        <AvatarImage src={image} />

        <AvatarFallback className="text-2xl">
          RC
        </AvatarFallback>
      </Avatar>

      <input
        ref={inputRef}
        hidden
        accept="image/png,image/jpeg"
        type="file"
        onChange={handleFileChange}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleSelectFile}
        className="gap-2"
      >
        <Camera className="h-4 w-4" />
        Alterar foto
      </Button>

      <p className="text-xs text-muted-foreground">
        JPG ou PNG até 5MB
      </p>
    </div>
  );
}