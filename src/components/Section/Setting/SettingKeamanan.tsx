import { useState } from "react";
import { Shield, Lock, Mail, Phone, Check, AlertCircle } from "lucide-react";
import Link from "next/link";

const SettingKeamanan = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [whatsappVerified, setWhatsappVerified] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div className="p-6 h-full bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg shadow-lg">
      <header className="mb-8 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="text-neutral-900 dark:text-white" size={24} />
          Pengaturan Keamanan Akun
        </h2>
      </header>
      
      {/* Two-Factor & Verification Section */}
      <div className="space-y-4">
        {/* Email Verification */}
        <div className="dark:bg-black-50 bg-gray-50 p-6 rounded-lg shadow transition-all duration-300">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Mail className="text-neutral-900 dark:text-white" size={20} />
            Verifikasi Email
          </h3>
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 dark:text-gray-300 mb-2">user@example.com</p>
              <p className="text-sm text-gray-400">
                {emailVerified 
                  ? "Email telah terverifikasi" 
                  : "Verifikasi email untuk keamanan akun"}
              </p>
            </div>
            
            {emailVerified ? (
              <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                <Check size={16} />
                Terverifikasi
              </span>
            ) : (
              <button className="bg-neutral-900 font-semibold dark:bg-white dark:hover:bg-gray-300 dark:text-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded text-sm transition-colors duration-300">
                <Link href="/verification/email">Verifikasi Sekarang</Link>
              </button>
            )}
          </div>
        </div>

        {/* WhatsApp Verification */}
        <div className="dark:bg-black-50 bg-gray-50 p-6 rounded-lg shadow transition-all duration-300">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Phone className="text-neutral-900 dark:text-white" size={20} />
            Verifikasi Nomor WhatsApp
          </h3>
          
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-300 mb-2">+62 812-3456-7890</p>
              <p className="text-gray-400 dark:text-gray-300 text-sm">
                {whatsappVerified 
                  ? "Nomor WhatsApp telah terverifikasi" 
                  : "Verifikasi nomor untuk pemulihan akun"}
              </p>
            </div>
            
            {whatsappVerified ? (
              <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                <Check size={16} />
                Terverifikasi
              </span>
            ) : (
              <button className="bg-neutral-900 font-semibold dark:bg-white dark:hover:bg-gray-300 dark:text-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded text-sm transition-colors duration-300">
                <Link href={"/verification/whatsApp"}>Verifikasi Sekarang</Link>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="mt-8 p-4 dark:bg-black-50 bg-gray-50 transition-all duration-300 border dark:border-neutral-700 border-gray-200 rounded flex items-start gap-3">
        <AlertCircle className="text-neutral-900 dark:text-white mt-1" size={20} />
        <div>
          <h4 className="font-medium mb-1">Tips Keamanan</h4>
          <p className="text-sm text-gray-400 dark:text-gray-300">
            Untuk keamanan optimal, gunakan password yang kuat, verifikasi email dan nomor WhatsApp Anda, serta aktifkan autentikasi dua faktor.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SettingKeamanan;