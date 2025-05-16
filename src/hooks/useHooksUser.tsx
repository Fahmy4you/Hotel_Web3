import { useCallback, useEffect, useState } from "react";
import { TypeGetMe } from "../../types/userData";
import { addToast } from "@heroui/react";

export const useHooksUser = () => {
  const [user, setUser] = useState<TypeGetMe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  // Fetch user data
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
      setError(null);
    } catch (error: any) {
      setError(error.message);
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

  // Edit user data
  const updateUser = useCallback(async (userData: {
    nama_user: string;
    email: string;
    no_whatsapp: string;
  }) => {
    try {
      setEditLoading(true);
      const response = await fetch(`/api/me/update-information/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      
      addToast({
        title: 'Success',
        description: 'Berhasil memperbarui profil',
        variant: 'flat',
        color: 'success',
      });

      return updatedUser;
    } catch (error: any) {
      setError(error.message);
      addToast({
        title: 'Error',
        description: error.message,
        variant: 'flat',
        color: 'danger',
      });
      throw error;
    } finally {
      setEditLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { 
    user, 
    error, 
    loading,
    editLoading,
    refetch: fetchUser, 
    updateUser 
  };
};