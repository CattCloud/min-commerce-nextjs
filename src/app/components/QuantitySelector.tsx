"use client"
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onUpdate: (newQuantity: number) => void;
  minQuantity?: number; 
}


const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  onUpdate, 
  minQuantity = 1 
}) => {
  
  const handleDecrement = () => {
    if (quantity > minQuantity) {
      onUpdate(quantity - 1);
    }
  };

  const handleIncrement = () => {
    onUpdate(quantity + 1);
  };

  const buttonClasses = "cursor-pointer p-2 rounded-full text-text-light bg-bg-hover hover:bg-bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center space-x-2 border border-border-default rounded-full p-1">
      
      {/* Botón Disminuir */}
      <button 
        onClick={handleDecrement}
        disabled={quantity <= minQuantity}
        className={buttonClasses}
        aria-label="Disminuir cantidad"
      >
        <Minus size={16} />
      </button>

      {/* Cantidad Actual */}
      <span className="text-text-primary text-lg font-semibold w-6 text-center">
        {quantity}
      </span>

      {/* Botón Aumentar */}
      <button 
        onClick={handleIncrement}
        className={buttonClasses}
        aria-label="Aumentar cantidad"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;
