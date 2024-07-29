export interface UnitI {
  _id?: string;
  name: string;
  description: string;
}

export interface BasicIngredientI {
  _id?: string;
  name: string;
}

export interface IngredientI {
  _id: string;
  name: BasicIngredientI;
  quantity: number;
  unit: UnitI;
}

export interface RecipeI {
  _id: string;
  title: string;
  description: string;
  ingredients: IngredientI[];
}
