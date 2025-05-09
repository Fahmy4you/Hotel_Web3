import React from 'react'
import { IconType } from 'react-icons'

interface InfoCardProps {
  title: string
  value: string | number
  icon: IconType
  iconClassName?: string
  anotherInfo: string
  type: 'success' | 'warning' | 'error'
}

const InfoCard = ({ title, value, icon: Icon, iconClassName = '', anotherInfo, type }: InfoCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl dark:bg-[#1A1A1D] shadow-sm border dark:border-gray-800 border-gray-100 flex items-start">
      <div className="mr-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <Icon className={iconClassName} size={24} />
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        {type === 'success' && <p className="text-green-500 text-sm font-medium">{anotherInfo}</p>}
        {type === 'warning' && <p className="text-yellow-500 text-sm font-medium">{anotherInfo}</p>}
        {type === 'error' && <p className="text-red-500 text-sm font-medium">{anotherInfo}</p>}
      </div>
    </div>
  )
}

export default InfoCard
