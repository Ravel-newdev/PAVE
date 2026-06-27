#!/usr/bin/env python3
"""
rename-structure.py — Normaliza nomenclatura de diretórios e arquivos do frontend PAVE.

Uso:
    python rename-structure.py           # executa as mudanças
    python rename-structure.py --dry-run # mostra o que seria alterado sem modificar nada
"""

import os
import re
import sys
import shutil
from pathlib import Path

DRY_RUN = "--dry-run" in sys.argv
SRC = Path(__file__).parent / "" / "src"

# ─── Mapeamentos ────────────────────────────────────────────────────────────────

# Diretórios: (relativo a SRC antigo, relativo a SRC novo)
# Ordem importa: renomear pai antes dos filhos.
DIRECTORY_RENAMES = [
    ("pages/kanban-candidatos",         "pages/KanbanCandidatos"),
    ("pages/projeto-form",              "pages/ProjetoForm"),
    ("pages/projeto-visao-geral",       "pages/ProjetoVisaoGeral"),
    ("pages/Home",                      "pages/DashboardAluno"),
    # componente-professor → layout/components/professor (move de diretório)
    ("layout/componente-professor",     "layout/components/professor"),
]

# Arquivos individuais: (relativo a SRC antigo, relativo a SRC novo)
FILE_RENAMES = [
    # DashboardAluno: renomear arquivos que herdavam o nome do diretório
    ("pages/DashboardAluno/Home.tsx",         "pages/DashboardAluno/DashboardAluno.tsx"),
    ("pages/DashboardAluno/Home.css",         "pages/DashboardAluno/DashboardAluno.css"),

    # Perfil — kebab-case → PascalCase
    ("layout/components/Perfil/about-card.tsx",         "layout/components/Perfil/AboutCard.tsx"),
    ("layout/components/Perfil/academic-info-card.tsx", "layout/components/Perfil/AcademicInfoCard.tsx"),
    ("layout/components/Perfil/avatar-upload.tsx",      "layout/components/Perfil/AvatarUpload.tsx"),
    ("layout/components/Perfil/experience-card.tsx",    "layout/components/Perfil/ExperienceCard.tsx"),
    ("layout/components/Perfil/experience-item.tsx",    "layout/components/Perfil/ExperienceItem.tsx"),
    ("layout/components/Perfil/interest-select.tsx",    "layout/components/Perfil/InterestSelect.tsx"),
    ("layout/components/Perfil/personal-info-card.tsx", "layout/components/Perfil/PersonalInfoCard.tsx"),
    ("layout/components/Perfil/preferences-card.tsx",   "layout/components/Perfil/PreferencesCard.tsx"),
    ("layout/components/Perfil/profile-header.tsx",     "layout/components/Perfil/ProfileHeader.tsx"),
    ("layout/components/Perfil/security-card.tsx",      "layout/components/Perfil/SecurityCard.tsx"),

    # componente-professor/navbar.css (já movido com o diretório, mas o nome ainda é minúsculo)
    ("layout/components/professor/navbar.css",          "layout/components/professor/ProfessorNavbar.css"),
]

