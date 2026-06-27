export interface Notificacao {
  id: string;
  usuario_id: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  criado_em: string;
}

/** Tipo visual de notificação para o dashboard do professor. */
export type TipoNotificacaoProfessor = "candidatura" | "novo_projeto" | "resultado";

/** View-model de notificação para listagem no dashboard. */
export interface NotificacaoResumo {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: TipoNotificacaoProfessor;
  dataFormatada: string;
}
