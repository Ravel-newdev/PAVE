const recuperacaoSenhaHtml = (link) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Redefinição de senha</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(30,46,79,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:#1E2E4F;padding:32px 40px;">
              <p style="margin:0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:2px;">PAVE</p>
              <p style="margin:6px 0 0;font-size:13px;color:#93c5fd;letter-spacing:0.5px;">Plataforma de Atividades e Vivências Extensionistas</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1E2E4F;">Redefinição de senha</p>
              <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
                Recebemos uma solicitação para redefinir a senha da sua conta PAVE. Clique no botão abaixo para criar uma nova senha. O link é válido por <strong>1 hora</strong>.
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td style="background:#1E2E4F;border-radius:10px;">
                    <a href="${link}" target="_blank"
                      style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">
                      Redefinir minha senha
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
              <p style="margin:0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;font-size:12px;color:#287999;word-break:break-all;">
                ${link}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                Se você não solicitou a redefinição de senha, ignore este e-mail — sua senha permanece a mesma.<br/>
                Este é um e-mail automático, não responda a esta mensagem.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

module.exports = { recuperacaoSenhaHtml };
