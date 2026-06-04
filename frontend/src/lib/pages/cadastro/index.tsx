const Cadastro = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Imagem */}
      <div
        className="
          h-64
          md:h-auto
          md:w-2/5
          lg:w-1/2
          bg-[url('/login2.jpeg')]
          bg-cover
          bg-center
        "
      />

      {/* Formulário */}
      <div
        className="
          flex
          flex-1
          items-center
          justify-center
          px-6
          py-10
          md:px-12
        "
      >
        <div className="w-full max-w-md">
          <h1 className="mb-2 text-3xl font-bold">
            Crie sua Conta
          </h1>

          <p className="mb-8 text-gray-600">
            Preencha os dados abaixo para se cadastrar
          </p>

          <form>
            <label htmlFor="">Nome completo</label>
            <input type="text" name="" id="" placeholder="Digite seu nome completo"/>

            <label htmlFor="">E-mail institucional</label>
            <input type="email" name="" id="" placeholder="seu.email@instituição.edu.br"/>

            <label htmlFor="">CPF</label>
            <input type="text" name="" id="" placeholder="000.000.000-00"/>

            <label htmlFor="">Data de nascimento</label>
            <input type="date" name="" id="" />

            <label htmlFor="">Curso</label>
            {/* tag de seleção */}

            <label htmlFor="">Perído</label>
            {/* tag de seleção */}

            <label htmlFor="">Senha</label>
            <input type="password" name="" id="" placeholder="Crie uma senha"/>

            <label htmlFor="">Confirmar senha</label>
            <input type="password" name="" id="" placeholder="Confirme sua senha"/>

            <button>
                Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
