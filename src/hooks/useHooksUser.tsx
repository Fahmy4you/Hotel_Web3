import { useCallback, useEffect, useState } from "react";
import { TypeGetMe } from "../../types/userData";
import { addToast } from "@heroui/react";
import { userSchema, UserFormData } from "@/utils/zod";

export const useHooksUser = () => {
  const [user, setUser] = useState<TypeGetMe | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/me');
      const userData = await response.json();

      if (!response.ok) {
        throw new Error(userData.message || "Failed to fetch user");
      }

      if (!userData.wallet_address) {
        throw new Error("Invalid user data structure");
      }

      setUser(userData);
      setError({});
    } catch (error: any) {
      addToast({
        title: 'Error',
        description: error.message,
        variant: 'flat',
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (sendFormData: UserFormData) => {
    try {
      setEditLoading(true);
      const validated = userSchema.safeParse(sendFormData);

      if (!validated.success) {
        const errors = validated.error.flatten().fieldErrors;
        const errorMessages: { [key: string]: string } = {};
        for (const [field, messages] of Object.entries(errors)) {
          errorMessages[field] = messages.join(', ');
        }
        setError(errorMessages);
        return;
      }

      if (isEdit) {
        const formData = new FormData();
        formData.append('nama_user', sendFormData.nama_user);
        formData.append('email', sendFormData.email);
        formData.append('no_whatsapp', sendFormData.no_whatsapp);

        const response = await fetch(`/api/me/update-information/${user?.id}`, {
          method: 'PUT',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update profile');
        }
      }

      setIsEdit(false);
      await fetchUser();

      addToast({
        title: 'Success',
        description: 'Berhasil memperbarui profil',
        variant: 'flat',
        color: 'success',
      });

      return user;
    } catch (err: any) {
      const errorMessage = err.message || 'Terjadi kesalahan saat memperbarui profil';
      addToast({
        title: 'Error',
        description: errorMessage,
        variant: 'flat',
        color: 'danger',
      });
      throw new Error(errorMessage);
    } finally {
      setEditLoading(false);
    }
  }, [user?.id, fetchUser, isEdit]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    error,
    loading,
    editLoading,
    setIsEdit,
    refetch: fetchUser,
    updateUser,
    isEdit,
  };
};