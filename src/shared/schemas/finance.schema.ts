import { z } from "zod";

export const criarCategoriaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Máximo 100 caracteres"),
  descricao: z.string().max(300, "Máximo 300 caracteres").optional(),
  activa: z.boolean().optional().default(true),
  ordem: z.number().int().optional().default(0),
  icone: z.any().optional(),
});

export type CriarCategoriaFormData = z.infer<typeof criarCategoriaSchema>;

export const criarSubcategoriaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Máximo 100 caracteres"),
  descricao: z.string().max(300, "Máximo 300 caracteres").optional(),
});

export type CriarSubcategoriaFormData = z.infer<typeof criarSubcategoriaSchema>;

export const processarRepasseSchema = z.object({
  referencia_repasse: z.string().min(1, "Referência é obrigatória").max(100, "Máximo 100 caracteres"),
  iban_destino: z.string().max(34, "Máximo 34 caracteres").optional(),
});

export type ProcessarRepasseFormData = z.infer<typeof processarRepasseSchema>;

export const confirmarPagamentoSchema = z.object({
  referencia_externa: z.string().max(100, "Máximo 100 caracteres").optional(),
});

export type ConfirmarPagamentoFormData = z.infer<typeof confirmarPagamentoSchema>;
