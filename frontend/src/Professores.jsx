import { useEffect, useState } from 'react';

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';

// ======================================================
// API
// ======================================================

const API_URL =
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000';

// ======================================================
// AUTENTICAÇÃO
// ======================================================

function headersComToken() {

    const token =
        localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',

        ...(token
            ? {
                Authorization:
                    `Bearer ${token}`
            }
            : {})
    };
}

// ======================================================
// COMPONENTE
// ======================================================

function Professores() {

    // ==================================================
    // ESTADOS
    // ==================================================

    const [professores, setProfessores] =
        useState([]);

    const [nome, setNome] =
        useState('');

    const [email, setEmail] =
        useState('');

    const [disciplina, setDisciplina] =
        useState('');

    const [mensagem, setMensagem] =
        useState('');

    const [tipoMensagem, setTipoMensagem] =
        useState('error');

    const [editandoId, setEditandoId] =
        useState(null);

    const [filtro, setFiltro] =
        useState('');

    const [carregando, setCarregando] =
        useState(false);

    const [salvando, setSalvando] =
        useState(false);

    const [excluindoId, setExcluindoId] =
        useState(null);

    // ==================================================
    // MENSAGEM
    // ==================================================

    function mostrarMensagem(
        texto,
        tipo = 'error'
    ) {

        setMensagem(texto);
        setTipoMensagem(tipo);

    }

    // ==================================================
    // CARREGAR PROFESSORES
    // ==================================================

    async function carregarProfessores() {

        try {

            setCarregando(true);

            const resposta =
                await fetch(
                    `${API_URL}/professores`,
                    {
                        method: 'GET',
                        headers:
                            headersComToken()
                    }
                );

            if (resposta.status === 401) {

                throw new Error(
                    'Sua sessão expirou. Faça login novamente.'
                );
            }

            if (!resposta.ok) {

                const texto =
                    await resposta.text();

                throw new Error(
                    texto ||
                    'Erro ao buscar professores.'
                );
            }

            const dados =
                await resposta.json();

            setProfessores(
                Array.isArray(dados)
                    ? dados
                    : []
            );

        } catch (erro) {

            console.error(
                'Erro ao carregar professores:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Não foi possível carregar os professores.',
                'error'
            );

        } finally {

            setCarregando(false);

        }
    }

    // ==================================================
    // CARREGAR AO ABRIR A TELA
    // ==================================================

    useEffect(() => {

        carregarProfessores();

    }, []);

    // ==================================================
    // LIMPAR FORMULÁRIO
    // ==================================================

    function limparFormulario() {

        setNome('');
        setEmail('');
        setDisciplina('');
        setEditandoId(null);

    }

    // ==================================================
    // VALIDAR FORMULÁRIO
    // ==================================================

    function validarFormulario() {

        if (!nome.trim()) {

            mostrarMensagem(
                'Digite o nome do professor.',
                'error'
            );

            return false;
        }

        if (!email.trim()) {

            mostrarMensagem(
                'Digite o e-mail do professor.',
                'error'
            );

            return false;
        }

        if (!email.includes('@')) {

            mostrarMensagem(
                'Digite um e-mail válido.',
                'error'
            );

            return false;
        }

        if (!disciplina.trim()) {

            mostrarMensagem(
                'Digite a disciplina do professor.',
                'error'
            );

            return false;
        }

        return true;
    }

    // ==================================================
    // SALVAR PROFESSOR
    // ==================================================

    async function salvarProfessor(event) {

        event.preventDefault();

        setMensagem('');

        if (!validarFormulario()) {
            return;
        }

        const dadosProfessor = {

            nome:
                nome.trim(),

            email:
                email.trim(),

            disciplina:
                disciplina.trim()
        };

        try {

            setSalvando(true);

            const url =
                editandoId
                    ? `${API_URL}/professores/${editandoId}`
                    : `${API_URL}/professores`;

            const metodo =
                editandoId
                    ? 'PUT'
                    : 'POST';

            const resposta =
                await fetch(
                    url,
                    {
                        method: metodo,

                        headers:
                            headersComToken(),

                        body:
                            JSON.stringify(
                                dadosProfessor
                            )
                    }
                );

            let dados = {};

            try {

                dados =
                    await resposta.json();

            } catch {

                dados = {};

            }

            if (!resposta.ok) {

                if (
                    resposta.status === 401
                ) {

                    throw new Error(
                        'Você não está autenticado. Faça login novamente.'
                    );
                }

                if (
                    resposta.status === 403
                ) {

                    throw new Error(
                        'Você não tem permissão para cadastrar ou alterar professores.'
                    );
                }

                if (
                    resposta.status === 409
                ) {

                    throw new Error(
                        'Já existe um professor cadastrado com este e-mail.'
                    );
                }

                const mensagemServidor =
                    dados.mensagem ||
                    dados.erro ||
                    '';

                if (
                    mensagemServidor
                ) {

                    throw new Error(
                        mensagemServidor
                    );
                }

                throw new Error(
                    'Não foi possível salvar o professor.'
                );
            }

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
                'Erro ao salvar o professor.',
                'error'
            );

        } finally {

            setSalvando(false);

        }
    }

    // ==================================================
    // EDITAR
    // ==================================================

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

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ==================================================
    // EXCLUIR
    // ==================================================

    async function excluirProfessor(id) {

        const confirmar =
            window.confirm(
                'Deseja realmente excluir este professor?'
            );

        if (!confirmar) {
            return;
        }

        try {

            setExcluindoId(id);

            const resposta =
                await fetch(
                    `${API_URL}/professores/${id}`,
                    {
                        method: 'DELETE',

                        headers:
                            headersComToken()
                    }
                );

            let dados = {};

            try {

                dados =
                    await resposta.json();

            } catch {

                dados = {};

            }

            if (!resposta.ok) {

                if (
                    resposta.status === 401
                ) {

                    throw new Error(
                        'Sua sessão expirou. Faça login novamente.'
                    );
                }

                if (
                    resposta.status === 403
                ) {

                    throw new Error(
                        'Você não tem permissão para excluir professores.'
                    );
                }

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
                'Erro ao excluir o professor.',
                'error'
            );

        } finally {

            setExcluindoId(null);

        }
    }

    // ==================================================
    // FILTRO
    // ==================================================

    const professoresFiltrados =
        professores.filter(
            (professor) => {

                const texto =
                    filtro
                        .toLowerCase()
                        .trim();

                if (!texto) {
                    return true;
                }

                return [

                    professor.id,

                    professor.nome,

                    professor.email,

                    professor.disciplina

                ].some(
                    (valor) =>
                        String(
                            valor ?? ''
                        )
                            .toLowerCase()
                            .includes(texto)
                );
            }
        );

    // ==================================================
    // INTERFACE
    // ==================================================

    return (

        <Box>

            {/* ==========================================
                TÍTULO
            ========================================== */}

            <Typography
                variant="h4"
                fontWeight="bold"
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

            {/* ==========================================
                MENSAGEM
            ========================================== */}

            {mensagem && (

                <Alert
                    severity={tipoMensagem}
                    sx={{
                        mb: 3
                    }}

                    onClose={() =>
                        setMensagem('')
                    }
                >
                    {mensagem}
                </Alert>

            )}

            {/* ==========================================
                FORMULÁRIO
            ========================================== */}

            <Card
                sx={{
                    mb: 4
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 3
                        }}
                    >
                        {editandoId
                            ? 'Editar Professor'
                            : 'Cadastrar Professor'}
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={
                            salvarProfessor
                        }
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
                                    required

                                    label="Nome do professor"

                                    value={nome}

                                    onChange={
                                        (event) =>
                                            setNome(
                                                event
                                                    .target
                                                    .value
                                            )
                                    }

                                    disabled={
                                        salvando
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
                                    required

                                    label="E-mail"

                                    type="email"

                                    value={email}

                                    onChange={
                                        (event) =>
                                            setEmail(
                                                event
                                                    .target
                                                    .value
                                            )
                                    }

                                    disabled={
                                        salvando
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
                                    required

                                    label="Disciplina"

                                    value={disciplina}

                                    onChange={
                                        (event) =>
                                            setDisciplina(
                                                event
                                                    .target
                                                    .value
                                            )
                                    }

                                    disabled={
                                        salvando
                                    }
                                />

                            </Grid>

                            {/* BOTÕES */}

                            <Grid
                                item
                                xs={12}
                            >

                                <Stack
                                    direction={{
                                        xs: 'column',
                                        sm: 'row'
                                    }}
                                    spacing={2}
                                >

                                    <Button
                                        type="submit"
                                        variant="contained"

                                        disabled={
                                            salvando
                                        }
                                    >
                                        {salvando
                                            ? 'Salvando...'
                                            : editandoId
                                                ? 'Atualizar Professor'
                                                : 'Salvar Professor'}
                                    </Button>

                                    {editandoId && (

                                        <Button
                                            variant="outlined"

                                            disabled={
                                                salvando
                                            }

                                            onClick={
                                                limparFormulario
                                            }
                                        >
                                            Cancelar
                                        </Button>

                                    )}

                                </Stack>

                            </Grid>

                        </Grid>

                    </Box>

                </CardContent>

            </Card>

            {/* ==========================================
                FILTRO
            ========================================== */}

            <Card
                sx={{
                    mb: 4
                }}
            >

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 2
                        }}
                    >
                        Pesquisar professores
                    </Typography>

                    <TextField
                        fullWidth

                        label="Pesquisar"

                        placeholder={
                            'Nome, e-mail ou disciplina'
                        }

                        value={
                            filtro
                        }

                        onChange={
                            (event) =>
                                setFiltro(
                                    event.target.value
                                )
                        }
                    />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 2
                        }}
                    >
                        {professoresFiltrados.length}
                        {' '}
                        professor(es) encontrado(s)
                    </Typography>

                </CardContent>

            </Card>

            {/* ==========================================
                LISTA
            ========================================== */}

            <Typography
                variant="h5"
                fontWeight="bold"
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
                                <strong>
                                    ID
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Nome
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    E-mail
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Disciplina
                                </strong>
                            </TableCell>

                            <TableCell align="center">
                                <strong>
                                    Ações
                                </strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {carregando ? (

                            <TableRow>

                                <TableCell
                                    colSpan={5}
                                    align="center"
                                >

                                    <Typography
                                        sx={{
                                            py: 4
                                        }}
                                    >
                                        Carregando professores...
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : professoresFiltrados.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={5}
                                    align="center"
                                >

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            py: 4
                                        }}
                                    >
                                        {filtro
                                            ? 'Nenhum professor encontrado para esta pesquisa.'
                                            : 'Nenhum professor cadastrado.'}
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : (

                            professoresFiltrados.map(
                                (professor) => (

                                    <TableRow
                                        key={
                                            professor.id
                                        }
                                        hover
                                    >

                                        <TableCell>
                                            {
                                                professor.id
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                professor.nome
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                professor.email
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {
                                                professor.disciplina
                                            }
                                        </TableCell>

                                        <TableCell>

                                            <Stack
                                                direction={{
                                                    xs: 'column',
                                                    sm: 'row'
                                                }}
                                                spacing={1}
                                                justifyContent="center"
                                            >

                                                <Button
                                                    size="small"
                                                    variant="outlined"

                                                    onClick={() =>
                                                        editarProfessor(
                                                            professor
                                                        )
                                                    }

                                                    disabled={
                                                        salvando ||
                                                        excluindoId !== null
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

                                                    disabled={
                                                        salvando ||
                                                        excluindoId !== null
                                                    }
                                                >
                                                    {excluindoId ===
                                                        professor.id
                                                        ? 'Excluindo...'
                                                        : 'Excluir'}
                                                </Button>

                                            </Stack>

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