import React from 'react';

const WalletAddress = ({ address }: { address: string }) => {
  return (
    <div className="flex items-center">
      <span className="text-sm font-mono bg-[#301050] p-1 rounded">
        {address.substring(0, 6)}...{address.substring(address.length - 4)}
      </span>
    </div>
  );
};

export default WalletAddress;
