import { useEffect, useMemo, useState } from 'react';

import {
    AppBar,
    Box,
    Button,
    Container,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography
} from '@mui/material';

import Login from './Login.jsx';
import Alunos from './Alunos.jsx';
import Professores from './Professores.jsx';
import Turmas from './Turmas.jsx';
import Disciplinas from './Disciplinas.jsx';
import Notas from './Notas.jsx';
import Auditoria from './Auditoria.jsx';
import Dashboard from './Dashboard.jsx';


const API_URL =
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000';


const drawerWidth = 240;


// ======================================================
// MENU
// ======================================================

const menuItems = [

    {
        key: 'inicio',
        label: 'Início',
        description: 'Visão geral do sistema',
        perfis: ['admin', 'professor', 'aluno']
    },

    {
        key: 'alunos',
        label: 'Alunos',
        description: 'Cadastro e consulta de estudantes',
        perfis: ['admin', 'professor']
    },

    {
        key: 'professores',
        label: 'Professores',
        description: 'Gestão da equipe',
        perfis: ['admin']
    },

    {
        key: 'turmas',
        label: 'Turmas',
        description: 'Organização escolar',
        perfis: ['admin', 'professor']
    },

    {
        key: 'disciplinas',
        label: 'Disciplinas',
        description: 'Cadastro de disciplinas',
        perfis: ['admin', 'professor']
    },

    {
        key: 'notas',
        label: 'Notas',
        description: 'Lançamento e boletim dos alunos',
        perfis: ['admin', 'professor', 'aluno']
    },

    {
        key: 'financeiro',
        label: 'Financeiro',
        description: 'Mensalidades e contas',
        perfis: ['admin']
    },

    {
        key: 'relatorios',
        label: 'Relatórios',
        description: 'Relatórios do sistema',
        perfis: ['admin', 'professor']
    },

    {
        key: 'auditoria',
        label: 'Auditoria',
        description: 'Histórico de operações do sistema',
        perfis: ['admin']
    }

];


// ======================================================
// USUÁRIO SALVO
// ======================================================

function obterUsuarioSalvo() {

    try {

        const valor =
            localStorage.getItem('usuarioLogado');

        return valor
            ? JSON.parse(valor)
            : null;

    } catch {

        return null;

    }

}


// ======================================================
// TOKEN
// ======================================================

function obterToken() {

    return localStorage.getItem('token');

}


// ======================================================
// LIMPAR SESSÃO
// ======================================================

function limparSessao() {

    localStorage.removeItem('token');

    localStorage.removeItem('usuarioLogado');

}


// ======================================================
// APP
// ======================================================

