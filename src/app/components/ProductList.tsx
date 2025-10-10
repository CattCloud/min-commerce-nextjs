"use client"
import type { Product } from '../models/products';
import ProductCard from './ProductCard'; 

interface ProductListProps {
  products: Product[]; 
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {

  const gridClasses = `
    grid 
    grid-cols-1 
    sm:grid-cols-2 
    lg:grid-cols-3 
    xl:grid-cols-4 
    gap-8 p-4
  `;

  if (products.length === 0) {
    return (
      <div className="text-center text-text-secondary mt-12">
        No hay productos disponibles en este momento.
      </div>
    );
  }

  return (
    <div className={gridClasses}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
        />
      ))}
    </div>
  );
};

export default ProductList;