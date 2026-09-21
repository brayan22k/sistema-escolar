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
// HEADERS COM TOKEN
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

function Disciplinas() {

    // ==================================================
    // ESTADOS
    // ==================================================

    const [disciplinas, setDisciplinas] =
        useState([]);

    const [nome, setNome] =
        useState('');

    const [descricao, setDescricao] =
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
    // CARREGAR DISCIPLINAS
    // ==================================================

    async function carregarDisciplinas() {

        try {

            setCarregando(true);

            const resposta =
                await fetch(
                    `${API_URL}/disciplinas`,
                    {
                        method: 'GET',
                        headers:
                            headersComToken()
                    }
                );

            if (
                resposta.status === 401
            ) {

                throw new Error(
                    'Sua sessão expirou. Faça login novamente.'
                );
            }

            if (!resposta.ok) {

                const erro =
                    await resposta.text();

                throw new Error(
                    erro ||
                    'Erro ao buscar disciplinas.'
                );
            }

            const dados =
                await resposta.json();

            setDisciplinas(
                Array.isArray(dados)
                    ? dados
                    : []
            );

        } catch (erro) {

            console.error(
                'Erro ao carregar disciplinas:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Não foi possível carregar as disciplinas.',
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

        carregarDisciplinas();

    }, []);

    // ==================================================
    // LIMPAR FORMULÁRIO
    // ==================================================

    function limparFormulario() {

        setNome('');
        setDescricao('');
        setEditandoId(null);

    }

    // ==================================================
    // VALIDAR FORMULÁRIO
    // ==================================================

    function validarFormulario() {

        if (!nome.trim()) {

            mostrarMensagem(
                'Digite o nome da disciplina.',
                'error'
            );

            return false;
        }

        return true;
    }

    // ==================================================
    // SALVAR DISCIPLINA
    // ==================================================

    async function salvarDisciplina(event) {

        event.preventDefault();

        setMensagem('');

        if (!validarFormulario()) {
            return;
        }

        const dados = {

            nome:
                nome.trim(),

            descricao:
                descricao.trim()
        };

        try {

            setSalvando(true);

            const url =
                editandoId !== null
                    ? `${API_URL}/disciplinas/${editandoId}`
                    : `${API_URL}/disciplinas`;

            const metodo =
                editandoId !== null
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
                                dados
                            )
                    }
                );

            let dadosResposta = {};

            try {

                dadosResposta =
                    await resposta.json();

            } catch {

                dadosResposta = {};

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
                        'Você não tem permissão para cadastrar ou alterar disciplinas.'
                    );
                }

                if (
                    resposta.status === 409
                ) {

                    throw new Error(
                        'Já existe uma disciplina cadastrada com esse nome.'
                    );
                }

                throw new Error(
                    dadosResposta.mensagem ||
                    dadosResposta.erro ||
                    'Erro ao salvar disciplina.'
                );
            }

            mostrarMensagem(

                editandoId !== null
                    ? 'Disciplina atualizada com sucesso!'
                    : 'Disciplina cadastrada com sucesso!',

                'success'
            );

            limparFormulario();

            await carregarDisciplinas();

        } catch (erro) {

            console.error(
                'Erro ao salvar disciplina:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Erro ao salvar a disciplina.',
                'error'
            );

        } finally {

            setSalvando(false);

        }
    }

    // ==================================================
    // EDITAR
    // ==================================================

    function editarDisciplina(
        disciplina
    ) {

        setNome(
            disciplina.nome || ''
        );

        setDescricao(
            disciplina.descricao || ''
        );

        setEditandoId(
            disciplina.id
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

    async function excluirDisciplina(
        id
    ) {

        const confirmar =
            window.confirm(
                'Deseja realmente excluir esta disciplina?'
            );

        if (!confirmar) {
            return;
        }

        try {

            setExcluindoId(id);

            const resposta =
                await fetch(
                    `${API_URL}/disciplinas/${id}`,
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
                        'Você não tem permissão para excluir disciplinas.'
                    );
                }

                throw new Error(
                    dados.mensagem ||
                    dados.erro ||
                    'Erro ao excluir disciplina.'
                );
            }

            mostrarMensagem(
                'Disciplina excluída com sucesso!',
                'success'
            );

            await carregarDisciplinas();

        } catch (erro) {

            console.error(
                'Erro ao excluir disciplina:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Erro ao excluir a disciplina.',
                'error'
            );

        } finally {

            setExcluindoId(null);

        }
    }

    // ==================================================
    // FILTRO
    // ==================================================

    const disciplinasFiltradas =
        disciplinas.filter(
            (disciplina) => {

                const texto =
                    filtro
                        .toLowerCase()
                        .trim();

                if (!texto) {
                    return true;
                }

                return [

                    disciplina.id,

                    disciplina.nome,

                    disciplina.descricao

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
                Cadastro de Disciplinas
            </Typography>

            <Typography
                color="text.secondary"
                sx={{
                    mb: 3
                }}
            >
                Cadastre, edite e consulte as disciplinas
                do sistema escolar.
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
                        {editandoId !== null
                            ? 'Editar Disciplina'
                            : 'Cadastrar Disciplina'}
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={
                            salvarDisciplina
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
                                md={5}
                            >

                                <TextField
                                    fullWidth
                                    required

                                    label="Nome da disciplina"

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

                            {/* DESCRIÇÃO */}

                            <Grid
                                item
                                xs={12}
                                md={5}
                            >

                                <TextField
                                    fullWidth

                                    label="Descrição"

                                    value={descricao}

                                    onChange={
                                        (event) =>
                                            setDescricao(
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
                                md={2}
                            >

                                <Stack
                                    direction={{
                                        xs: 'column',
                                        sm: 'row'
                                    }}
                                    spacing={1}
                                    sx={{
                                        height: '100%'
                                    }}
                                >

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth

                                        disabled={
                                            salvando
                                        }

                                        sx={{
                                            minHeight:
                                                '56px'
                                        }}
                                    >
                                        {salvando
                                            ? 'Salvando...'
                                            : editandoId !== null
                                                ? 'Atualizar'
                                                : 'Salvar'}
                                    </Button>

                                </Stack>

                            </Grid>

                            {/* CANCELAR */}

                            {editandoId !== null && (

                                <Grid
                                    item
                                    xs={12}
                                >

                                    <Button
                                        type="button"
                                        variant="outlined"

                                        disabled={
                                            salvando
                                        }

                                        onClick={
                                            limparFormulario
                                        }
                                    >
                                        Cancelar edição
                                    </Button>

                                </Grid>

                            )}

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
                        Pesquisar disciplinas
                    </Typography>

                    <TextField
                        fullWidth

                        label="Pesquisar"

                        placeholder={
                            'Nome ou descrição da disciplina'
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
                        {disciplinasFiltradas.length}
                        {' '}
                        disciplina(s) encontrada(s)
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
                Disciplinas Cadastradas
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
                                    Descrição
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
                                    colSpan={4}
                                    align="center"
                                >

                                    <Typography
                                        sx={{
                                            py: 4
                                        }}
                                    >
                                        Carregando disciplinas...
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : disciplinasFiltradas.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={4}
                                    align="center"
                                >

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            py: 4
                                        }}
                                    >
                                        {filtro
                                            ? 'Nenhuma disciplina encontrada para esta pesquisa.'
                                            : 'Nenhuma disciplina cadastrada.'}
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : (

                            disciplinasFiltradas.map(
                                (disciplina) => (

                                    <TableRow
                                        key={
                                            disciplina.id
                                        }
                                        hover
                                    >

                                        <TableCell>
                                            {
                                                disciplina.id
                                            }
                                        </TableCell>

                                        <TableCell>
                                            <strong>
                                                {
                                                    disciplina.nome
                                                }
                                            </strong>
                                        </TableCell>

                                        <TableCell>
                                            {
                                                disciplina.descricao ||
                                                'Sem descrição'
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
                                                        editarDisciplina(
                                                            disciplina
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
                                                        excluirDisciplina(
                                                            disciplina.id
                                                        )
                                                    }

                                                    disabled={
                                                        salvando ||
                                                        excluindoId !== null
                                                    }
                                                >
                                                    {excluindoId ===
                                                        disciplina.id
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

export default Disciplinas;