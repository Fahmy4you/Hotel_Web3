import { useState } from 'react';
import { MessageSquare, HelpCircle, FileText, Send, ChevronRight, ExternalLink, Users } from 'lucide-react';

export default function BantuanPage() {
  const [activeTab, setActiveTab] = useState('pengaduan');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    subject: '',
    message: '',
    priority: 'normal',
    attachment: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormValues({
        subject: '',
        message: '',
        priority: 'normal',
        attachment: null
      });
      alert('Pengaduan berhasil dikirim ke admin!');
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="flex items-center mb-8">
        <div className="mr-2 bg-blue-600 rounded-lg p-2">
          <MessageSquare size={24} />
        </div>
        <h1 className="text-2xl font-bold">Bantuan</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        <button 
          onClick={() => setActiveTab('pengaduan')}
          className={`px-4 py-3 font-medium ${activeTab === 'pengaduan' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
        >
          Laporankan Bug
        </button>
        <button 
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-3 font-medium ${activeTab === 'faq' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
        >
          FAQ
        </button>
        <button 
          onClick={() => setActiveTab('panduan')}
          className={`px-4 py-3 font-medium ${activeTab === 'panduan' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
        >
          Panduan Penggunaan
        </button>
        <button 
          onClick={() => setActiveTab('kontak')}
          className={`px-4 py-3 font-medium ${activeTab === 'kontak' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
        >
          Kontak Support
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-gray-800 rounded-lg p-6">
        {activeTab === 'pengaduan' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Pengaduan ke Admin</h2>
              <div className="text-sm text-gray-400">
                Respon dalam 24 jam
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Subjek Pengaduan</label>
                <input 
                  type="text"
                  name="subject"
                  value={formValues.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan subjek pengaduan"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Deskripsi Masalah</label>
                <textarea 
                  name="message"
                  value={formValues.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jelaskan masalah yang Anda alami..."
                  required
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Lampiran (Opsional)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG, PDF (Maks. 10MB)</p>
                    </div>
                    <input id="file-upload" type="file" className="hidden" />
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Kirim Pengaduan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-8 border-t border-gray-700 pt-6">
              <h3 className="text-lg font-medium mb-4">Riwayat Pengaduan</h3>
              
              {/* List of previous complaints */}
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Masalah dengan Booking #123456</h4>
                      <span className="text-sm text-gray-400">2 hari yang lalu</span>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-green-900 text-green-400 rounded">Selesai</span>
                  </div>
                  <p className="mt-2 text-gray-300 text-sm">
                    Booking yang sudah dikonfirmasi tidak muncul di dashboard...
                  </p>
                  <button className="mt-3 text-blue-400 text-sm flex items-center">
                    <span>Lihat Detail</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Data laporan hilang</h4>
                      <span className="text-sm text-gray-400">1 minggu yang lalu</span>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-900 text-yellow-400 rounded">Dalam Proses</span>
                  </div>
                  <p className="mt-2 text-gray-300 text-sm">
                    Laporan pendapatan untuk bulan April tidak bisa diakses...
                  </p>
                  <button className="mt-3 text-blue-400 text-sm flex items-center">
                    <span>Lihat Detail</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'faq' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Pertanyaan yang Sering Ditanyakan</h2>
            
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-2">Bagaimana cara menambahkan kamar baru?</h3>
                <p className="text-gray-300">
                  Anda dapat menambahkan kamar baru melalui menu "Tambah Kamar" di dashboard. 
                  Lengkapi semua informasi yang diperlukan seperti tipe kamar, harga, dan fasilitas.
                </p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-2">Bagaimana cara mengubah status booking?</h3>
                <p className="text-gray-300">
                  Untuk mengubah status booking, buka detail booking yang ingin diubah, 
                  kemudian pilih status yang baru pada dropdown yang tersedia.
                </p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-2">Apakah saya bisa mengelola beberapa hotel?</h3>
                <p className="text-gray-300">
                  Ya, anda dapat mengelola multiple hotel dengan satu akun. 
                  Untuk menambahkan hotel baru, buka menu "Pengaturan" dan pilih "Tambah Property".
                </p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-2">Kapan laporan keuangan diperbarui?</h3>
                <p className="text-gray-300">
                  Laporan keuangan diperbarui secara real-time untuk setiap transaksi yang terjadi. 
                  Untuk laporan bulanan, sistem akan menghasilkan laporan pada hari pertama bulan berikutnya.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'panduan' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Panduan Penggunaan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-900 p-2 rounded-lg mr-3">
                    <FileText size={20} className="text-blue-400" />
                  </div>
                  <h3 className="font-medium">Panduan Dasar</h3>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Pelajari fitur-fitur dasar FK Hotel Web3 dan cara menggunakannya.
                </p>
                <a href="#" className="text-blue-400 text-sm flex items-center">
                  <span>Baca Panduan</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-900 p-2 rounded-lg mr-3">
                    <Users size={20} className="text-purple-400" />
                  </div>
                  <h3 className="font-medium">Pengelolaan Staff</h3>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Cara mengelola akun dan hak akses untuk staff hotel Anda.
                </p>
                <a href="#" className="text-blue-400 text-sm flex items-center">
                  <span>Baca Panduan</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="bg-green-900 p-2 rounded-lg mr-3">
                    <HelpCircle size={20} className="text-green-400" />
                  </div>
                  <h3 className="font-medium">Tutorial Booking</h3>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Pelajari cara mengelola booking dan reservasi pada sistem.
                </p>
                <a href="#" className="text-blue-400 text-sm flex items-center">
                  <span>Tonton Video</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="bg-orange-900 p-2 rounded-lg mr-3">
                    <FileText size={20} className="text-orange-400" />
                  </div>
                  <h3 className="font-medium">Manajemen Keuangan</h3>
                </div>
                <p className="text-gray-300 text-sm mb-3">
                  Cara menggunakan fitur laporan dan analisis keuangan.
                </p>
                <a href="#" className="text-blue-400 text-sm flex items-center">
                  <span>Baca Panduan</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'kontak' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Kontak Support</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-4">Tim Support</h3>
                <p className="text-gray-300 mb-4">
                  Kami siap membantu Anda 24/7 dengan permasalahan teknis maupun pertanyaan umum.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center mr-3">
                      <MessageSquare size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-gray-400 text-sm">Respon dalam 5 menit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-gray-400 text-sm">support@fkhotel.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Telepon</p>
                      <p className="text-gray-400 text-sm">+62 812-3456-7890</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-4">Jam Operasional</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Senin - Jumat</span>
                    <span className="font-medium">08:00 - 20:00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sabtu</span>
                    <span className="font-medium">09:00 - 17:00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Minggu & Hari Libur</span>
                    <span className="font-medium">09:00 - 15:00 WIB</span>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-green-400">Support Emergency 24/7</span> tersedia untuk masalah kritis yang mempengaruhi operasional hotel Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}