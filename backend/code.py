from pathlib import Path

def gerar_arvore(diretorio):
    raiz = Path(diretorio).resolve()

    print(f"{raiz.name}/")

    for atual, diretorios, arquivos in os.walk(raiz):
        atual = Path(atual)

        # Mantém ordem alfabética
        diretorios.sort()
        arquivos.sort()

        nivel = len(atual.relative_to(raiz).parts)

        if nivel > 0:
            print("    " * nivel + f"{atual.name}/")

        for arquivo in arquivos:
            print("    " * (nivel + 1) + arquivo)


if __name__ == "__main__":
    import os

    caminho = input("Diretório: ").strip()
    gerar_arvore(caminho)