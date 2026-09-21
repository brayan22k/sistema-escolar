// ======================================================
// DASHBOARD CONTROLLER
// Sistema Escolar
// ======================================================

import {
    obterDadosDashboard
} from './dashboardService.js';


// ======================================================
// GET /dashboard
// ======================================================

export async function listarDashboard(req, res) {

    try {

        const dados =
            await obterDadosDashboard();


        return res.status(200).json({

            sucesso: true,

            dados

        });

    } catch (error) {

        console.error(
            'Erro ao carregar dashboard:',
            error
        );


        return res.status(500).json({

            sucesso: false,

            erro: 'Erro ao carregar os dados do dashboard.'

        });

    }

}