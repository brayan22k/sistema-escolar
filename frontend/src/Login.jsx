import { useState } from 'react';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const [hoverCard, setHoverCard] = useState(false);
    const [clicandoCard, setClicandoCard] = useState(false);

    async function fazerLogin(e) {
        e.preventDefault();

        setErro('');
        setCarregando(true);

        try {
            const resposta = await fetch(
                'http://localhost:3000/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        senha
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                setErro(
                    dados.erro ||
                    'E-mail ou senha inválidos'
                );
                return;
            }

            // ==========================================
            // SALVAR TOKEN JWT
            // ==========================================

            localStorage.setItem(
                'token',
                dados.token
            );

            // ==========================================
            // SALVAR USUÁRIO LOGADO
            // ==========================================

            localStorage.setItem(
                'usuarioLogado',
                JSON.stringify(dados.usuario)
            );

            // ==========================================
            // ENTRAR NO SISTEMA
            // ==========================================

            onLogin(dados.usuario);

        } catch (erro) {
            console.error(erro);

            setErro(
                'Não foi possível conectar ao servidor.'
            );

        } finally {
            setCarregando(false);
        }
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                background:
                    'radial-gradient(circle at top, #292929 0%, #111 45%, #050505 100%)',

                color: '#fff',

                fontFamily:
                    'Arial, Helvetica, sans-serif',

                padding: '20px',
                boxSizing: 'border-box'
            }}
        >

            {/* =========================================
                CARD DE LOGIN
            ========================================= */}

            <form
                onSubmit={fazerLogin}

                onMouseEnter={() =>
                    setHoverCard(true)
                }

                onMouseLeave={() => {
                    setHoverCard(false);
                    setClicandoCard(false);
                }}

                onMouseDown={() =>
                    setClicandoCard(true)
                }

                onMouseUp={() =>
                    setClicandoCard(false)
                }

                style={{
                    width: '100%',
                    maxWidth: '420px',

                    padding: '42px',

                    boxSizing: 'border-box',

                    background:
                        'rgba(25, 25, 25, 0.90)',

                    backdropFilter:
                        'blur(20px)',

                    WebkitBackdropFilter:
                        'blur(20px)',

                    borderRadius: '22px',

                    border: hoverCard
                        ? '1px solid rgba(255,255,255,0.50)'
                        : '1px solid rgba(255,255,255,0.12)',

                    boxShadow: clicandoCard
                        ? `
                            0 0 12px rgba(255,255,255,0.7),
                            0 0 30px rgba(255,255,255,0.45),
                            0 0 70px rgba(255,255,255,0.20),
                            0 25px 70px rgba(0,0,0,0.75)
                        `
                        : hoverCard
                            ? `
                                0 0 12px rgba(255,255,255,0.35),
                                0 0 35px rgba(255,255,255,0.18),
                                0 0 70px rgba(255,255,255,0.08),
                                0 25px 70px rgba(0,0,0,0.70)
                            `
                            : `
                                0 25px 70px rgba(0,0,0,0.65),
                                0 0 35px rgba(255,255,255,0.04)
                            `,

                    transform: clicandoCard
                        ? 'scale(0.985)'
                        : hoverCard
                            ? 'translateY(-5px)'
                            : 'translateY(0)',

                    transition:
                        'all 0.25s ease',

                    position: 'relative',

                    overflow: 'hidden'
                }}
            >

                {/* =====================================
                    BRILHO SUPERIOR
                ====================================== */}

                <div
                    style={{
                        position: 'absolute',

                        top: 0,
                        left: '5%',

                        width: '90%',
                        height: '2px',

                        background:
                            hoverCard
                                ? 'linear-gradient(90deg, transparent, #fff, transparent)'
                                : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',

                        boxShadow:
                            hoverCard
                                ? '0 0 25px rgba(255,255,255,0.8)'
                                : 'none',

                        transition:
                            'all 0.3s ease'
                    }}
                />

                {/* =====================================
                    LOGO
                ====================================== */}

                <div
                    style={{
                        width: '60px',
                        height: '60px',

                        margin:
                            '0 auto 22px',

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                        borderRadius: '17px',

                        background:
                            'linear-gradient(145deg, #383838, #151515)',

                        border:
                            hoverCard
                                ? '1px solid rgba(255,255,255,0.4)'
                                : '1px solid rgba(255,255,255,0.15)',

                        boxShadow:
                            hoverCard
                                ? '0 0 25px rgba(255,255,255,0.20)'
                                : '0 10px 30px rgba(0,0,0,0.4)',

                        fontSize: '24px',

                        fontWeight: 'bold',

                        transition:
                            'all 0.3s ease'
                    }}
                >
                    SE
                </div>

                {/* =====================================
                    TÍTULO
                ====================================== */}

                <h1
                    style={{
                        textAlign: 'center',

                        margin: 0,

                        fontSize: '28px',

                        fontWeight: '600',

                        letterSpacing:
                            '-0.5px',

                        textShadow:
                            hoverCard
                                ? '0 0 15px rgba(255,255,255,0.25)'
                                : 'none',

                        transition:
                            'all 0.3s ease'
                    }}
                >
                    Sistema Escolar
                </h1>

                <p
                    style={{
                        textAlign: 'center',

                        color: '#999',

                        marginTop: '10px',

                        marginBottom: '34px',

                        fontSize: '14px'
                    }}
                >
                    Entre na sua conta
                </p>

                {/* =====================================
                    E-MAIL
                ====================================== */}

                <label
                    style={{
                        display: 'block',

                        marginBottom: '9px',

                        fontSize: '14px',

                        color: '#ddd'
                    }}
                >
                    E-mail
                </label>

                <input
                    type="email"

                    value={email}

                    onChange={(e) =>
                        setEmail(e.target.value)
                    }

                    placeholder="Digite seu e-mail"

                    required

                    style={{
                        width: '100%',

                        height: '50px',

                        padding: '0 15px',

                        boxSizing: 'border-box',

                        borderRadius: '11px',

                        border:
                            '1px solid #3d3d3d',

                        background: '#151515',

                        color: '#fff',

                        outline: 'none',

                        fontSize: '14px',

                        marginBottom: '20px',

                        transition:
                            'all 0.2s ease'
                    }}
                />

                {/* =====================================
                    SENHA
                ====================================== */}

                <label
                    style={{
                        display: 'block',

                        marginBottom: '9px',

                        fontSize: '14px',

                        color: '#ddd'
                    }}
                >
                    Senha
                </label>

                <input
                    type="password"

                    value={senha}

                    onChange={(e) =>
                        setSenha(e.target.value)
                    }

                    placeholder="Digite sua senha"

                    required

                    style={{
                        width: '100%',

                        height: '50px',

                        padding: '0 15px',

                        boxSizing: 'border-box',

                        borderRadius: '11px',

                        border:
                            '1px solid #3d3d3d',

                        background: '#151515',

                        color: '#fff',

                        outline: 'none',

                        fontSize: '14px',

                        marginBottom: '20px',

                        transition:
                            'all 0.2s ease'
                    }}
                />

                {/* =====================================
                    ERRO
                ====================================== */}

                {erro && (
                    <div
                        style={{
                            padding:
                                '11px 13px',

                            marginBottom:
                                '18px',

                            borderRadius:
                                '10px',

                            background:
                                'rgba(255,70,70,0.08)',

                            border:
                                '1px solid rgba(255,70,70,0.25)',

                            color: '#ff7777',

                            fontSize: '13px',

                            textAlign: 'center'
                        }}
                    >
                        {erro}
                    </div>
                )}

                {/* =====================================
                    BOTÃO
                ====================================== */}

                <button
                    type="submit"

                    disabled={carregando}

                    style={{
                        width: '100%',

                        height: '50px',

                        border:
                            '1px solid rgba(255,255,255,0.2)',

                        borderRadius: '11px',

                        background:
                            'linear-gradient(135deg, #ffffff, #d8d8d8)',

                        color: '#111',

                        fontSize: '14px',

                        fontWeight: '700',

                        cursor:
                            carregando
                                ? 'not-allowed'
                                : 'pointer',

                        boxShadow:
                            '0 8px 25px rgba(255,255,255,0.12)',

                        transition:
                            'all 0.2s ease'
                    }}
                >
                    {carregando
                        ? 'Entrando...'
                        : 'ENTRAR'}
                </button>

                {/* =====================================
                    RODAPÉ
                ====================================== */}

                <p
                    style={{
                        textAlign: 'center',

                        color: '#666',

                        fontSize: '12px',

                        marginTop: '25px',

                        marginBottom: 0
                    }}
                >
                    Sistema de gerenciamento escolar
                </p>

            </form>
        </div>
    );
}