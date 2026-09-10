import { z } from 'zod';

export const criarUtilizadorSchema = z.object({
  nome_completo: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Introduza um e-mail válido'),
  telefone: z.string().min(9, 'O telefone deve ter pelo menos 9 dígitos'),
  password: z.string().min(6, 'A palavra-passe deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'operador']),
  status: z.enum(['activo', 'inactivo', 'suspenso']),
});

export const actualizarUtilizadorSchema = z.object({
  nome_completo: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').optional(),
  email: z.string().email('Introduza um e-mail válido').optional(),
  telefone: z.string().min(9, 'O telefone deve ter pelo menos 9 dígitos').optional(),
  password: z.string().min(6, 'A palavra-passe deve ter pelo menos 6 caracteres').optional().or(z.literal('')),
  role: z.enum(['admin', 'operador']).optional(),
  status: z.enum(['activo', 'inactivo', 'suspenso']).optional(),
});

export type CriarUtilizadorFormData = z.infer<typeof criarUtilizadorSchema>;
export type ActualizarUtilizadorFormData = z.infer<typeof actualizarUtilizadorSchema>;
