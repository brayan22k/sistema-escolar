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

        if (usuario && usuario.trim() !== '') {
            where.usuario_nome = {
                [Op.like]: `%${usuario.trim()}%`
            };
        }

        // ==========================================
        // FILTRO POR OPERAÇÃO
        // ==========================================

        if (operacao && operacao.trim() !== '') {
            where.operacao = operacao.trim();
        }

        // ==========================================
        // FILTRO POR RECURSO
        // ==========================================

        if (recurso && recurso.trim() !== '') {
            where.recurso = recurso.trim();
        }

        // ==========================================
        // FILTRO POR PERÍODO
        // ==========================================

        const dataInicio =
            inicio && /^\d{4}-\d{2}-\d{2}$/.test(inicio)
                ? new Date(`${inicio}T00:00:00`)
                : null;

        const dataFim =
            fim && /^\d{4}-\d{2}-\d{2}$/.test(fim)
                ? new Date(`${fim}T23:59:59`)
                : null;

        // Verifica se as datas realmente são válidas
        const inicioValido =
            dataInicio && !Number.isNaN(dataInicio.getTime());

        const fimValido =
            dataFim && !Number.isNaN(dataFim.getTime());

        if (inicioValido || fimValido) {
            where.criado_em = {};

            if (inicioValido) {
                where.criado_em[Op.gte] = dataInicio;
            }

            if (fimValido) {
                where.criado_em[Op.lte] = dataFim;
            }
        }

        // ==========================================
        // CONSULTA
        // ==========================================

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