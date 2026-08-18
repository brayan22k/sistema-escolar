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

import Turmas from './Turmas.jsx';
import Notas from './Notas.jsx';
import Alunos from './Alunos.jsx';
import Professores from './Professores.jsx';

const drawerWidth = 240;

function App() {

    const [view, setView] = useState('inicio');

    const menuItems = [

        {
            key: 'inicio',
            label: 'Início',
            description: 'Visão geral do sistema'
        },

        {
            key: 'alunos',
            label: 'Alunos',
            description: 'Cadastro de alunos'
        },

        {
            key: 'professores',
            label: 'Professores',
            description: 'Cadastro de professores'
        },

        {
            key: 'turmas',
            label: 'Turmas',
            description: 'Organização escolar'
        },

        {
            key: 'notas',
            label: 'Notas',
            description: 'Lançamento e boletim dos alunos'
        },

        {
            key: 'financeiro',
            label: 'Financeiro',
            description: 'Mensalidades e contas'
        },

        {
            key: 'relatorios',
            label: 'Relatórios',
            description: 'Relatórios do sistema'
        }

    ];

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

                        {menuItems.map((item) => (

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
                                Bem-vindo ao sistema
                                de gerenciamento escolar.
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

                    {view === 'professores' && (

                        <Professores />

                    )}


                    {/* ======================================
                        TURMAS
                    ====================================== */}

                    {view === 'turmas' && (

                        <Turmas />

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

                    {view === 'financeiro' && (

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

                    {view === 'relatorios' && (

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