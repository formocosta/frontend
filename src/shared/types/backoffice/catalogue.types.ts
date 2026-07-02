export interface Categoria {
  id: string;
  nome: string;
  descricao?: string | null;
  icone?: string | null;
  activa: boolean;
  ordem?: number;
  subcategorias?: Subcategoria[];
  created_at?: string;
  updated_at?: string;
}

export interface Subcategoria {
  id: string;
  categoria_id: string;
  nome: string;
  descricao?: string | null;
  activa: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StoreCategoriaRequest {
  nome: string;
  descricao?: string;
  icone?: File;
  activa?: boolean;
  ordem?: number;
}

export interface UpdateCategoriaRequest {
  nome?: string;
  descricao?: string;
  icone?: File;
  activa?: boolean;
  ordem?: number;
}

export interface StoreSubcategoriaRequest {
  nome: string;
  descricao?: string;
  activa?: boolean;
}

export interface UpdateSubcategoriaRequest {
  nome?: string;
  descricao?: string;
  activa?: boolean;
}