# Substituições em imports: (regex, substituição)
# Aplicadas em todos os .ts/.tsx do projeto. Ordem importa: mais específico primeiro.
IMPORT_SUBSTITUTIONS = [
    # pages — diretórios renomeados
    (r"pages/kanban-candidatos",        "pages/KanbanCandidatos"),
    (r"pages/projeto-form",             "pages/ProjetoForm"),
    (r"pages/projeto-visao-geral",      "pages/ProjetoVisaoGeral"),
    (r"pages/Home/Home",                "pages/DashboardAluno/DashboardAluno"),
    (r"pages/Home",                     "pages/DashboardAluno"),

    # CSS local dentro do DashboardAluno (import './Home.css')
    (r"['\"](\./|)Home\.css['\"]",      lambda m: m.group(0).replace("Home.css", "DashboardAluno.css")),

    # layout/componente-professor → layout/components/professor
    (r"layout/componente-professor",    "layout/components/professor"),

    # Perfil — kebab-case → PascalCase
    (r"Perfil/about-card",              "Perfil/AboutCard"),
    (r"Perfil/academic-info-card",      "Perfil/AcademicInfoCard"),
    (r"Perfil/avatar-upload",           "Perfil/AvatarUpload"),
    (r"Perfil/experience-card",         "Perfil/ExperienceCard"),
    (r"Perfil/experience-item",         "Perfil/ExperienceItem"),
    (r"Perfil/interest-select",         "Perfil/InterestSelect"),
    (r"Perfil/personal-info-card",      "Perfil/PersonalInfoCard"),
    (r"Perfil/preferences-card",        "Perfil/PreferencesCard"),
    (r"Perfil/profile-header",          "Perfil/ProfileHeader"),
    (r"Perfil/security-card",           "Perfil/SecurityCard"),

    # CSS do professor navbar
    (r"componente-professor/navbar\.css",   "components/professor/ProfessorNavbar.css"),
    (r"componente-professor/ProfessorNavbar", "components/professor/ProfessorNavbar"),
]

# ─── Helpers ────────────────────────────────────────────────────────────────────

def log(msg: str):
    prefix = "[DRY] " if DRY_RUN else "      "
    print(prefix + msg)


def rename_entry(src: Path, dst: Path):
    """Renomeia ou move src → dst. Usa passo intermediário para mudanças só de capitalização no Windows."""
    if not src.exists():
        print(f"  [AVISO] não encontrado, pulando: {src.relative_to(SRC)}")
        return

    if src.resolve() == dst.resolve():
        return

    # Mudança apenas de capitalização: precisa de passo temporário no Windows
    needs_tmp = (
        src.parent == dst.parent
        and src.name.lower() == dst.name.lower()
        and src.name != dst.name
    )

    label = f"{src.relative_to(SRC)}  →  {dst.relative_to(SRC)}"

    if needs_tmp:
        tmp = src.parent / ("__tmp__" + src.name)
        log(f"rename (2 passos): {label}")
        if not DRY_RUN:
            src.rename(tmp)
            tmp.rename(dst)
    else:
        log(f"rename: {label}")
        if not DRY_RUN:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(src), str(dst))


def update_imports(file: Path):
    try:
        original = file.read_text(encoding="utf-8")
    except Exception as e:
        print(f"  [ERRO] não foi possível ler {file}: {e}")
        return

    content = original
    for pattern, replacement in IMPORT_SUBSTITUTIONS:
        content = re.sub(pattern, replacement, content)

    if content != original:
        rel = file.relative_to(SRC.parent.parent)
        log(f"imports: {rel}")
        if not DRY_RUN:
            file.write_text(content, encoding="utf-8")


# ─── Execução ───────────────────────────────────────────────────────────────────

def main():
    if DRY_RUN:
        print("=" * 60)
        print("  DRY RUN — nenhum arquivo será modificado")
        print("=" * 60)

    print("\n── 1. Renomeando diretórios ────────────────────────────────")
    for old_rel, new_rel in DIRECTORY_RENAMES:
        rename_entry(SRC / old_rel, SRC / new_rel)

    print("\n── 2. Renomeando arquivos ──────────────────────────────────")
    for old_rel, new_rel in FILE_RENAMES:
        rename_entry(SRC / old_rel, SRC / new_rel)

    print("\n── 3. Atualizando imports ──────────────────────────────────")
    for ts_file in sorted(SRC.rglob("*.tsx")):
        update_imports(ts_file)
    for ts_file in sorted(SRC.rglob("*.ts")):
        update_imports(ts_file)

    print("\n" + ("✓ Simulação concluída. Rode sem --dry-run para aplicar." if DRY_RUN else "✓ Concluído."))


if __name__ == "__main__":
    main()
