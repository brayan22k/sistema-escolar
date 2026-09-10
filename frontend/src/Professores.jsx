import { useEffect, useState } from 'react';

import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

const API_URL = 'http://localhost:3000';

// ======================================================
// AUTENTICAÇÃO
// ======================================================

function headersComToken() {
    const token = localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        ...(token
            ? {
                Authorization: `Bearer ${token}`
            }
            : {})
    };
}

// ======================================================
// COMPONENTE
// ======================================================

function Professores() {

    const [professores, setProfessores] = useState([]);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [disciplina, setDisciplina] = useState('');

    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('error');

    const [editandoId, setEditandoId] = useState(null);

    // ======================================================
    // MENSAGEM
    // ======================================================

    function mostrarMensagem(texto, tipo = 'error') {
        setMensagem(texto);
        setTipoMensagem(tipo);
    }

    // ======================================================
    // CARREGAR PROFESSORES
    // ======================================================

    async function carregarProfessores() {

        try {

            const resposta = await fetch(
                `${API_URL}/professores`,
                {
                    headers: headersComToken()
                }
            );

            if (resposta.status === 401) {
                throw new Error(
                    'Sua sessão expirou. Faça login novamente.'
                );
            }

            if (!resposta.ok) {
                throw new Error(
                    'Erro ao buscar professores.'
                );
            }

            const dados = await resposta.json();

            setProfessores(dados);

        } catch (erro) {

            console.error(
                'Erro ao carregar professores:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Não foi possível carregar os professores.'
            );
        }
    }

    useEffect(() => {
        carregarProfessores();
    }, []);

    // ======================================================
    // LIMPAR FORMULÁRIO
    // ======================================================

    function limparFormulario() {

        setNome('');
        setEmail('');
        setDisciplina('');
        setEditandoId(null);

    }

    // ======================================================
    // SALVAR PROFESSOR
    // ======================================================

    async function salvarProfessor(event) {

        event.preventDefault();

        setMensagem('');

        // ==================================================
        // VALIDAÇÕES
        // ==================================================

        if (!nome.trim()) {

            mostrarMensagem(
                'Digite o nome do professor.'
            );

            return;
        }

        if (!email.trim()) {

            mostrarMensagem(
                'Digite o e-mail do professor.'
            );

            return;
        }

        if (!disciplina.trim()) {

            mostrarMensagem(
                'Digite a disciplina do professor.'
            );

            return;
        }

        // ==================================================
        // DADOS
        // ==================================================

        const dadosProfessor = {
            nome: nome.trim(),
            email: email.trim(),
            disciplina: disciplina.trim()
        };

        try {

            const url = editandoId
                ? `${API_URL}/professores/${editandoId}`
                : `${API_URL}/professores`;

            const metodo = editandoId
                ? 'PUT'
                : 'POST';

            // ==================================================
            // REQUISIÇÃO
            // ==================================================

            const resposta = await fetch(
                url,
                {
                    method: metodo,
                    headers: headersComToken(),
                    body: JSON.stringify(
                        dadosProfessor
                    )
                }
            );

            // ==================================================
            // LER RESPOSTA
            // ==================================================

            let dados = {};

            try {

                dados = await resposta.json();

            } catch {

                dados = {};

            }

            // ==================================================
            // ERROS
            // ==================================================

            if (!resposta.ok) {

                // E-mail duplicado
                if (
                    resposta.status === 409 ||
                    resposta.status === 400
                ) {

                    const mensagemServidor =
                        dados.mensagem ||
                        dados.erro ||
                        '';

                    if (
                        mensagemServidor
                            .toLowerCase()
                            .includes('email') &&
                        mensagemServidor
                            .toLowerCase()
                            .includes('unique')
                    ) {

                        throw new Error(
                            'Já existe um professor cadastrado com este e-mail.'
                        );
                    }

                    if (
                        mensagemServidor
                            .toLowerCase()
                            .includes('duplicate')
                    ) {

                        throw new Error(
                            'Já existe um professor cadastrado com este e-mail.'
                        );
                    }

                    if (mensagemServidor) {

                        throw new Error(
                            mensagemServidor
                        );
                    }

                    throw new Error(
                        'Não foi possível salvar o professor.'
                    );
                }

                // Não autenticado
                if (resposta.status === 401) {

                    throw new Error(
                        'Você não está autenticado. Faça login novamente.'
                    );
                }

                // Sem permissão
                if (resposta.status === 403) {

                    throw new Error(
                        'Você não tem permissão para cadastrar ou alterar professores.'
                    );
                }

                throw new Error(
                    dados.mensagem ||
                    dados.erro ||
                    'Erro ao salvar professor.'
                );
            }

            // ==================================================
            // SUCESSO
            // ==================================================

            mostrarMensagem(
                editandoId
                    ? 'Professor atualizado com sucesso!'
                    : 'Professor cadastrado com sucesso!',
                'success'
            );

            limparFormulario();

            await carregarProfessores();

        } catch (erro) {

            console.error(
                'Erro ao salvar professor:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Erro ao salvar o professor.'
            );
        }
    }

    // ======================================================
    // EDITAR
    // ======================================================

    function editarProfessor(professor) {

        setNome(
            professor.nome || ''
        );

        setEmail(
            professor.email || ''
        );

        setDisciplina(
            professor.disciplina || ''
        );

        setEditandoId(
            professor.id
        );

        setMensagem('');
    }

    // ======================================================
    // EXCLUIR
    // ======================================================

    async function excluirProfessor(id) {

        const confirmar =
            window.confirm(
                'Deseja realmente excluir este professor?'
            );

        if (!confirmar) {
            return;
        }

        try {

            const resposta = await fetch(
                `${API_URL}/professores/${id}`,
                {
                    method: 'DELETE',
                    headers: headersComToken()
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
                    dados.mensagem ||
                    dados.erro ||
                    'Erro ao excluir professor.'
                );
            }

            mostrarMensagem(
                'Professor excluído com sucesso!',
                'success'
            );

            await carregarProfessores();

        } catch (erro) {

            console.error(
                'Erro ao excluir professor:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Erro ao excluir o professor.'
            );
        }
    }

    // ======================================================
    // INTERFACE
    // ======================================================

    return (

        <Box>

            <Typography
                variant="h4"
                gutterBottom
            >
                Cadastro de Professores
            </Typography>

            <Typography
                color="text.secondary"
                sx={{
                    mb: 3
                }}
            >
                Cadastre, edite e consulte os professores
                da escola.
            </Typography>

            {/* ==================================================
                MENSAGEM
            ================================================== */}

            {mensagem && (

                <Alert
                    severity={tipoMensagem}
                    sx={{
                        mb: 3
                    }}
                >
                    {mensagem}
                </Alert>

            )}

            {/* ==================================================
                FORMULÁRIO
            ================================================== */}

            <Card
                sx={{
                    mb: 4
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        sx={{
                            mb: 2
                        }}
                    >
                        {editandoId
                            ? 'Editar Professor'
                            : 'Cadastrar Professor'}
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={salvarProfessor}
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* NOME */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Nome do professor"
                                    value={nome}
                                    onChange={(event) =>
                                        setNome(
                                            event.target.value
                                        )
                                    }
                                />

                            </Grid>

                            {/* EMAIL */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="E-mail"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                />

                            </Grid>

                            {/* DISCIPLINA */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Disciplina"
                                    value={disciplina}
                                    onChange={(event) =>
                                        setDisciplina(
                                            event.target.value
                                        )
                                    }
                                />

                            </Grid>

                            {/* BOTÕES */}

                            <Grid
                                item
                                xs={12}
                            >

                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        mr: 2
                                    }}
                                >
                                    {editandoId
                                        ? 'Atualizar Professor'
                                        : 'Salvar Professor'}
                                </Button>

                                {editandoId && (

                                    <Button
                                        variant="outlined"
                                        onClick={
                                            limparFormulario
                                        }
                                    >
                                        Cancelar
                                    </Button>

                                )}

                            </Grid>

                        </Grid>

                    </Box>

                </CardContent>

            </Card>

            {/* ==================================================
                LISTA
            ================================================== */}

            <Typography
                variant="h5"
                gutterBottom
            >
                Professores Cadastrados
            </Typography>

            <TableContainer
                component={Paper}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                <strong>ID</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Nome</strong>
                            </TableCell>

                            <TableCell>
                                <strong>E-mail</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Disciplina</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Ações</strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {professores.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={5}
                                    align="center"
                                >
                                    Nenhum professor cadastrado.
                                </TableCell>

                            </TableRow>

                        ) : (

                            professores.map(
                                (professor) => (

                                    <TableRow
                                        key={professor.id}
                                    >

                                        <TableCell>
                                            {professor.id}
                                        </TableCell>

                                        <TableCell>
                                            {professor.nome}
                                        </TableCell>

                                        <TableCell>
                                            {professor.email}
                                        </TableCell>

                                        <TableCell>
                                            {professor.disciplina}
                                        </TableCell>

                                        <TableCell>

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    mr: 1
                                                }}
                                                onClick={() =>
                                                    editarProfessor(
                                                        professor
                                                    )
                                                }
                                            >
                                                Editar
                                            </Button>

                                            <Button
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                                onClick={() =>
                                                    excluirProfessor(
                                                        professor.id
                                                    )
                                                }
                                            >
                                                Excluir
                                            </Button>

                                        </TableCell>

                                    </TableRow>

                                )
                            )

                        )}

                    </TableBody>

                </Table>

            </TableContainer>

        </Box>

    );
}

export default Professores;