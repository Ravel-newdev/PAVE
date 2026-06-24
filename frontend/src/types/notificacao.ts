export type TipoNotificacao =
  | "aprovacao"
  | "novo_projeto"
  | "prazo"
  | "atualizacao"
  | "favorito"
  | "sistema";

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  dataFormatada: string;
  lida: boolean;
}