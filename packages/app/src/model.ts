// src/model.ts

export interface DesiProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
  }
  
  export interface Model {
    products?: DesiProduct[];
  }
  
  export const init: Model = {};
  