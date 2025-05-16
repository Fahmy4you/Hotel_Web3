import { Input, Button } from "@heroui/react";
import { profileSchema } from "@/utils/zod";
import { z } from "zod";
import { useState } from "react";

interface Props {
  initialData: {
    nama_user: string;
    email: string;
    no_whatsapp: string;
  };
  onSubmit: (data: typeof profileSchema._type) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const ProfileForm = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading 
}: Props) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = profileSchema.parse(formData);
      await onSubmit(validatedData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errMap = err.flatten().fieldErrors;
        setErrors({
          nama_user: errMap.nama_user?.[0] || "",
          email: errMap.email?.[0] || "",
          no_whatsapp: errMap.no_whatsapp?.[0] || ""
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          label="Nama Lengkap"
          value={formData.nama_user}
          onChange={(e) => setFormData({...formData, nama_user: e.target.value})}
          className="w-full"
        />
        {errors.nama_user && <div className="text-red-500 text-sm">{errors.nama_user}</div>}

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full"
        />
        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}

        <Input
          label="Nomor WhatsApp"
          value={formData.no_whatsapp}
          onChange={(e) => setFormData({...formData, no_whatsapp: e.target.value})}
          className="w-full"
        />
        {errors.no_whatsapp && <div className="text-red-500 text-sm">{errors.no_whatsapp}</div>}
      </div>

      <div className="flex gap-3 mt-6">
        <Button 
          type="button" 
          variant="bordered" 
          onPress={onCancel}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          isLoading={isLoading}
        >
          Simpan
        </Button>
      </div>
    </form>
  );
};