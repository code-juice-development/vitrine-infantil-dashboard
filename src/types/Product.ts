import Category from './Category';
import Store from './Store';

interface Product {
  id: string;

  name: string;

  description: string;

  image: string;

  link: string;

  price: number;

  size: string;

  color: string;

  gender: string;

  category_id: string;

  category: Category;

  store_id: string;

  store: Store;
}

export default Product;
