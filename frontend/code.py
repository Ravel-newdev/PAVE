from pathlib import Path
import os

IGNORAR = {
    "node_modules",
}

def gerar_arvore(diretorio, saida="estrutura.txt"):
    i = 0

    raiz = Path(diretorio).resolve()

    with open(saida, "w", encoding="utf-8") as f:
        f.write(f"{raiz.name}/\n")

        for atual, diretorios, arquivos in os.walk(raiz):
            i = i + 1
            # Impede que o os.walk entre nesses diretórios
            diretorios[:] = sorted(d for d in diretorios if d not in IGNORAR)
            arquivos.sort()

            atual = Path(atual)
            nivel = len(atual.relative_to(raiz).parts)

            if nivel > 0:
                f.write("    " * nivel + f"{atual.name}/\n")

            for arquivo in arquivos:
                f.write("    " * (nivel + 1) + arquivo + "\n")

        f.write(f"\ntotal arquivos: {i}")

if __name__ == "__main__":
    gerar_arvore(".", "estrutura.txt")