export interface EstatisticasDashboard {
  projetosAtivos: number;
  projetosRascunho: number;
  projetosEncerrados: number;
  projetosSuspensos: number;
}

export type StatusProjeto = "rascunho" | "ativo" | "encerrado" | "suspenso";

export interface ProjetoResumo {
  id: string;
  titulo: string;
  categoria: string;
  inscritos: number;
  vagasPreenchidas: number;
  vagasTotal: number;
  status: StatusProjeto;
  diasRestantes?: number;
  finalizadoEm?: string;
}

export type TipoNotificacaoProfessor = "candidatura" | "novo_projeto" | "resultado";

export interface NotificacaoResumo {
  id: string;
  tipo: TipoNotificacaoProfessor;
  titulo: string;
  mensagem: string;
  dataFormatada: string;
}