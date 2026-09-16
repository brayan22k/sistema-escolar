import { Op } from 'sequelize';
import Auditoria from './Auditoria.js';

export async function listarAuditoria(req, res) {
    try {
        const {
            usuario,
            operacao,
            recurso,
            inicio,
            fim
        } = req.query;

        const where = {};

        // ==========================================
        // FILTRO POR USUÁRIO
        // ==========================================

        if (usuario) {
            where.usuario_nome = {
                [Op.like]: `%${usuario}%`
            };
        }

        // ==========================================
        // FILTRO POR OPERAÇÃO
        // ==========================================

        if (operacao) {
            where.operacao = operacao;
        }

        // ==========================================
        // FILTRO POR RECURSO
        // ==========================================

        if (recurso) {
            where.recurso = recurso;
        }

        // ==========================================
        // FILTRO POR PERÍODO
        // ==========================================

        if (inicio || fim) {
            where.criado_em = {};

            if (inicio) {
                where.criado_em[Op.gte] =
                    new Date(`${inicio}T00:00:00`);
            }

            if (fim) {
                where.criado_em[Op.lte] =
                    new Date(`${fim}T23:59:59`);
            }
        }

        const registros = await Auditoria.findAll({
            where,

            order: [
                ['criado_em', 'DESC']
            ]
        });

        return res.status(200).json(registros);

    } catch (erro) {
        console.error(
            'Erro ao consultar auditoria:',
            erro
        );

        return res.status(500).json({
            erro: 'Erro ao consultar registros de auditoria'
        });
    }
}
