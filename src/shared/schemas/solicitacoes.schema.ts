import { z } from "zod";

export const encaminharSolicitacaoSchema = z.object({
  prestador_servico_id: z
    .string()
    .min(1, "Selecione um prestador para encaminhar"),
});

export type EncaminharSolicitacaoFormData = z.infer<typeof encaminharSolicitacaoSchema>;
