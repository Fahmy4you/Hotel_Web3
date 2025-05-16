import React, { useState } from 'react';

const SettingBahasaSection = () => {
  // State untuk pengaturan bahasa
  const [settings, setSettings] = useState({
    language: 'id', // Default bahasa Indonesia
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '12h',
  });

  // Handler untuk perubahan bahasa
  const handleLanguageChange = (language) => {
    setSettings(prev => ({
      ...prev,
      language
    }));
  };

  // Handler untuk perubahan format tanggal
  const handleDateFormatChange = (e) => {
    setSettings(prev => ({
      ...prev,
      dateFormat: e.target.value
    }));
  };

  // Handler untuk perubahan format waktu
  const handleTimeFormatChange = (value) => {
    setSettings(prev => ({
      ...prev,
      timeFormat: value
    }));
  };

  // Data bahasa
  const languages = [
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  // Data format tanggal
  const dateFormats = [
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY', example: '15/05/2025' },
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY', example: '05/15/2025' },
    { value: 'yyyy/MM/dd', label: 'YYYY/MM/DD', example: '2025/05/15' },
    { value: 'dd-MM-yyyy', label: 'DD-MM-YYYY', example: '15-05-2025' },
  ];

  return (
    <div className="p-6 dark:bg-neutral-800 bg-white rounded-lg shadow-sm border dark:border-neutral-700 border-gray-200">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pengaturan Bahasa</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sesuaikan bahasa dan format tanggal/waktu sesuai preferensi Anda
          </p>
        </div>

        {/* Settings Content */}
        <div className="space-y-8">
          {/* Language Setting */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
              </svg>
              Bahasa
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {languages.map((lang) => (
                <div 
                  key={lang.code}
                  className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-200 flex items-center space-x-3
                    ${settings.language === lang.code 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                    }`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <div className="text-2xl">{lang.flag}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{lang.name}</div>
                  </div>
                  {settings.language === lang.code && (
                    <div className="flex-shrink-0 h-5 w-5 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Date Format Setting */}
          <div className="space-y-4 border-t dark:border-neutral-700 pt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Format Tanggal
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dateFormats.map((format) => (
                  <div 
                    key={format.value}
                    className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-200
                      ${settings.dateFormat === format.value 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                      }`}
                  >
                    <input 
                      type="radio" 
                      id={`date-format-${format.value}`}
                      name="dateFormat"
                      value={format.value}
                      className="sr-only"
                      checked={settings.dateFormat === format.value}
                      onChange={handleDateFormatChange}
                    />
                    <label 
                      htmlFor={`date-format-${format.value}`}
                      className="w-full h-full cursor-pointer flex flex-col"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white mb-1">{format.label}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Contoh: {format.example}</span>
                    </label>
                    {settings.dateFormat === format.value && (
                      <div className="absolute top-2 right-2 flex-shrink-0 h-4 w-4 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Time Format Setting */}
          <div className="space-y-4 border-t dark:border-neutral-700 pt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Format Waktu
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div 
                  className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all duration-200 text-center
                    ${settings.timeFormat === '12h' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                    }`}
                  onClick={() => handleTimeFormatChange('12h')}
                >
                  <div className="text-lg font-medium text-gray-900 dark:text-white mb-1">12 Jam</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">2:30 PM</div>
                  {settings.timeFormat === '12h' && (
                    <div className="absolute top-2 right-2 flex-shrink-0 h-4 w-4 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all duration-200 text-center
                    ${settings.timeFormat === '24h' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                    }`}
                  onClick={() => handleTimeFormatChange('24h')}
                >
                  <div className="text-lg font-medium text-gray-900 dark:text-white mb-1">24 Jam</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">14:30</div>
                  {settings.timeFormat === '24h' && (
                    <div className="absolute top-2 right-2 flex-shrink-0 h-4 w-4 text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Region and Timezone Setting */}
          <div className="space-y-4 border-t dark:border-neutral-700 pt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Wilayah dan Zona Waktu
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Region select */}
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Wilayah
                  </label>
                  <select
                    id="region"
                    name="region"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-600 
                      bg-white dark:bg-neutral-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="id">Indonesia</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="au">Australia</option>
                    <option value="jp">Japan</option>
                    <option value="sg">Singapore</option>
                  </select>
                </div>
                
                {/* Timezone select */}
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Zona Waktu
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-neutral-600 
                      bg-white dark:bg-neutral-700 text-gray-900 dark:text-white
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="asia/jakarta">Asia/Jakarta (WIB)</option>
                    <option value="asia/makassar">Asia/Makassar (WITA)</option>
                    <option value="asia/jayapura">Asia/Jayapura (WIT)</option>
                    <option value="asia/singapore">Asia/Singapore</option>
                    <option value="asia/tokyo">Asia/Tokyo</option>
                    <option value="australia/sydney">Australia/Sydney</option>
                    <option value="europe/london">Europe/London</option>
                    <option value="america/new_york">America/New York</option>
                    <option value="america/los_angeles">America/Los Angeles</option>
                  </select>
                </div>
              </div>
              
              {/* Current time preview */}
              <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-4 border border-gray-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900 dark:text-white">Waktu Saat Ini</div>
                  <div className="text-gray-700 dark:text-gray-300">
                    {settings.timeFormat === '12h' ? '2:30 PM' : '14:30'}, {
                      dateFormats.find(format => format.value === settings.dateFormat)?.example
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="pt-4 flex justify-end">
            <button
              className="px-6 py-2.5 bg-neutral-800 dark:bg-white dark:text-neutral-800 text-white font-medium rounded-lg shadow-sm hover:bg-neutral-900 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 transition-all duration-200"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingBahasaSection;