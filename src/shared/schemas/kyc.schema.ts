import { z } from "zod";

export const rejeitarCandidaturaSchema = z.object({
  motivo_rejeicao: z
    .string()
    .min(1, "O motivo da rejeição é obrigatório")
    .max(500, "O motivo não pode exceder 500 caracteres"),
});

export type RejeitarCandidaturaFormData = z.infer<typeof rejeitarCandidaturaSchema>;

export const notasCandidaturaSchema = z.object({
  nota_operador: z
    .string()
    .min(1, "A nota é obrigatória")
    .max(1000, "A nota não pode exceder 1000 caracteres"),
});

export type NotasCandidaturaFormData = z.infer<typeof notasCandidaturaSchema>;

export const agendarEntrevistaSchema = z.object({
  tipo: z.enum(["video_chamada", "presencial"], {
    message: "Selecione o tipo de entrevista",
  }),
  agendada_para: z
    .string()
    .min(1, "A data da entrevista é obrigatória")
    .transform((val) => {
      // datetime-local gives "2026-07-17T14:00" — append :00 seconds if missing
      if (val && val.length === 16) return val + ':00';
      return val;
    }),
  link_video: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.tipo === 'video_chamada') {
    if (!data.link_video || data.link_video.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'O link de videochamada é obrigatório para entrevistas por vídeo.',
        path: ['link_video'],
      });
    } else {
      try {
        new URL(data.link_video);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Insira uma URL válida (ex: https://meet.google.com/...).',
          path: ['link_video'],
        });
      }
    }
  }
});

export type AgendarEntrevistaFormData = z.infer<typeof agendarEntrevistaSchema>;

export const atualizarEntrevistaSchema = z.object({
  status: z.enum(["agendada", "realizada", "cancelada", "nao_compareceu", "faltou"]).optional(),
  resultado: z.enum(["aprovado", "reprovado", "inconclusivo"]).optional(),
  notas: z.string().max(500, "As notas não podem exceder 500 caracteres").optional(),
  realizada_em: z.string().optional(),
});

export type AtualizarEntrevistaFormData = z.infer<typeof atualizarEntrevistaSchema>;

export const rejeitarDocumentoSchema = z.object({
  motivo: z
    .string()
    .min(1, "O motivo da rejeição é obrigatório")
    .max(300, "O motivo não pode exceder 300 caracteres"),
});

export type RejeitarDocumentoFormData = z.infer<typeof rejeitarDocumentoSchema>;
