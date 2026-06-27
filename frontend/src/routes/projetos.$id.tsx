import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import DetalheProjeto from '../pages/DetalheProjeto/DetalheProjeto';
import { paveApi } from '../services/PaveApiService';
import type { Projeto } from '../types/projeto';

export const Route = createFileRoute('/projetos/$id')({
  beforeLoad: () => {
    if (!paveApi.getToken()) throw redirect({ to: '/login' });
  },
  component: ProjetoDetalhesRoute,
});

function ProjetoDetalhesRoute() {
  const { id } = Route.useParams();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [erro, setErro]       = useState<string | null>(null);

  useEffect(() => {
    paveApi.buscarProjeto(id)
      .then(setProjeto)
      .catch(() => setErro('Projeto não encontrado.'));
  }, [id]);

  if (erro) {
    return (
      <div className="page-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1>Projeto não encontrado</h1>
        <p>{erro}</p>
        <Link to="/projetos">‹ Voltar para projetos</Link>
      </div>
    );
  }

  if (!projeto) {
    return (
      <div className="page-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return <DetalheProjeto projeto={projeto} />;
}
