import Store from './Store';

interface Promotion {
  id: string;

  name: string;

  description: string;

  coupon: string;

  link: string;

  store_id: string;

  store: Store;
}

export default Promotion;