function App() {

    const [usuario, setUsuario] = useState(
        () => obterUsuarioSalvo()
    );


    const [view, setView] =
        useState('inicio');


    const [validandoSessao, setValidandoSessao] =
        useState(
            () => Boolean(obterToken())
        );


    const token =
        obterToken();


    // ==================================================
    // VALIDAR SESSÃO
    // ==================================================

    useEffect(() => {

        let ativo = true;


        async function validarSessao() {

            const tokenAtual =
                obterToken();


            if (!tokenAtual) {

                if (ativo) {

                    setValidandoSessao(false);

                    setUsuario(null);

                }

                return;

            }


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/auth/me`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${tokenAtual}`
                            }
                        }
                    );


                if (!resposta.ok) {

                    limparSessao();


                    if (ativo) {

                        setUsuario(null);

                    }

                    return;

                }


                const dados =
                    await resposta.json();


                if (
                    ativo &&
                    dados.usuario
                ) {

                    setUsuario(
                        dados.usuario
                    );


                    localStorage.setItem(
                        'usuarioLogado',
                        JSON.stringify(
                            dados.usuario
                        )
                    );

                }


            } catch (erro) {

                console.error(
                    'Erro ao validar sessão:',
                    erro
                );


            } finally {

                if (ativo) {

                    setValidandoSessao(false);

                }

            }

        }


        validarSessao();


        return () => {

            ativo = false;

        };

    }, []);


    // ==================================================
    // MENU PERMITIDO
    // ==================================================

    const menuPermitido =
        useMemo(() => {

            if (!usuario?.perfil) {

                return [];

            }


            return menuItems.filter(
                (item) =>
                    item.perfis.includes(
                        usuario.perfil
                    )
            );

        }, [usuario]);


    // ==================================================
    // GARANTIR VIEW PERMITIDA
    // ==================================================

    useEffect(() => {

        if (!usuario) {

            return;

        }


        const aindaPermitido =
            menuPermitido.some(
                (item) =>
                    item.key === view
            );


        if (!aindaPermitido) {

            setView('inicio');

        }

    }, [
        usuario,
        menuPermitido,
        view
    ]);


    // ==================================================
    // LOGIN
    // ==================================================

    function handleLogin(usuarioLogado) {

        if (!usuarioLogado) {

            return;

        }


        setUsuario(
            usuarioLogado
        );


        setView('inicio');


        setValidandoSessao(false);

    }


    // ==================================================
    // LOGOUT
    // ==================================================

    function handleLogout() {

        limparSessao();


        setUsuario(null);


        setView('inicio');

    }


    // ==================================================
    // CONTEÚDO
    // ==================================================

    function renderConteudo() {

        switch (view) {

            // ------------------------------------------
            // DASHBOARD
            // ------------------------------------------

            case 'inicio':

                return (
                    <Dashboard />
                );


            // ------------------------------------------
            // ALUNOS
            // ------------------------------------------

            case 'alunos':

                return (
                    <Alunos />
                );


            // ------------------------------------------
            // PROFESSORES
            // ------------------------------------------

            case 'professores':

                return (
                    <Professores />
                );


            // ------------------------------------------
            // TURMAS
            // ------------------------------------------

            case 'turmas':

                return (
                    <Turmas />
                );


            // ------------------------------------------
            // DISCIPLINAS
            // ------------------------------------------

            case 'disciplinas':

                return (
                    <Disciplinas />
                );


            // ------------------------------------------
            // NOTAS
            // ------------------------------------------

            case 'notas':

                return (
                    <Notas />
                );


            // ------------------------------------------
            // AUDITORIA
            // ------------------------------------------

            case 'auditoria':

                return (
                    <Auditoria />
                );


            // ------------------------------------------
            // FINANCEIRO
            // ------------------------------------------

            case 'financeiro':

                return (

                    <Box>

                        <Typography
                            variant="h5"
                            gutterBottom
                        >
                            Financeiro
                        </Typography>


                        <Typography>
                            Área financeira do sistema escolar.
                        </Typography>

                    </Box>

                );


            // ------------------------------------------
            // RELATÓRIOS
            // ------------------------------------------

            case 'relatorios':

                return (

                    <Box>

                        <Typography
                            variant="h5"
                            gutterBottom
                        >
                            Relatórios
                        </Typography>


                        <Typography>
                            Relatórios do sistema escolar.
                        </Typography>

                    </Box>

                );


            // ------------------------------------------
            // PADRÃO
            // ------------------------------------------

            default:

                return (
                    <Dashboard />
                );

        }

    }


    // ==================================================
    // VALIDANDO SESSÃO
    // ==================================================

    if (validandoSessao) {

        return (

            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >

                <Typography>
                    Validando sessão...
                </Typography>

            </Box>

        );

    }


    // ==================================================
    // LOGIN
    // ==================================================

    if (!token || !usuario) {

        return (
            <Login
                onLogin={handleLogin}
            />
        );

    }


    // ==================================================
    // SISTEMA
    // ==================================================

    return (

        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh'
            }}
        >

            <CssBaseline />


            {/* ==========================================
                BARRA SUPERIOR
            ========================================== */}

            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) =>
                        theme.zIndex.drawer + 1
                }}
            >

                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent:
                            'space-between',
                        gap: 2
                    }}
                >

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                    >
                        Sistema Escolar
                    </Typography>


                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >

                        <Typography
                            variant="body2"
                            noWrap
                        >

                            {usuario.nome}

                            {' ('}

                            {usuario.perfil}

                            {')'}

                        </Typography>


                        <Button
                            color="inherit"
                            variant="outlined"
                            onClick={handleLogout}
                        >
                            Sair
                        </Button>

                    </Box>

                </Toolbar>

            </AppBar>


            {/* ==========================================
                MENU LATERAL
            ========================================== */}

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,

                    '& .MuiDrawer-paper': {

                        width: drawerWidth,

                        boxSizing:
                            'border-box'

                    }
                }}
            >

                <Toolbar />


                <Box
                    sx={{
                        overflow: 'auto'
                    }}
                >

                    <List>

                        {menuPermitido.map(
                            (item) => (

                                <ListItem
                                    key={item.key}
                                    disablePadding
                                >

                                    <ListItemButton
                                        selected={
                                            view ===
                                            item.key
                                        }
                                        onClick={() =>
                                            setView(
                                                item.key
                                            )
                                        }
                                    >

                                        <ListItemText
                                            primary={
                                                item.label
                                            }
                                            secondary={
                                                item.description
                                            }
                                        />

                                    </ListItemButton>

                                </ListItem>

                            )
                        )}

                    </List>

                </Box>

            </Drawer>


            {/* ==========================================
                CONTEÚDO PRINCIPAL
            ========================================== */}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3
                }}
            >

                <Toolbar />


                <Container maxWidth="xl">

                    {renderConteudo()}

                </Container>

            </Box>

        </Box>

    );

}


export default App;