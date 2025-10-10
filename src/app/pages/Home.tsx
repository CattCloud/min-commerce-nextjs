import ProductList from '../components/ProductList';
import { products } from '../data/products'; 


const HomePage: React.FC = () => {
  return (
    <div className="pt-4">
      <h2 className="text-xl font-extrabold text-text-inverse text-start px-4">
        Catálogo de Productos
      </h2>
      <ProductList products={products} />
    </div>
  );
};

export default HomePage;
