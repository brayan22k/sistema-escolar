import Auditoria from './Auditoria.js';

/**
 * Registra um evento de auditoria.
 *
 * A auditoria nunca deve impedir a operação principal.
 * Por isso o erro é tratado internamente.
 *
 * O usuário autenticado é obtido através de req.usuario,
 * preenchido pelo middleware JWT.
 */
export async function registrarAuditoria({
    req = null,

    // Também permite informar manualmente, se necessário.
    usuario_id = null,
    usuario_nome = null,
    perfil = null,

    operacao,
    recurso,
    recurso_id = null,
    detalhes = null
}) {
    try {
        // ======================================================
        // USUÁRIO AUTENTICADO
        // ======================================================

        const usuario = req?.usuario || {};

        const idUsuario =
            usuario_id ?? usuario.id ?? null;

        const nomeUsuario =
            usuario_nome ?? usuario.nome ?? null;

        const perfilUsuario =
            perfil ?? usuario.perfil ?? null;

        // ======================================================
        // REGISTRA AUDITORIA
        // ======================================================

        await Auditoria.create({
            usuario_id: idUsuario,
            usuario_nome: nomeUsuario,
            perfil: perfilUsuario,
            operacao,
            recurso,
            recurso_id,
            detalhes:
                typeof detalhes === 'object'
                    ? JSON.stringify(detalhes)
                    : detalhes
        });

        console.log(
            `AUDITORIA: ${operacao} ${recurso} ${recurso_id ?? ''} | ` +
            `Usuário: ${nomeUsuario ?? 'não identificado'}`
        );

    } catch (erro) {

        // ======================================================
        // IMPORTANTE:
        // A auditoria NÃO pode derrubar a operação principal.
        // ======================================================

        console.error(
            'Falha ao registrar auditoria:',
            erro.message
        );
    }
}