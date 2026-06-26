import { createFileRoute, Link } from '@tanstack/react-router';
import DetalheProjeto from '../pages/DetalheProjeto/DetalheProjeto';
import { getProjetoPorId } from '../data/projetos';

export const Route = createFileRoute('/projetos/$id')({
  component: ProjetoDetalhesRoute,
});

function ProjetoDetalhesRoute() {
  const { id } = Route.useParams();
  const projeto = getProjetoPorId(Number(id));

  if (!projeto) {
    return (
      <div className="page-container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h1>Projeto não encontrado</h1>
        <p>Não existe nenhum projeto com o id "{id}".</p>
        <Link to="/projetos">‹ Voltar para projetos</Link>
      </div>
    );
  }

  return (
    <DetalheProjeto
      projeto={projeto}
      onApply={() => alert(`Candidatura enviada para o projeto ${projeto.titulo}!`)}
    />
  );
}