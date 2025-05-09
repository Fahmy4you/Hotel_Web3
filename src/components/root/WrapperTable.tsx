import React from 'react'

const WrapperTable = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full dark:bg-black-50 bg-gray-100 rounded-lg shadow-lg overflow-hidden transition-colors">
    {children}
    </div>
  )
}

export default WrapperTable