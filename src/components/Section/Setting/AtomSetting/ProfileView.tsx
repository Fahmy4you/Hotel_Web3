import { Button } from "@heroui/react";
import { formatDateWithDay } from "@/utils/dateFormater";
import { TypeGetMe } from "../../../../../types/userData";
import { FaPencil } from "react-icons/fa6";

interface Props {
  user: TypeGetMe;
  onEdit: () => void;
}

export const ProfileView = ({ user, onEdit }: Props) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-500">Nama Lengkap</p>
        <p className="text-lg font-medium">{user.nama_user}</p>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Email</p>
        <p className="text-lg font-medium">{user.email}</p>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">WhatsApp</p>
        <p className="text-lg font-medium">{user.no_wa || "-"}</p>
      </div>
      
      <div>
        <p className="text-sm text-gray-500">Bergabung Pada</p>
        <p className="text-lg font-medium">
          {formatDateWithDay(user.join_date)}
        </p>
      </div>
    </div>

    <Button 
      onPress={onEdit}
      className="mt-6"
      startContent={<FaPencil className="h-4 w-4" />}
    >
      Edit Profil
    </Button>
  </div>
);