import { useState } from 'react';

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

import Turmas from './Turmas.jsx';
import Notas from './Notas.jsx';
import Alunos from './Alunos.jsx';
import Professores from './Professores.jsx';
import Disciplinas from './Disciplinas.jsx';

const drawerWidth = 240;

function App() {

    // ======================================================
    // USUÁRIO LOGADO
    // ======================================================

    const [usuario, setUsuario] = useState(() => {
        const salvo = localStorage.getItem('usuarioLogado');

        return salvo ? JSON.parse(salvo) : null;
    });

    const [view, setView] = useState('inicio');

    // ======================================================
    // LOGIN
    // ======================================================

    function handleLogin(dadosUsuario) {
        setUsuario(dadosUsuario);
        setView('inicio');
    }

    // ======================================================
    // LOGOUT
    // ======================================================

    function handleLogout() {
        localStorage.removeItem('usuarioLogado');
        localStorage.removeItem('token');

        setUsuario(null);
        setView('inicio');
    }

    // ======================================================
    // SE NÃO ESTIVER LOGADO
    // ======================================================

    if (!usuario) {
        return <Login onLogin={handleLogin} />;
    }

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
            description: 'Cadastro de alunos',
            perfis: ['admin', 'professor', 'aluno']
        },

        {
            key: 'professores',
            label: 'Professores',
            description: 'Cadastro de professores',
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
            perfis: ['admin']
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
        }

    ];

    // ======================================================
    // FILTRAR MENU PELO PERFIL
    // ======================================================

    const menuPermitido = menuItems.filter((item) =>
        item.perfis.includes(usuario.perfil)
    );

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

                <Toolbar>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                    >
                        Sistema Escolar
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <Typography
                        sx={{
                            mr: 2
                        }}
                    >
                        {usuario.nome} ({usuario.perfil})
                    </Typography>

                    <Button
                        color="inherit"
                        onClick={handleLogout}
                    >
                        Sair
                    </Button>

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
                        boxSizing: 'border-box'
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

                        {menuPermitido.map((item) => (

                            <ListItem
                                key={item.key}
                                disablePadding
                            >

                                <ListItemButton
                                    selected={
                                        view === item.key
                                    }

                                    onClick={() =>
                                        setView(item.key)
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

                        ))}

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

                    {/* ======================================
                        INÍCIO
                    ====================================== */}

                    {view === 'inicio' && (

                        <Box>

                            <Typography
                                variant="h4"
                                gutterBottom
                            >
                                Sistema Escolar
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mb: 3
                                }}
                            >
                                Bem-vindo, {usuario.nome}!
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={() =>
                                    setView('alunos')
                                }
                            >
                                Acessar Alunos
                            </Button>

                        </Box>

                    )}

                    {/* ======================================
                        ALUNOS
                    ====================================== */}

                    {view === 'alunos' && (

                        <Alunos />

                    )}

                    {/* ======================================
                        PROFESSORES
                    ====================================== */}

                    {view === 'professores' &&
                        usuario.perfil === 'admin' && (

                            <Professores />

                        )}

                    {/* ======================================
                        TURMAS
                    ====================================== */}

                    {view === 'turmas' &&
                        ['admin', 'professor'].includes(usuario.perfil) && (

                            <Turmas />

                        )}

                    {/* ======================================
                        DISCIPLINAS
                    ====================================== */}

                    {view === 'disciplinas' &&
                        usuario.perfil === 'admin' && (

                            <Disciplinas />

                        )}

                    {/* ======================================
                        NOTAS
                    ====================================== */}

                    {view === 'notas' && (

                        <Notas />

                    )}

                    {/* ======================================
                        FINANCEIRO
                    ====================================== */}

                    {view === 'financeiro' &&
                        usuario.perfil === 'admin' && (

                            <Box>

                                <Typography
                                    variant="h5"
                                    gutterBottom
                                >
                                    Financeiro
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                >
                                    Área financeira do
                                    sistema escolar.
                                </Typography>

                            </Box>

                        )}

                    {/* ======================================
                        RELATÓRIOS
                    ====================================== */}

                    {view === 'relatorios' &&
                        ['admin', 'professor'].includes(usuario.perfil) && (

                            <Box>

                                <Typography
                                    variant="h5"
                                    gutterBottom
                                >
                                    Relatórios
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                >
                                    Relatórios do
                                    sistema escolar.
                                </Typography>

                            </Box>

                        )}

                </Container>

            </Box>

        </Box>

    );
}

export default App;