'use client'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../libs/store'
import { ArrowRight, Wallet, CreditCard, PlusCircle, Copy, ChevronDown, RefreshCw } from 'lucide-react'

const TopUpPage = () => {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  
  const presetAmounts = [100000, 500000, 1000000, 5000000];
  const paymentMethods = [
    { id: 'bank', name: 'Bank Transfer', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'wallet', name: 'Digital Wallet', icon: <Wallet className="w-5 h-5" /> },
  ];

interface AmountChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

const handleAmountChange = (e: AmountChangeEvent): void => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
};

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
        .format(value)
        .replace(/\s/g, '')
        .replace('Rp', '');
};

interface PaymentMethod {
    id: string;
    name: string;
    icon: React.JSX.Element;
}

const handleSelectPaymentMethod = (methodId: PaymentMethod['id']): void => {
    setPaymentMethod(methodId);
    setShowPaymentMethods(false);
};

  const mainBg = darkMode ? 'bg-black-100' : 'bg-gray-100';
  const cardBg = darkMode ? 'bg-black-50' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const secondaryTextColor = darkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const highlightBg = darkMode ? 'bg-blue-900/30' : 'bg-blue-50';
  const buttonBg = 'bg-blue-600 hover:bg-blue-700';
  const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-100';

  return (
    <div className={`${mainBg} min-h-screen rounded-lg transition-all duration-300`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-2xl font-bold mb-8 ${textColor}`}>Recharge Wallet</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={`${cardBg} rounded-xl p-6 shadow-sm ${borderColor} border`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`text-lg font-medium ${textColor}`}>Your Wallet</h2>
                <button className={`${secondaryTextColor} hover:text-blue-500 flex items-center gap-1 text-sm`}>
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>
              
              <div className={`flex items-center gap-3 ${highlightBg} p-4 rounded-lg`}>
                <div className="bg-blue-600 p-3 rounded-full">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-sm ${secondaryTextColor}`}>IDRX Balance</p>
                  <p className={`text-2xl font-bold ${textColor}`}>Rp 2,500,000</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center">
                <p className={`text-xs ${secondaryTextColor} flex items-center gap-1`}>
                  Wallet Address: 0x1a2b...3c4d 
                  <button><Copy className="w-3 h-3" /></button>
                </p>
              </div>
            </div>

            <div className={`${cardBg} rounded-xl p-6 shadow-sm ${borderColor} border`}>
              <h2 className={`text-lg font-medium mb-6 ${textColor}`}>Top Up IDRX</h2>
              
              <div className="mb-6">
                <label className={`block mb-2 text-sm font-medium ${secondaryTextColor}`}>
                  Enter Amount
                </label>
                <div className={`relative rounded-lg ${inputBg} overflow-hidden`}>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <span className={`text-lg ${secondaryTextColor}`}>Rp</span>
                  </div>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    className={`w-full py-4 pl-12 pr-4 text-lg font-medium outline-none ${inputBg} ${textColor}`}
                    placeholder="0"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      className={`py-2 px-3 rounded-lg text-sm border ${
                        amount === preset.toString() 
                          ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                          : `${borderColor} ${secondaryTextColor} hover:border-blue-500 hover:text-blue-500`
                      }`}
                    >
                      {formatCurrency(preset)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6 relative">
                <label className={`block mb-2 text-sm font-medium ${secondaryTextColor}`}>
                  Payment Method
                </label>
                <button
                  onClick={() => setShowPaymentMethods(!showPaymentMethods)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border ${borderColor} ${textColor}`}
                >
                  {paymentMethod ? (
                    <div className="flex items-center gap-2">
                      {paymentMethods.find(m => m.id === paymentMethod)?.icon}
                      <span>{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
                    </div>
                  ) : (
                    <span className={secondaryTextColor}>Select payment method</span>
                  )}
                  <ChevronDown className={`w-5 h-5 ${secondaryTextColor} transition-transform ${showPaymentMethods ? 'rotate-180' : ''}`} />
                </button>
                
                {showPaymentMethods && (
                  <div className={`absolute z-10 mt-1 w-full rounded-lg shadow-lg ${cardBg} border ${borderColor} overflow-hidden`}>
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => handleSelectPaymentMethod(method.id)}
                        className={`w-full flex items-center gap-2 p-4 hover:bg-blue-500/10 ${textColor} ${paymentMethod === method.id ? 'bg-blue-500/10 text-blue-500' : ''}`}
                      >
                        {method.icon}
                        <span>{method.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                className={`w-full py-4 px-6 rounded-lg ${buttonBg} text-white font-medium flex items-center justify-center gap-2 ${(!amount || !paymentMethod) ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!amount || !paymentMethod}
              >
                Continue to Payment <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <div className={`${cardBg} rounded-xl p-6 shadow-sm ${borderColor} border`}>
              <h2 className={`text-lg font-medium mb-4 ${textColor}`}>Transaction Summary</h2>
              
              <div className={`space-y-4 ${secondaryTextColor}`}>
                <div className="flex justify-between items-center">
                  <span>Amount</span>
                  <span className={textColor}>{amount ? `Rp ${formatCurrency(Number(amount))}` : '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Service Fee</span>
                  <span className={textColor}>{amount ? 'Rp 0' : '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Processing Fee</span>
                  <span className={textColor}>{amount ? 'Rp 0' : '-'}</span>
                </div>
                <div className="border-t pt-4 mt-4 border-dashed border-gray-300">
                  <div className="flex justify-between items-center font-medium">
                    <span className={textColor}>Total</span>
                    <span className="text-lg font-bold text-blue-500">
                      {amount ? `Rp ${formatCurrency(Number(amount))}` : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${cardBg} rounded-xl p-6 shadow-sm ${borderColor} border`}>
              <h2 className={`text-md font-medium mb-2 ${textColor}`}>Need Help?</h2>
              <p className={`text-sm ${secondaryTextColor} mb-4`}>
                If you're having trouble with your transaction, contact our support team.
              </p>
              <button className={`text-blue-500 text-sm font-medium flex items-center gap-1`}>
                Contact Support <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopUpPage