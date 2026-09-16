import React, { useState } from 'react';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const [hoverCard, setHoverCard] = useState(false);
    const [clicandoCard, setClicandoCard] = useState(false);

    const [campoFoco, setCampoFoco] = useState('');

    const [mostrarRecuperacao, setMostrarRecuperacao] =
        useState(false);

    const [emailRecuperacao, setEmailRecuperacao] =
        useState('');

    const [mensagemRecuperacao, setMensagemRecuperacao] =
        useState('');

    const [erroRecuperacao, setErroRecuperacao] =
        useState('');

    const [enviandoRecuperacao, setEnviandoRecuperacao] =
        useState(false);

    /*
     * ==========================================================
     * CONFIGURAÇÃO
     * ==========================================================
     */

    const VERSAO_SISTEMA = '1.0.0';

    const API_URL = 'http://localhost:3000';

    /*
     * ==========================================================
     * LOGIN
     * ==========================================================
     */

    const fazerLogin = async (e) => {
        e.preventDefault();

        if (carregando) {
            return;
        }

        setErro('');

        const emailLimpo = email.trim();

        if (!emailLimpo || !senha) {
            setErro(
                'Preencha o e-mail e a senha para continuar.'
            );

            return;
        }

        setCarregando(true);

        try {
            console.log(
                'Tentando realizar login...'
            );

            const resposta = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        email: emailLimpo,
                        senha
                    })
                }
            );

            let dados = {};

            try {
                dados = await resposta.json();
            } catch {
                dados = {};
            }

            console.log(
                'Status do login:',
                resposta.status
            );

            if (!resposta.ok) {
                throw new Error(
                    dados.erro ||
                    dados.mensagem ||
                    'E-mail ou senha inválidos.'
                );
            }

            if (!dados.token) {
                throw new Error(
                    'O servidor não retornou o token de acesso.'
                );
            }

            const usuario =
                dados.professor ||
                dados.usuario ||
                dados;

            /*
             * Não mostrar token no console.
             */

            localStorage.setItem(
                'token',
                dados.token
            );

            localStorage.setItem(
                'usuario',
                JSON.stringify(usuario)
            );

            /*
             * Compatibilidade com versões
             * anteriores do sistema.
             */

            localStorage.removeItem(
                'professorLogado'
            );

            console.log(
                'Login realizado com sucesso.'
            );

            if (
                typeof onLogin ===
                'function'
            ) {
                onLogin(usuario);
            }

        } catch (error) {
            console.error(
                'Erro no login:',
                error.message
            );

            setErro(
                error.message ||
                'Não foi possível realizar o login.'
            );

        } finally {
            setCarregando(false);
            setClicandoCard(false);
        }
    };

    /*
     * ==========================================================
     * RECUPERAÇÃO DE SENHA
     * ==========================================================
     */

    const abrirRecuperacao = () => {
        setMostrarRecuperacao(true);

        setEmailRecuperacao(email.trim());

        setMensagemRecuperacao('');

        setErroRecuperacao('');
    };

    const fecharRecuperacao = () => {
        if (enviandoRecuperacao) {
            return;
        }

        setMostrarRecuperacao(false);

        setMensagemRecuperacao('');

        setErroRecuperacao('');
    };

    const solicitarRecuperacao = async (e) => {
        e.preventDefault();

        if (enviandoRecuperacao) {
            return;
        }

        setMensagemRecuperacao('');
        setErroRecuperacao('');

        const emailLimpo =
            emailRecuperacao.trim();

        if (!emailLimpo) {
            setErroRecuperacao(
                'Digite o e-mail da sua conta.'
            );

            return;
        }

        setEnviandoRecuperacao(true);

        try {
            /*
             * IMPORTANTE:
             *
             * Esta rota será criada no backend
             * na próxima etapa.
             */

            const resposta = await fetch(
                `${API_URL}/auth/recuperar-senha`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        email: emailLimpo
                    })
                }
            );

            let dados = {};

            try {
                dados = await resposta.json();
            } catch {
                dados = {};
            }

            if (!resposta.ok) {
                throw new Error(
                    dados.erro ||
                    dados.mensagem ||
                    'Não foi possível solicitar a recuperação.'
                );
            }

            setMensagemRecuperacao(
                dados.mensagem ||
                'Se o e-mail estiver cadastrado, as instruções de recuperação serão enviadas.'
            );

        } catch (error) {
            console.error(
                'Erro na recuperação:',
                error.message
            );

            /*
             * Até o backend ser implementado,
             * mostramos uma mensagem amigável.
             */

            setErroRecuperacao(
                error.message ||
                'Não foi possível solicitar a recuperação.'
            );

        } finally {
            setEnviandoRecuperacao(false);
        }
    };

    /*
     * ==========================================================
     * CARD
     * ==========================================================
     */

    const pressionouCard = () => {
        setClicandoCard(true);
    };

    const soltouCard = () => {
        setClicandoCard(false);
    };

    /*
     * ==========================================================
     * ESTILOS / ANIMAÇÕES
     * ==========================================================
     */

    const estiloAnimacoes = `
        @keyframes loginSpinner {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }

        @keyframes loginEntrada {
            from {
                opacity: 0;
                transform: translateY(25px) scale(0.98);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        @keyframes loginErro {
            0% {
                opacity: 0;
                transform: translateY(-6px);
            }

            60% {
                transform: translateY(2px);
            }

            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes loginModal {
            from {
                opacity: 0;
                transform: scale(0.96) translateY(10px);
            }

            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes loginPulse {
            0% {
                box-shadow:
                    0 0 0 rgba(255,255,255,0);
            }

            50% {
                box-shadow:
                    0 0 30px rgba(255,255,255,0.10);
            }

            100% {
                box-shadow:
                    0 0 0 rgba(255,255,255,0);
            }
        }

        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;

    /*
     * ==========================================================
     * INPUT
     * ==========================================================
     */

    const estiloInput = (nomeCampo) => ({
        width: '100%',

        height: '50px',

        boxSizing: 'border-box',

        padding:
            nomeCampo === 'senha'
                ? '0 50px 0 15px'
                : '0 15px',

        borderRadius: '11px',

        border:
            campoFoco === nomeCampo
                ? '1px solid rgba(255,255,255,0.55)'
                : '1px solid rgba(255,255,255,0.13)',

        outline: 'none',

        background:
            campoFoco === nomeCampo
                ? 'rgba(255,255,255,0.055)'
                : 'rgba(0,0,0,0.35)',

        color: '#fff',

        fontSize: '14px',

        transition:
            'all 0.2s ease',

        boxShadow:
            campoFoco === nomeCampo
                ? '0 0 20px rgba(255,255,255,0.08)'
                : 'none',

        opacity:
            carregando
                ? 0.65
                : 1
    });

    /*
     * ==========================================================
     * RETORNO
     * ==========================================================
     */

    return (
        <>
            <style>
                {estiloAnimacoes}
            </style>

            <div
                style={{
                    minHeight: '100vh',

                    width: '100%',

                    display: 'flex',

                    alignItems: 'center',

                    justifyContent: 'center',

                    padding: '30px 20px',

                    boxSizing: 'border-box',

                    background:
                        'radial-gradient(circle at 50% 20%, #252525 0%, #111 35%, #050505 75%, #000 100%)',

                    color: '#fff',

                    fontFamily:
                        'Inter, Arial, Helvetica, sans-serif',

                    position: 'relative',

                    overflow: 'hidden'
                }}
            >

                {/* ==================================================
                    BRILHO SUPERIOR
                ================================================== */}

                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',

                        width: '500px',

                        height: '500px',

                        borderRadius: '50%',

                        background:
                            'radial-gradient(circle, rgba(255,255,255,0.07), transparent 65%)',

                        top: '-250px',

                        left: '50%',

                        transform:
                            'translateX(-50%)',

                        pointerEvents:
                            'none'
                    }}
                />

                {/* ==================================================
                    BRILHO INFERIOR
                ================================================== */}

                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',

                        width: '450px',

                        height: '450px',

                        borderRadius: '50%',

                        background:
                            'radial-gradient(circle, rgba(255,255,255,0.04), transparent 65%)',

                        bottom: '-250px',

                        right: '-150px',

                        pointerEvents:
                            'none'
                    }}
                />

                {/* ==================================================
                    CARD PRINCIPAL
                ================================================== */}

                <div
                    onMouseEnter={() =>
                        setHoverCard(true)
                    }

                    onMouseLeave={() =>
                        setHoverCard(false)
                    }

                    onMouseDown={
                        pressionouCard
                    }

                    onMouseUp={
                        soltouCard
                    }

                    style={{
                        width: '100%',

                        maxWidth: '430px',

                        padding: '42px 38px',

                        boxSizing:
                            'border-box',

                        background:
                            'linear-gradient(145deg, rgba(35,35,35,0.96), rgba(12,12,12,0.98))',

                        border:
                            hoverCard ||
                            clicandoCard
                                ? '1px solid rgba(255,255,255,0.32)'
                                : '1px solid rgba(255,255,255,0.12)',

                        borderRadius: '22px',

                        boxShadow:
                            clicandoCard
                                ? '0 0 55px rgba(255,255,255,0.16), 0 25px 70px rgba(0,0,0,0.8)'
                                : hoverCard
                                    ? '0 0 40px rgba(255,255,255,0.10), 0 25px 70px rgba(0,0,0,0.75)'
                                    : '0 20px 60px rgba(0,0,0,0.65)',

                        backdropFilter:
                            'blur(18px)',

                        WebkitBackdropFilter:
                            'blur(18px)',

                        transition:
                            'all 0.25s ease',

                        transform:
                            clicandoCard
                                ? 'scale(0.99)'
                                : hoverCard
                                    ? 'translateY(-2px)'
                                    : 'translateY(0)',

                        animation:
                            'loginEntrada 0.5s ease',

                        position: 'relative',

                        zIndex: 2
                    }}
                >

                    {/* ==================================================
                        LOGO SE
                    ================================================== */}

                    <div
                        style={{
                            display: 'flex',

                            justifyContent:
                                'center',

                            marginBottom: '25px'
                        }}
                    >
                        <div
                            role="img"

                            aria-label="Logo Sistema Escolar"

                            style={{
                                width: '82px',

                                height: '82px',

                                borderRadius:
                                    '22px',

                                display: 'flex',

                                alignItems:
                                    'center',

                                justifyContent:
                                    'center',

                                background:
                                    'linear-gradient(145deg, #303030, #0b0b0b)',

                                border:
                                    '1px solid rgba(255,255,255,0.25)',

                                boxShadow:
                                    'inset 0 1px 0 rgba(255,255,255,0.10), 0 0 35px rgba(255,255,255,0.08)',

                                position:
                                    'relative',

                                overflow:
                                    'hidden'
                            }}
                        >
                            <div
                                aria-hidden="true"
                                style={{
                                    position:
                                        'absolute',

                                    inset: 0,

                                    background:
                                        'linear-gradient(135deg, rgba(255,255,255,0.12), transparent 45%)'
                                }}
                            />

                            <span
                                style={{
                                    position:
                                        'relative',

                                    fontSize:
                                        '27px',

                                    fontWeight:
                                        '900',

                                    letterSpacing:
                                        '-2px',

                                    color: '#fff',

                                    textShadow:
                                        '0 0 15px rgba(255,255,255,0.20)'
                                }}
                            >
                                SE
                            </span>
                        </div>
                    </div>

                    {/* ==================================================
                        TÍTULO
                    ================================================== */}

                    <div
                        style={{
                            textAlign:
                                'center',

                            marginBottom:
                                '30px'
                        }}
                    >
                        <h1
                            style={{
                                margin: 0,

                                fontSize:
                                    '29px',

                                fontWeight:
                                    '800',

                                letterSpacing:
                                    '-0.7px',

                                color: '#fff'
                            }}
                        >
                            Sistema Escolar
                        </h1>

                        <p
                            style={{
                                margin:
                                    '9px 0 0',

                                color:
                                    '#999',

                                fontSize:
                                    '14px'
                            }}
                        >
                            Entre na sua conta
                        </p>
                    </div>

                    {/* ==================================================
                        FORMULÁRIO
                    ================================================== */}

                    <form
                        onSubmit={
                            fazerLogin
                        }
                    >

                        {/* ==================================================
                            EMAIL
                        ================================================== */}

                        <div
                            style={{
                                marginBottom:
                                    '20px'
                            }}
                        >
                            <label
                                htmlFor="login-email"

                                style={{
                                    display:
                                        'block',

                                    marginBottom:
                                        '8px',

                                    fontSize:
                                        '13px',

                                    fontWeight:
                                        '600',

                                    color:
                                        '#d0d0d0'
                                }}
                            >
                                E-mail
                            </label>

                            <input
                                id="login-email"

                                name="email"

                                type="email"

                                value={email}

                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }

                                onFocus={() =>
                                    setCampoFoco(
                                        'email'
                                    )
                                }

                                onBlur={() =>
                                    setCampoFoco(
                                        ''
                                    )
                                }

                                placeholder="Digite seu e-mail"

                                autoComplete="username"

                                disabled={
                                    carregando
                                }

                                aria-invalid={
                                    erro
                                        ? 'true'
                                        : 'false'
                                }

                                aria-describedby={
                                    erro
                                        ? 'login-erro'
                                        : undefined
                                }

                                style={estiloInput(
                                    'email'
                                )}
                            />
                        </div>

                        {/* ==================================================
                            SENHA
                        ================================================== */}

                        <div
                            style={{
                                marginBottom:
                                    '10px'
                            }}
                        >
                            <label
                                htmlFor="login-senha"

                                style={{
                                    display:
                                        'block',

                                    marginBottom:
                                        '8px',

                                    fontSize:
                                        '13px',

                                    fontWeight:
                                        '600',

                                    color:
                                        '#d0d0d0'
                                }}
                            >
                                Senha
                            </label>

                            <div
                                style={{
                                    position:
                                        'relative'
                                }}
                            >
                                <input
                                    id="login-senha"

                                    name="senha"

                                    type={
                                        mostrarSenha
                                            ? 'text'
                                            : 'password'
                                    }

                                    value={senha}

                                    onChange={(e) =>
                                        setSenha(
                                            e.target.value
                                        )
                                    }

                                    onFocus={() =>
                                        setCampoFoco(
                                            'senha'
                                        )
                                    }

                                    onBlur={() =>
                                        setCampoFoco(
                                            ''
                                        )
                                    }

                                    placeholder="Digite sua senha"

                                    autoComplete="current-password"

                                    disabled={
                                        carregando
                                    }

                                    style={estiloInput(
                                        'senha'
                                    )}
                                />

                                {/* MOSTRAR SENHA */}

                                <button
                                    type="button"

                                    onClick={() =>
                                        setMostrarSenha(
                                            !mostrarSenha
                                        )
                                    }

                                    disabled={
                                        carregando
                                    }

                                    aria-label={
                                        mostrarSenha
                                            ? 'Ocultar senha'
                                            : 'Mostrar senha'
                                    }

                                    style={{
                                        position:
                                            'absolute',

                                        right:
                                            '5px',

                                        top:
                                            '50%',

                                        transform:
                                            'translateY(-50%)',

                                        width:
                                            '42px',

                                        height:
                                            '42px',

                                        display:
                                            'flex',

                                        alignItems:
                                            'center',

                                        justifyContent:
                                            'center',

                                        border:
                                            'none',

                                        background:
                                            'transparent',

                                        color:
                                            '#aaa',

                                        cursor:
                                            carregando
                                                ? 'not-allowed'
                                                : 'pointer',

                                        borderRadius:
                                            '9px'
                                    }}
                                >
                                    {mostrarSenha ? (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />

                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="3"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M3 3l18 18" />

                                            <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18.3 18.3 0 0 1-3.1 4.4" />

                                            <path d="M6.6 6.6C3.6 8.5 2 12 2 12s3.5 8 10 8c1.7 0 3.2-.4 4.5-1.1" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ==================================================
                            ESQUECI SENHA
                        ================================================== */}

                        <div
                            style={{
                                display:
                                    'flex',

                                justifyContent:
                                    'flex-end',

                                marginBottom:
                                    '20px'
                            }}
                        >
                            <button
                                type="button"

                                onClick={
                                    abrirRecuperacao
                                }

                                disabled={
                                    carregando
                                }

                                style={{
                                    border:
                                        'none',

                                    background:
                                        'transparent',

                                    color:
                                        '#aaa',

                                    fontSize:
                                        '12px',

                                    cursor:
                                        carregando
                                            ? 'not-allowed'
                                            : 'pointer',

                                    padding:
                                        '4px 0',

                                    textDecoration:
                                        'underline',

                                    textUnderlineOffset:
                                        '3px'
                                }}
                            >
                                Esqueci minha senha
                            </button>
                        </div>

                        {/* ==================================================
                            ERRO
                        ================================================== */}

                        {erro && (
                            <div
                                id="login-erro"

                                role="alert"

                                style={{
                                    marginBottom:
                                        '18px',

                                    padding:
                                        '13px 14px',

                                    borderRadius:
                                        '11px',

                                    border:
                                        '1px solid rgba(255,255,255,0.20)',

                                    background:
                                        'rgba(255,255,255,0.06)',

                                    color:
                                        '#e7e7e7',

                                    fontSize:
                                        '13px',

                                    lineHeight:
                                        '1.4',

                                    display:
                                        'flex',

                                    alignItems:
                                        'center',

                                    gap:
                                        '10px',

                                    animation:
                                        'loginErro 0.3s ease'
                                }}
                            >
                                <span
                                    aria-hidden="true"

                                    style={{
                                        width:
                                            '24px',

                                        height:
                                            '24px',

                                        minWidth:
                                            '24px',

                                        borderRadius:
                                            '50%',

                                        display:
                                            'flex',

                                        alignItems:
                                            'center',

                                        justifyContent:
                                            'center',

                                        background:
                                            'rgba(255,255,255,0.10)',

                                        fontWeight:
                                            '800',

                                        fontSize:
                                            '14px'
                                    }}
                                >
                                    !
                                </span>

                                <span>
                                    {erro}
                                </span>
                            </div>
                        )}

                        {/* ==================================================
                            BOTÃO ENTRAR
                        ================================================== */}

                        <button
                            type="submit"

                            disabled={
                                carregando
                            }

                            aria-busy={
                                carregando
                            }

                            style={{
                                width:
                                    '100%',

                                height:
                                    '52px',

                                border:
                                    '1px solid rgba(255,255,255,0.2)',

                                borderRadius:
                                    '11px',

                                background:
                                    carregando
                                        ? 'linear-gradient(135deg, #d5d5d5, #a9a9a9)'
                                        : 'linear-gradient(135deg, #ffffff, #d8d8d8)',

                                color:
                                    '#111',

                                fontSize:
                                    '14px',

                                fontWeight:
                                    '800',

                                letterSpacing:
                                    '0.3px',

                                cursor:
                                    carregando
                                        ? 'not-allowed'
                                        : 'pointer',

                                opacity:
                                    carregando
                                        ? 0.75
                                        : 1,

                                boxShadow:
                                    carregando
                                        ? '0 5px 20px rgba(255,255,255,0.06)'
                                        : '0 8px 25px rgba(255,255,255,0.10)',

                                transition:
                                    'all 0.2s ease',

                                display:
                                    'flex',

                                alignItems:
                                    'center',

                                justifyContent:
                                    'center',

                                gap:
                                    '10px'
                            }}
                        >
                            {carregando ? (
                                <>
                                    <span
                                        aria-hidden="true"

                                        style={{
                                            width:
                                                '18px',

                                            height:
                                                '18px',

                                            border:
                                                '2px solid rgba(0,0,0,0.25)',

                                            borderTop:
                                                '2px solid #111',

                                            borderRadius:
                                                '50%',

                                            display:
                                                'inline-block',

                                            animation:
                                                'loginSpinner 0.7s linear infinite'
                                        }}
                                    />

                                    Entrando...
                                </>
                            ) : (
                                'ENTRAR'
                            )}
                        </button>
                    </form>

                    {/* ==================================================
                        RODAPÉ
                    ================================================== */}

                    <div
                        style={{
                            textAlign:
                                'center',

                            marginTop:
                                '28px',

                            paddingTop:
                                '20px',

                            borderTop:
                                '1px solid rgba(255,255,255,0.08)',

                            color:
                                '#666',

                            fontSize:
                                '11px'
                        }}
                    >
                        <div>
                            Sistema Escolar
                        </div>

                        <div
                            style={{
                                marginTop:
                                    '5px',

                                color:
                                    '#4f4f4f'
                            }}
                        >
                            Versão {VERSAO_SISTEMA}
                        </div>
                    </div>
                </div>

                {/* ==========================================================
                    MODAL DE RECUPERAÇÃO
                ========================================================== */}

                {mostrarRecuperacao && (
                    <div
                        role="dialog"

                        aria-modal="true"

                        aria-labelledby="titulo-recuperacao"

                        onMouseDown={(e) => {
                            if (
                                e.target ===
                                e.currentTarget
                            ) {
                                fecharRecuperacao();
                            }
                        }}

                        style={{
                            position:
                                'fixed',

                            inset: 0,

                            background:
                                'rgba(0,0,0,0.72)',

                            backdropFilter:
                                'blur(8px)',

                            WebkitBackdropFilter:
                                'blur(8px)',

                            display:
                                'flex',

                            alignItems:
                                'center',

                            justifyContent:
                                'center',

                            padding:
                                '20px',

                            zIndex:
                                10
                        }}
                    >
                        <div
                            style={{
                                width:
                                    '100%',

                                maxWidth:
                                    '420px',

                                background:
                                    'linear-gradient(145deg, #242424, #0d0d0d)',

                                border:
                                    '1px solid rgba(255,255,255,0.18)',

                                borderRadius:
                                    '20px',

                                padding:
                                    '30px',

                                boxSizing:
                                    'border-box',

                                boxShadow:
                                    '0 30px 80px rgba(0,0,0,0.8)',

                                animation:
                                    'loginModal 0.25s ease'
                            }}
                        >
                            <div
                                style={{
                                    display:
                                        'flex',

                                    justifyContent:
                                        'space-between',

                                    alignItems:
                                        'center',

                                    marginBottom:
                                        '10px'
                                }}
                            >
                                <h2
                                    id="titulo-recuperacao"

                                    style={{
                                        margin: 0,

                                        fontSize:
                                            '21px',

                                        color:
                                            '#fff'
                                    }}
                                >
                                    Recuperar senha
                                </h2>

                                <button
                                    type="button"

                                    onClick={
                                        fecharRecuperacao
                                    }

                                    disabled={
                                        enviandoRecuperacao
                                    }

                                    aria-label="Fechar recuperação de senha"

                                    style={{
                                        width:
                                            '34px',

                                        height:
                                            '34px',

                                        borderRadius:
                                            '9px',

                                        border:
                                            '1px solid rgba(255,255,255,0.12)',

                                        background:
                                            'rgba(255,255,255,0.05)',

                                        color:
                                            '#aaa',

                                        cursor:
                                            'pointer',

                                        fontSize:
                                            '18px'
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            <p
                                style={{
                                    color:
                                        '#999',

                                    fontSize:
                                        '13px',

                                    lineHeight:
                                        '1.5',

                                    margin:
                                        '0 0 22px'
                                }}
                            >
                                Digite o e-mail cadastrado
                                para solicitar a recuperação
                                da sua senha.
                            </p>

                            <form
                                onSubmit={
                                    solicitarRecuperacao
                                }
                            >
                                <label
                                    htmlFor="email-recuperacao"

                                    style={{
                                        display:
                                            'block',

                                        marginBottom:
                                            '8px',

                                        fontSize:
                                            '13px',

                                        color:
                                            '#d0d0d0',

                                        fontWeight:
                                            '600'
                                    }}
                                >
                                    E-mail
                                </label>

                                <input
                                    id="email-recuperacao"

                                    type="email"

                                    value={
                                        emailRecuperacao
                                    }

                                    onChange={(e) =>
                                        setEmailRecuperacao(
                                            e.target.value
                                        )
                                    }

                                    placeholder="Digite seu e-mail"

                                    autoComplete="email"

                                    disabled={
                                        enviandoRecuperacao
                                    }

                                    autoFocus

                                    style={{
                                        width:
                                            '100%',

                                        height:
                                            '50px',

                                        boxSizing:
                                            'border-box',

                                        padding:
                                            '0 15px',

                                        borderRadius:
                                            '11px',

                                        border:
                                            '1px solid rgba(255,255,255,0.15)',

                                        outline:
                                            'none',

                                        background:
                                            'rgba(0,0,0,0.35)',

                                        color:
                                            '#fff',

                                        fontSize:
                                            '14px',

                                        marginBottom:
                                            '15px'
                                    }}
                                />

                                {erroRecuperacao && (
                                    <div
                                        role="alert"

                                        style={{
                                            padding:
                                                '11px 12px',

                                            marginBottom:
                                                '15px',

                                            borderRadius:
                                                '10px',

                                            background:
                                                'rgba(255,255,255,0.06)',

                                            border:
                                                '1px solid rgba(255,255,255,0.15)',

                                            color:
                                                '#ddd',

                                            fontSize:
                                                '12px'
                                        }}
                                    >
                                        {erroRecuperacao}
                                    </div>
                                )}

                                {mensagemRecuperacao && (
                                    <div
                                        role="status"

                                        style={{
                                            padding:
                                                '11px 12px',

                                            marginBottom:
                                                '15px',

                                            borderRadius:
                                                '10px',

                                            background:
                                                'rgba(255,255,255,0.06)',

                                            border:
                                                '1px solid rgba(255,255,255,0.15)',

                                            color:
                                                '#ddd',

                                            fontSize:
                                                '12px',

                                            lineHeight:
                                                '1.4'
                                        }}
                                    >
                                        {mensagemRecuperacao}
                                    </div>
                                )}

                                <button
                                    type="submit"

                                    disabled={
                                        enviandoRecuperacao
                                    }

                                    style={{
                                        width:
                                            '100%',

                                        height:
                                            '48px',

                                        border:
                                            'none',

                                        borderRadius:
                                            '10px',

                                        background:
                                            '#fff',

                                        color:
                                            '#111',

                                        fontWeight:
                                            '800',

                                        cursor:
                                            enviandoRecuperacao
                                                ? 'not-allowed'
                                                : 'pointer',

                                        opacity:
                                            enviandoRecuperacao
                                                ? 0.7
                                                : 1,

                                        display:
                                            'flex',

                                        alignItems:
                                            'center',

                                        justifyContent:
                                            'center',

                                        gap:
                                            '9px'
                                    }}
                                >
                                    {enviandoRecuperacao ? (
                                        <>
                                            <span
                                                style={{
                                                    width:
                                                        '16px',

                                                    height:
                                                        '16px',

                                                    border:
                                                        '2px solid rgba(0,0,0,0.25)',

                                                    borderTop:
                                                        '2px solid #111',

                                                    borderRadius:
                                                        '50%',

                                                    animation:
                                                        'loginSpinner 0.7s linear infinite'
                                                }}
                                            />

                                            Enviando...
                                        </>
                                    ) : (
                                        'RECUPERAR SENHA'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}