import { useEffect, useState } from 'react';

const API_URL =
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000';

// ======================================================
// DASHBOARD
// ======================================================

export default function Dashboard() {

    const [dados, setDados] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState('');
    const [ultimaAtualizacao, setUltimaAtualizacao] =
        useState(null);

    // ==================================================
    // CARREGAR DASHBOARD
    // ==================================================

    async function carregarDashboard(mostrarAtualizando = false) {

        try {

            if (mostrarAtualizando) {
                setAtualizando(true);
            } else {
                setCarregando(true);
            }

            setErro('');

            const resposta = await fetch(
                `${API_URL}/dashboard`
            );

            if (!resposta.ok) {

                throw new Error(
                    `Erro HTTP ${resposta.status}`
                );

            }

            const resultado =
                await resposta.json();

            if (!resultado.sucesso) {

                throw new Error(
                    resultado.erro ||
                    'Erro ao carregar dashboard.'
                );

            }

            setDados(resultado.dados);

            setUltimaAtualizacao(
                new Date()
            );

        } catch (error) {

            console.error(
                'Erro ao carregar dashboard:',
                error
            );

            setErro(
                'Não foi possível carregar os dados do dashboard.'
            );

        } finally {

            setCarregando(false);
            setAtualizando(false);

        }

    }

    // ==================================================
    // INICIALIZAÇÃO
    // ==================================================

    useEffect(() => {

        carregarDashboard();

    }, []);

    // ==================================================
    // LOADING
    // ==================================================

    if (carregando) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-loading">

                    <div className="dashboard-loader-orbit">

                        <div className="dashboard-spinner"></div>

                    </div>

                    <h2>
                        Carregando Dashboard
                    </h2>

                    <p>
                        Buscando os dados do sistema...
                    </p>

                </div>

                <style>{`

                    .dashboard-loading {
                        min-height: 70vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        color: #ffffff;
                    }

                    .dashboard-loader-orbit {
                        width: 70px;
                        height: 70px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 20px;
                        border: 1px solid rgba(0, 229, 255, .15);
                        border-radius: 50%;
                        animation: dashboardOrbit 2s linear infinite;
                    }

                    .dashboard-spinner {
                        width: 42px;
                        height: 42px;
                        border: 3px solid rgba(255, 255, 255, .08);
                        border-top-color: #00e5ff;
                        border-right-color: #00e5ff;
                        border-radius: 50%;
                        box-shadow:
                            0 0 20px rgba(0, 229, 255, .25);
                        animation:
                            dashboardSpin .8s linear infinite;
                    }

                    .dashboard-loading h2 {
                        margin: 0 0 7px;
                        font-size: 21px;
                    }

                    .dashboard-loading p {
                        margin: 0;
                        color: #687482;
                        font-size: 13px;
                    }

                    @keyframes dashboardSpin {
                        to {
                            transform: rotate(360deg);
                        }
                    }

                    @keyframes dashboardOrbit {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }

                `}</style>

            </div>

        );

    }

    // ==================================================
    // ERRO
    // ==================================================

    if (erro) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-error">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Erro ao carregar
                    </h2>

                    <p>
                        {erro}
                    </p>

                    <button
                        className="retry-button"
                        onClick={() =>
                            carregarDashboard()
                        }
                    >
                        Tentar novamente
                    </button>

                </div>

                <style>{`

                    .dashboard-error {
                        min-height: 70vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        color: #ffffff;
                    }

                    .error-icon {
                        width: 52px;
                        height: 52px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 15px;
                        border: 1px solid rgba(255, 80, 100, .2);
                        border-radius: 50%;
                        background: rgba(255, 80, 100, .08);
                        color: #ff6075;
                        font-size: 23px;
                        font-weight: 900;
                    }

                    .dashboard-error h2 {
                        margin: 0 0 8px;
                    }

                    .dashboard-error p {
                        margin: 0;
                        color: #788493;
                        font-size: 13px;
                    }

                    .retry-button {
                        margin-top: 20px;
                        padding: 11px 20px;
                        border: 1px solid rgba(0, 229, 255, .25);
                        border-radius: 11px;
                        background: rgba(0, 229, 255, .07);
                        color: #ffffff;
                        cursor: pointer;
                        font-weight: 700;
                        transition: .2s ease;
                    }

                    .retry-button:hover {
                        background: rgba(0, 229, 255, .13);
                        border-color: rgba(0, 229, 255, .45);
                        transform: translateY(-2px);
                    }

                `}</style>

            </div>

        );

    }

    if (!dados) {
        return null;
    }

    const resumo =
        dados.resumo || {};

    const desempenho =
        dados.desempenho || {};

    // ==================================================
    // CARDS
    // ==================================================

    const cards = [

        {
            titulo: 'Alunos',
            valor: resumo.alunos ?? 0,
            descricao: 'Alunos cadastrados',
            icone: '🎓'
        },

        {
            titulo: 'Professores',
            valor: resumo.professores ?? 0,
            descricao: 'Professores cadastrados',
            icone: '👨‍🏫'
        },

        {
            titulo: 'Turmas',
            valor: resumo.turmas ?? 0,
            descricao: 'Turmas cadastradas',
            icone: '🏫'
        },

        {
            titulo: 'Disciplinas',
            valor: resumo.disciplinas ?? 0,
            descricao: 'Disciplinas cadastradas',
            icone: '📚'
        },

        {
            titulo: 'Notas',
            valor: resumo.notas ?? 0,
            descricao: 'Notas lançadas',
            icone: '📝'
        }

    ];

    // ==================================================
    // DESEMPENHO
    // ==================================================

    const desempenhoItems = [

        {
            titulo: 'Aprovados',
            valor: desempenho.aprovados ?? 0,
            percentual:
                desempenho.percentualAprovados ?? 0,
            simbolo: '✓',
            classe: 'aprovado'
        },

        {
            titulo: 'Recuperação',
            valor: desempenho.recuperacao ?? 0,
            percentual:
                desempenho.percentualRecuperacao ?? 0,
            simbolo: '!',
            classe: 'recuperacao'
        },

        {
            titulo: 'Reprovados',
            valor: desempenho.reprovados ?? 0,
            percentual:
                desempenho.percentualReprovados ?? 0,
            simbolo: '×',
            classe: 'reprovado'
        }

    ];

    const percentualAprovados =
        Math.min(
            Number(
                desempenho.percentualAprovados
            ) || 0,
            100
        );

    // ==================================================
    // DATA DA ATUALIZAÇÃO
    // ==================================================

    function formatarHora(data) {

        if (!data) {
            return '--:--';
        }

        return data.toLocaleTimeString(
            'pt-BR',
            {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }
        );

    }

    // ==================================================
    // RENDER
    // ==================================================

    return (

        <div className="dashboard-page">

            {/* ==================================================
                EFEITOS DE FUNDO
            ================================================== */}

            <div className="dashboard-background-effect effect-one"></div>
            <div className="dashboard-background-effect effect-two"></div>

            {/* ==================================================
                CABEÇALHO
            ================================================== */}

            <section className="dashboard-header">

                <div>

                    <span className="dashboard-overline">
                        SISTEMA ESCOLAR
                    </span>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Visão geral do desempenho e
                        informações do sistema.
                    </p>

                </div>

                <div className="dashboard-header-actions">

                    <div className="system-status">

                        <span className="status-light"></span>

                        Sistema conectado

                    </div>

                    <button
                        className={
                            `refresh-button ${
                                atualizando
                                    ? 'refreshing'
                                    : ''
                            }`
                        }
                        onClick={() =>
                            carregarDashboard(true)
                        }
                        disabled={atualizando}
                    >

                        <span className="refresh-icon">
                            ↻
                        </span>

                        {atualizando
                            ? 'Atualizando...'
                            : 'Atualizar'}

                    </button>

                </div>

            </section>

            {/* ==================================================
                CARDS
            ================================================== */}

            <section className="dashboard-cards">

                {cards.map((card, index) => (

                    <div
                        className="dashboard-card"
                        key={card.titulo}
                        style={{
                            animationDelay:
                                `${index * 80}ms`
                        }}
                    >

                        <div className="card-glow"></div>

                        <div className="card-shine"></div>

                        <div className="card-header">

                            <div className="card-icon">

                                {card.icone}

                            </div>

                            <span>
                                {card.titulo}
                            </span>

                        </div>

                        <div className="card-value">

                            {card.valor}

                        </div>

                        <div className="card-description">

                            {card.descricao}

                        </div>

                        <div className="card-bottom-line"></div>

                    </div>

                ))}

            </section>

            {/* ==================================================
                ÁREA PRINCIPAL
            ================================================== */}

            <section className="dashboard-grid">

                {/* ==================================================
                    DESEMPENHO
                ================================================== */}

                <div className="dashboard-panel performance-panel">

                    <div className="panel-heading">

                        <div>

                            <span className="panel-overline">
                                DESEMPENHO
                            </span>

                            <h2>
                                Situação dos alunos
                            </h2>

                        </div>

                        <div className="average-box">

                            <span>
                                Média geral
                            </span>

                            <strong>
                                {Number(
                                    desempenho.mediaGeral ?? 0
                                ).toFixed(2)}
                            </strong>

                        </div>

                    </div>

                    <div className="performance-list">

                        {desempenhoItems.map(
                            (item) => (

                                <div
                                    className="performance-row"
                                    key={item.titulo}
                                >

                                    <div className="performance-top">

                                        <div className="performance-name">

                                            <span
                                                className={
                                                    `performance-symbol ${item.classe}`
                                                }
                                            >
                                                {item.simbolo}
                                            </span>

                                            <div>

                                                <strong>
                                                    {item.titulo}
                                                </strong>

                                                <span>
                                                    {item.valor}{' '}
                                                    {item.valor === 1
                                                        ? 'aluno'
                                                        : 'alunos'}
                                                </span>

                                            </div>

                                        </div>

                                        <strong className="percentage">

                                            {item.percentual}%

                                        </strong>

                                    </div>

                                    <div className="progress-track">

                                        <div
                                            className={
                                                `progress-bar ${item.classe}`
                                            }
                                            style={{
                                                width:
                                                    `${Math.min(
                                                        Number(
                                                            item.percentual
                                                        ) || 0,
                                                        100
                                                    )}%`
                                            }}
                                        ></div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                    {/* ==================================================
                        SEM NOTAS
                    ================================================== */}

                    <div className="without-grades">

                        <div className="without-grades-icon">
                            ○
                        </div>

                        <div>

                            <strong>
                                Alunos sem notas
                            </strong>

                            <span>
                                Aguardando avaliações
                            </span>

                        </div>

                        <strong className="without-grades-value">

                            {desempenho.alunosSemNotas ?? 0}

                        </strong>

                    </div>

                </div>

                {/* ==================================================
                    RESUMO
                ================================================== */}

                <div className="dashboard-panel summary-panel">

                    <span className="panel-overline">
                        RESUMO
                    </span>

                    <h2>
                        Visão acadêmica
                    </h2>

                    <div className="summary-list">

                        <div className="summary-item">

                            <span>
                                Alunos avaliados
                            </span>

                            <strong>
                                {desempenho.alunosComNotas ?? 0}
                            </strong>

                        </div>

                        <div className="summary-item">

                            <span>
                                Alunos sem notas
                            </span>

                            <strong>
                                {desempenho.alunosSemNotas ?? 0}
                            </strong>

                        </div>

                        <div className="summary-item">

                            <span>
                                Total de notas
                            </span>

                            <strong>
                                {resumo.notas ?? 0}
                            </strong>

                        </div>

                        <div className="summary-item">

                            <span>
                                Média geral
                            </span>

                            <strong className="summary-average">

                                {Number(
                                    desempenho.mediaGeral ?? 0
                                ).toFixed(2)}

                            </strong>

                        </div>

                    </div>

                    {/* ==================================================
                        INDICADOR GERAL
                    ================================================== */}

                    <div className="academic-indicator">

                        <div className="indicator-top">

                            <span>
                                Aproveitamento
                            </span>

                            <strong>
                                {desempenho.percentualAprovados ?? 0}%
                            </strong>

                        </div>

                        <div className="indicator-track">

                            <div
                                className="indicator-fill"
                                style={{
                                    width:
                                        `${percentualAprovados}%`
                                }}
                            ></div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ==================================================
                STATUS FINAL
            ================================================== */}

            <div className="dashboard-footer">

                <span className="footer-dot"></span>

                Dados atualizados diretamente do banco de dados.

                <span className="footer-separator">
                    •
                </span>

                Última atualização:

                <strong>
                    {formatarHora(
                        ultimaAtualizacao
                    )}
                </strong>

            </div>

            {/* ==================================================
                ESTILOS
            ================================================== */}

            <style>{`

                * {
                    box-sizing: border-box;
                }

                .dashboard-page {

                    position: relative;

                    width: 100%;

                    min-height:
                        calc(100vh - 64px);

                    padding:
                        28px 30px 35px;

                    overflow: hidden;

                    color: #ffffff;

                    background:
                        radial-gradient(
                            circle at 85% 5%,
                            rgba(0, 229, 255, .08),
                            transparent 28%
                        ),
                        radial-gradient(
                            circle at 5% 90%,
                            rgba(120, 0, 255, .07),
                            transparent 28%
                        );

                    animation:
                        dashboardAppear .5s ease;

                }

                /* ==================================================
                   FUNDO ANIMADO
                ================================================== */

                .dashboard-background-effect {

                    position: absolute;

                    width: 300px;

                    height: 300px;

                    border-radius: 50%;

                    pointer-events: none;

                    filter: blur(80px);

                    opacity: .15;

                    animation:
                        backgroundFloat 8s ease-in-out infinite;

                }

                .effect-one {

                    top: -150px;

                    right: -100px;

                    background:
                        #00e5ff;

                }

                .effect-two {

                    bottom: -180px;

                    left: -100px;

                    background:
                        #7200ff;

                    animation-delay:
                        -3s;

                }

                /* ==================================================
                   HEADER
                ================================================== */

                .dashboard-header {

                    position: relative;

                    z-index: 2;

                    display: flex;

                    justify-content: space-between;

                    align-items: center;

                    gap: 25px;

                    margin-bottom: 28px;

                    flex-wrap: wrap;

                }

                .dashboard-overline {

                    display: block;

                    margin-bottom: 7px;

                    color: #00e5ff;

                    font-size: 10px;

                    font-weight: 800;

                    letter-spacing: 3px;

                }

                .dashboard-header h1 {

                    margin: 0;

                    font-size:
                        clamp(28px, 3vw, 38px);

                    font-weight: 800;

                    letter-spacing: -1px;

                }

                .dashboard-header p {

                    margin:
                        8px 0 0;

                    color: #8792a1;

                    font-size: 14px;

                }

                .dashboard-header-actions {

                    display: flex;

                    align-items: center;

                    gap: 10px;

                    flex-wrap: wrap;

                }

                .system-status {

                    display: flex;

                    align-items: center;

                    gap: 9px;

                    padding:
                        10px 15px;

                    border:
                        1px solid
                        rgba(0, 229, 255, .18);

                    border-radius: 999px;

                    background:
                        rgba(0, 229, 255, .05);

                    color: #aeb9c7;

                    font-size: 12px;

                    white-space: nowrap;

                }

                .status-light {

                    width: 8px;

                    height: 8px;

                    border-radius: 50%;

                    background: #00e5ff;

                    box-shadow:
                        0 0 12px
                        rgba(0, 229, 255, .9);

                    animation:
                        dashboardPulse 1.8s infinite;

                }

                .refresh-button {

                    display: flex;

                    align-items: center;

                    gap: 7px;

                    padding:
                        10px 14px;

                    border:
                        1px solid
                        rgba(255, 255, 255, .09);

                    border-radius: 11px;

                    background:
                        rgba(255, 255, 255, .045);

                    color: #ffffff;

                    font-size: 12px;

                    font-weight: 700;

                    cursor: pointer;

                    transition:
                        .25s ease;

                }

                .refresh-button:hover:not(:disabled) {

                    border-color:
                        rgba(0, 229, 255, .35);

                    background:
                        rgba(0, 229, 255, .08);

                    transform:
                        translateY(-2px);

                }

                .refresh-button:disabled {

                    opacity: .65;

                    cursor: wait;

                }

                .refresh-icon {

                    display: inline-flex;

                    font-size: 17px;

                    line-height: 1;

                }

                .refresh-button.refreshing
                .refresh-icon {

                    animation:
                        dashboardSpin .8s linear infinite;

                }

                /* ==================================================
                   CARDS
                ================================================== */

                .dashboard-cards {

                    position: relative;

                    z-index: 2;

                    display: grid;

                    grid-template-columns:
                        repeat(5, minmax(0, 1fr));

                    gap: 15px;

                    margin-bottom: 20px;

                }

                .dashboard-card {

                    position: relative;

                    min-width: 0;

                    min-height: 155px;

                    padding: 20px;

                    overflow: hidden;

                    border:
                        1px solid
                        rgba(255, 255, 255, .075);

                    border-radius: 18px;

                    background:
                        linear-gradient(
                            145deg,
                            rgba(255, 255, 255, .065),
                            rgba(255, 255, 255, .025)
                        );

                    box-shadow:
                        0 15px 40px
                        rgba(0, 0, 0, .18);

                    animation:
                        dashboardCardIn
                        .55s ease both;

                    transition:
                        transform .25s ease,
                        border-color .25s ease,
                        box-shadow .25s ease;

                }

                .dashboard-card:hover {

                    transform:
                        translateY(-6px);

                    border-color:
                        rgba(0, 229, 255, .3);

                    box-shadow:
                        0 22px 55px
                        rgba(0, 0, 0, .28),
                        0 0 30px
                        rgba(0, 229, 255, .06);

                }

                .card-glow {

                    position: absolute;

                    width: 110px;

                    height: 110px;

                    top: -55px;

                    right: -55px;

                    border-radius: 50%;

                    background:
                        rgba(0, 229, 255, .1);

                    filter: blur(15px);

                    transition:
                        .3s ease;

                }

                .dashboard-card:hover
                .card-glow {

                    transform:
                        scale(1.5);

                    opacity: .8;

                }

                .card-shine {

                    position: absolute;

                    top: 0;

                    left: -120%;

                    width: 80%;

                    height: 100%;

                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            rgba(255,255,255,.045),
                            transparent
                        );

                    transform:
                        skewX(-20deg);

                    transition:
                        left .7s ease;

                    pointer-events: none;

                }

                .dashboard-card:hover
                .card-shine {

                    left: 130%;

                }

                .card-header {

                    position: relative;

                    display: flex;

                    align-items: center;

                    gap: 10px;

                    color: #aeb8c5;

                    font-size: 12px;

                    font-weight: 700;

                }

                .card-icon {

                    width: 39px;

                    height: 39px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    flex-shrink: 0;

                    border:
                        1px solid
                        rgba(0, 229, 255, .1);

                    border-radius: 12px;

                    background:
                        rgba(0, 229, 255, .06);

                    font-size: 18px;

                    transition:
                        .25s ease;

                }

                .dashboard-card:hover
                .card-icon {

                    transform:
                        scale(1.08)
                        rotate(-3deg);

                    border-color:
                        rgba(0, 229, 255, .25);

                    box-shadow:
                        0 0 20px
                        rgba(0, 229, 255, .08);

                }

                .card-value {

                    position: relative;

                    margin-top: 19px;

                    font-size: 34px;

                    line-height: 1;

                    font-weight: 850;

                    text-shadow:
                        0 0 20px
                        rgba(255,255,255,.04);

                }

                .card-description {

                    position: relative;

                    margin-top: 10px;

                    color: #697483;

                    font-size: 11px;

                }

                .card-bottom-line {

                    position: absolute;

                    left: 20px;

                    right: 20px;

                    bottom: 0;

                    height: 2px;

                    border-radius: 99px;

                    background:
                        linear-gradient(
                            90deg,
                            transparent,
                            rgba(0,229,255,.55),
                            transparent
                        );

                    opacity: .45;

                }

                /* ==================================================
                   GRID
                ================================================== */

                .dashboard-grid {

                    position: relative;

                    z-index: 2;

                    display: grid;

                    grid-template-columns:
                        minmax(0, 1.45fr)
                        minmax(290px, .85fr);

                    gap: 20px;

                }

                /* ==================================================
                   PAINÉIS
                ================================================== */

                .dashboard-panel {

                    padding: 24px;

                    border:
                        1px solid
                        rgba(255, 255, 255, .075);

                    border-radius: 20px;

                    background:
                        rgba(255, 255, 255, .035);

                    box-shadow:
                        0 15px 45px
                        rgba(0, 0, 0, .16);

                    transition:
                        border-color .25s ease,
                        box-shadow .25s ease;

                }

                .dashboard-panel:hover {

                    border-color:
                        rgba(255,255,255,.11);

                    box-shadow:
                        0 20px 55px
                        rgba(0,0,0,.2);

                }

                .panel-heading {

                    display: flex;

                    align-items: flex-start;

                    justify-content: space-between;

                    gap: 20px;

                    margin-bottom: 24px;

                }

                .panel-overline {

                    display: block;

                    color: #00e5ff;

                    font-size: 9px;

                    font-weight: 900;

                    letter-spacing: 2px;

                }

                .dashboard-panel h2 {

                    margin:
                        6px 0 0;

                    color: #ffffff;

                    font-size: 21px;

                    font-weight: 800;

                }

                .average-box {

                    display: flex;

                    flex-direction: column;

                    align-items: flex-end;

                    min-width: 90px;

                    padding:
                        10px 13px;

                    border-radius: 12px;

                    background:
                        rgba(255, 255, 255, .045);

                }

                .average-box span {

                    color: #788493;

                    font-size: 10px;

                }

                .average-box strong {

                    margin-top: 2px;

                    color: #00e5ff;

                    font-size: 20px;

                    text-shadow:
                        0 0 12px
                        rgba(0,229,255,.18);

                }

                /* ==================================================
                   DESEMPENHO
                ================================================== */

                .performance-list {

                    display: flex;

                    flex-direction: column;

                    gap: 15px;

                }

                .performance-row {

                    padding:
                        14px 15px;

                    border:
                        1px solid
                        rgba(255, 255, 255, .045);

                    border-radius: 14px;

                    background:
                        rgba(255, 255, 255, .025);

                    transition:
                        .2s ease;

                }

                .performance-row:hover {

                    background:
                        rgba(255,255,255,.04);

                    transform:
                        translateX(3px);

                }

                .performance-top {

                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 15px;

                    margin-bottom: 10px;

                }

                .performance-name {

                    display: flex;

                    align-items: center;

                    gap: 11px;

                    min-width: 0;

                }

                .performance-name > div {

                    display: flex;

                    flex-direction: column;

                    gap: 3px;

                }

                .performance-name strong {

                    font-size: 13px;

                }

                .performance-name div span {

                    color: #697483;

                    font-size: 10px;

                }

                .performance-symbol {

                    width: 34px;

                    height: 34px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    flex-shrink: 0;

                    border-radius: 10px;

                    font-size: 17px;

                    font-weight: 800;

                }

                .performance-symbol.aprovado {

                    background:
                        rgba(0, 229, 255, .09);

                    color: #00e5ff;

                }

                .performance-symbol.recuperacao {

                    background:
                        rgba(255, 196, 80, .1);

                    color: #ffc450;

                }

                .performance-symbol.reprovado {

                    background:
                        rgba(255, 90, 110, .1);

                    color: #ff5a6e;

                }

                .percentage {

                    font-size: 14px;

                    white-space: nowrap;

                }

                .progress-track {

                    width: 100%;

                    height: 6px;

                    overflow: hidden;

                    border-radius: 99px;

                    background:
                        rgba(255, 255, 255, .07);

                }

                .progress-bar {

                    height: 100%;

                    min-width: 0;

                    border-radius: inherit;

                    transition:
                        width .8s ease;

                }

                .progress-bar.aprovado {

                    background:
                        #00e5ff;

                    box-shadow:
                        0 0 12px
                        rgba(0, 229, 255, .45);

                }

                .progress-bar.recuperacao {

                    background:
                        #ffc450;

                }

                .progress-bar.reprovado {

                    background:
                        #ff5a6e;

                }

                /* ==================================================
                   SEM NOTAS
                ================================================== */

                .without-grades {

                    display: flex;

                    align-items: center;

                    gap: 12px;

                    margin-top: 15px;

                    padding:
                        13px 15px;

                    border:
                        1px dashed
                        rgba(255, 255, 255, .09);

                    border-radius: 14px;

                }

                .without-grades-icon {

                    width: 34px;

                    height: 34px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    border-radius: 10px;

                    background:
                        rgba(255, 255, 255, .05);

                    color: #8792a1;

                }

                .without-grades div:nth-child(2) {

                    display: flex;

                    flex-direction: column;

                    gap: 3px;

                    flex: 1;

                }

                .without-grades strong {

                    font-size: 12px;

                }

                .without-grades span {

                    color: #697483;

                    font-size: 10px;

                }

                .without-grades-value {

                    font-size: 19px !important;

                }

                /* ==================================================
                   RESUMO
                ================================================== */

                .summary-list {

                    display: flex;

                    flex-direction: column;

                    margin-top: 21px;

                }

                .summary-item {

                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    gap: 15px;

                    padding:
                        16px 0;

                    border-bottom:
                        1px solid
                        rgba(255, 255, 255, .065);

                }

                .summary-item span {

                    color: #84909e;

                    font-size: 12px;

                }

                .summary-item strong {

                    font-size: 17px;

                }

                .summary-average {

                    color: #00e5ff;

                    text-shadow:
                        0 0 14px
                        rgba(0, 229, 255, .2);

                }

                /* ==================================================
                   INDICADOR
                ================================================== */

                .academic-indicator {

                    margin-top: 24px;

                    padding: 15px;

                    border-radius: 14px;

                    background:
                        rgba(0, 229, 255, .035);

                    border:
                        1px solid
                        rgba(0, 229, 255, .08);

                }

                .indicator-top {

                    display: flex;

                    align-items: center;

                    justify-content: space-between;

                    margin-bottom: 10px;

                }

                .indicator-top span {

                    color: #8994a2;

                    font-size: 11px;

                }

                .indicator-top strong {

                    color: #00e5ff;

                    font-size: 14px;

                }

                .indicator-track {

                    width: 100%;

                    height: 7px;

                    overflow: hidden;

                    border-radius: 99px;

                    background:
                        rgba(255, 255, 255, .07);

                }

                .indicator-fill {

                    height: 100%;

                    border-radius: inherit;

                    background:
                        linear-gradient(
                            90deg,
                            #00a8ff,
                            #00e5ff
                        );

                    box-shadow:
                        0 0 14px
                        rgba(0, 229, 255, .4);

                    transition:
                        width 1s ease;

                }

                /* ==================================================
                   RODAPÉ
                ================================================== */

                .dashboard-footer {

                    position: relative;

                    z-index: 2;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    gap: 7px;

                    flex-wrap: wrap;

                    margin-top: 18px;

                    color: #596473;

                    font-size: 10px;

                    text-align: center;

                }

                .dashboard-footer strong {

                    color: #7f8a98;

                }

                .footer-dot {

                    width: 5px;

                    height: 5px;

                    border-radius: 50%;

                    background: #00e5ff;

                    box-shadow:
                        0 0 7px
                        rgba(0, 229, 255, .5);

                }

                .footer-separator {

                    color: #37404b;

                }

                /* ==================================================
                   ANIMAÇÕES
                ================================================== */

                @keyframes dashboardAppear {

                    from {

                        opacity: 0;

                        transform:
                            translateY(12px);

                    }

                    to {

                        opacity: 1;

                        transform:
                            translateY(0);

                    }

                }

                @keyframes dashboardCardIn {

                    from {

                        opacity: 0;

                        transform:
                            translateY(18px);

                    }

                    to {

                        opacity: 1;

                        transform:
                            translateY(0);

                    }

                }

                @keyframes dashboardPulse {

                    0%, 100% {

                        opacity: 1;

                        transform:
                            scale(1);

                    }

                    50% {

                        opacity: .45;

                        transform:
                            scale(.8);

                    }

                }

                @keyframes backgroundFloat {

                    0%, 100% {

                        transform:
                            translate(0, 0)
                            scale(1);

                    }

                    50% {

                        transform:
                            translate(35px, -25px)
                            scale(1.15);

                    }

                }

                /* ==================================================
                   RESPONSIVIDADE
                ================================================== */

                @media (max-width: 1200px) {

                    .dashboard-cards {

                        grid-template-columns:
                            repeat(3, minmax(0, 1fr));

                    }

                }

                @media (max-width: 900px) {

                    .dashboard-page {

                        padding:
                            22px 20px 30px;

                    }

                    .dashboard-grid {

                        grid-template-columns:
                            1fr;

                    }

                }

                @media (max-width: 650px) {

                    .dashboard-cards {

                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));

                    }

                    .dashboard-header {

                        align-items:
                            flex-start;

                    }

                    .dashboard-header-actions {

                        width: 100%;

                    }

                    .system-status {

                        flex: 1;

                    }

                    .refresh-button {

                        flex-shrink: 0;

                    }

                    .dashboard-panel {

                        padding: 18px;

                    }

                }

                @media (max-width: 430px) {

                    .dashboard-cards {

                        grid-template-columns:
                            1fr;

                    }

                    .dashboard-page {

                        padding:
                            18px 14px 25px;

                    }

                    .dashboard-header h1 {

                        font-size: 28px;

                    }

                    .panel-heading {

                        flex-direction:
                            column;

                    }

                    .average-box {

                        align-items:
                            flex-start;

                    }

                    .dashboard-header-actions {

                        flex-direction:
                            column;

                        align-items:
                            stretch;

                    }

                    .system-status {

                        justify-content:
                            center;

                    }

                    .refresh-button {

                        justify-content:
                            center;

                    }

                }

            `}</style>

        </div>

    );

}