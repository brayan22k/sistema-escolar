import { useEffect, useState } from 'react';

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
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
// BIMESTRES
// ======================================================

const BIMESTRES = [
    '1º Bimestre',
    '2º Bimestre',
    '3º Bimestre',
    '4º Bimestre'
];

// ======================================================
// FORMULÁRIO INICIAL
// ======================================================

const formularioInicial = {
    aluno_id: '',
    disciplina: '',
    bimestre: '',
    nota: ''
};

// ======================================================
// CALCULAR MÉDIA
// ======================================================

function calcularMedia(valores) {

    if (
        !valores ||
        valores.length === 0
    ) {
        return null;
    }

    const soma =
        valores.reduce(
            (acumulado, valor) =>
                acumulado + Number(valor),
            0
        );

    return soma / valores.length;
}

// ======================================================
// SITUAÇÃO
// ======================================================

function situacaoDaMedia(media) {

    if (media === null) {

        return {
            texto: 'Sem notas',
            cor: 'default'
        };
    }

    if (media >= 6) {

        return {
            texto: 'Aprovado',
            cor: 'success'
        };
    }

    if (media >= 4) {

        return {
            texto: 'Recuperação',
            cor: 'warning'
        };
    }

    return {
        texto: 'Reprovado',
        cor: 'error'
    };
}

// ======================================================
// AGRUPAR BOLETIM POR BIMESTRE
// ======================================================

function agruparNotasPorBimestre(notas) {

    const grupos = {};

    BIMESTRES.forEach(
        (bimestre) => {
            grupos[bimestre] = [];
        }
    );

    notas.forEach(
        (nota) => {

            const bimestre =
                BIMESTRES.includes(
                    nota.bimestre
                )
                    ? nota.bimestre
                    : 'Outros';

            if (!grupos[bimestre]) {
                grupos[bimestre] = [];
            }

            grupos[bimestre].push(nota);
        }
    );

    return grupos;
}

// ======================================================
// COMPONENTE
// ======================================================

function Notas() {

    // ==================================================
    // ESTADOS
    // ==================================================

    const [form, setForm] =
        useState(formularioInicial);

    const [notas, setNotas] =
        useState([]);

    const [alunos, setAlunos] =
        useState([]);

    const [disciplinas, setDisciplinas] =
        useState([]);

    const [mensagem, setMensagem] =
        useState('');

    const [tipoMensagem, setTipoMensagem] =
        useState('success');

    const [carregando, setCarregando] =
        useState(false);

    const [salvando, setSalvando] =
        useState(false);

    const [excluindoId, setExcluindoId] =
        useState(null);

    // ==================================================
    // EDIÇÃO
    // ==================================================

    const [notaEditando, setNotaEditando] =
        useState(null);

    // ==================================================
    // CONSULTA DO ALUNO
    // ==================================================

    const [alunoConsultaId, setAlunoConsultaId] =
        useState('');

    const [alunoConsultaNome, setAlunoConsultaNome] =
        useState('');

    const [notasConsulta, setNotasConsulta] =
        useState([]);

    const [carregandoBoletim, setCarregandoBoletim] =
        useState(false);

    // ==================================================
    // MENSAGEM
    // ==================================================

    function mostrarMensagem(
        texto,
        tipo = 'success'
    ) {

        setMensagem(texto);
        setTipoMensagem(tipo);
    }

    // ==================================================
    // CARREGAR DISCIPLINAS
    // ==================================================

    async function carregarDisciplinas() {

        try {

            const resposta =
                await fetch(
                    `${API_URL}/disciplinas`,
                    {
                        method: 'GET',
                        headers:
                            headersComToken()
                    }
                );

            if (!resposta.ok) {

                const erro =
                    await resposta.text();

                throw new Error(
                    erro ||
                    'Erro ao carregar disciplinas.'
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

            setDisciplinas([]);

            mostrarMensagem(
                erro.message ||
                'Não foi possível carregar as disciplinas.',
                'error'
            );
        }
    }

    // ==================================================
    // CARREGAR ALUNOS
    // ==================================================

    async function carregarAlunos() {

        try {

            const resposta =
                await fetch(
                    `${API_URL}/alunos`,
                    {
                        method: 'GET',
                        headers:
                            headersComToken()
                    }
                );

            if (!resposta.ok) {

                const erro =
                    await resposta.text();

                throw new Error(
                    erro ||
                    'Erro ao carregar alunos.'
                );
            }

            const dados =
                await resposta.json();

            setAlunos(
                Array.isArray(dados)
                    ? dados
                    : []
            );

        } catch (erro) {

            console.error(
                'Erro ao carregar alunos:',
                erro
            );

            setAlunos([]);

            mostrarMensagem(
                erro.message ||
                'Não foi possível carregar os alunos.',
                'error'
            );
        }
    }

    // ==================================================
    // CARREGAR NOTAS
    // ==================================================

    async function carregarNotas() {

        try {

            setCarregando(true);

            const resposta =
                await fetch(
                    `${API_URL}/notas`,
                    {
                        method: 'GET',
                        headers:
                            headersComToken()
                    }
                );

            if (!resposta.ok) {

                const erro =
                    await resposta.text();

                throw new Error(
                    erro ||
                    'Erro ao carregar notas.'
                );
            }

            const dados =
                await resposta.json();

            setNotas(
                Array.isArray(dados)
                    ? dados
                    : []
            );

        } catch (erro) {

            console.error(
                'Erro ao carregar notas:',
                erro
            );

            setNotas([]);

            mostrarMensagem(
                erro.message ||
                'Não foi possível carregar as notas.',
                'error'
            );

        } finally {

            setCarregando(false);
        }
    }

    // ==================================================
    // CARREGAR TUDO
    // ==================================================

    useEffect(() => {

        carregarDisciplinas();
        carregarAlunos();
        carregarNotas();

    }, []);

    // ==================================================
    // ALTERAR FORMULÁRIO
    // ==================================================

    function handleChange(event) {

        const {
            name,
            value
        } = event.target;

        setForm(
            (formularioAnterior) => ({
                ...formularioAnterior,
                [name]: value
            })
        );
    }

    // ==================================================
    // VALIDAR NOTA
    // ==================================================

    function validarNota(valor) {

        if (valor === '') {

            mostrarMensagem(
                'Informe a nota.',
                'error'
            );

            return null;
        }

        const notaNumerica =
            Number(valor);

        if (
            !Number.isFinite(
                notaNumerica
            ) ||
            notaNumerica < 0 ||
            notaNumerica > 10
        ) {

            mostrarMensagem(
                'A nota deve ser um número entre 0 e 10.',
                'error'
            );

            return null;
        }

        return notaNumerica;
    }

    // ==================================================
    // SALVAR NOTA
    // ==================================================

    async function salvarNota(event) {

        if (event) {
            event.preventDefault();
        }

        setMensagem('');

        if (!form.aluno_id) {

            mostrarMensagem(
                'Selecione o aluno.',
                'error'
            );

            return;
        }

        if (!form.disciplina) {

            mostrarMensagem(
                'Selecione a disciplina.',
                'error'
            );

            return;
        }

        if (!form.bimestre) {

            mostrarMensagem(
                'Selecione o bimestre.',
                'error'
            );

            return;
        }

        const notaNumerica =
            validarNota(form.nota);

        if (notaNumerica === null) {
            return;
        }

        try {

            setSalvando(true);

            const estaEditando =
                notaEditando !== null;

            const url =
                estaEditando
                    ? `${API_URL}/notas/${notaEditando.id}`
                    : `${API_URL}/notas`;

            const metodo =
                estaEditando
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
                            JSON.stringify({

                                aluno_id:
                                    Number(
                                        form.aluno_id
                                    ),

                                disciplina:
                                    form.disciplina,

                                bimestre:
                                    form.bimestre,

                                nota:
                                    notaNumerica
                            })
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
                    resposta.status === 409
                ) {

                    throw new Error(
                        'Já existe uma nota para este aluno, disciplina e bimestre.'
                    );
                }

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
                        'Você não tem permissão para alterar notas.'
                    );
                }

                throw new Error(
                    dadosResposta.mensagem ||
                    dadosResposta.erro ||
                    'Erro ao salvar nota.'
                );
            }

            mostrarMensagem(
                estaEditando
                    ? 'Nota atualizada com sucesso!'
                    : 'Nota cadastrada com sucesso!',
                'success'
            );

            const alunoAtual =
                form.aluno_id;

            setForm({
                ...formularioInicial,
                aluno_id:
                    alunoAtual
            });

            setNotaEditando(null);

            await carregarNotas();

            if (
                alunoConsultaId &&
                Number(alunoConsultaId) ===
                    Number(alunoAtual)
            ) {

                await consultarAluno(
                    alunoConsultaId
                );
            }

        } catch (erro) {

            console.error(
                'Erro ao salvar nota:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Erro ao salvar nota.',
                'error'
            );

        } finally {

            setSalvando(false);
        }
    }

    // ==================================================
    // ABRIR EDIÇÃO
    // ==================================================

    function editarNota(nota) {

        setNotaEditando(nota);

        setForm({

            aluno_id:
                String(
                    nota.aluno_id
                ),

            disciplina:
                nota.disciplina || '',

            bimestre:
                nota.bimestre || '',

            nota:
                String(
                    nota.nota
                )
        });

        setMensagem('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ==================================================
    // CANCELAR EDIÇÃO
    // ==================================================

    function cancelarEdicao() {

        setNotaEditando(null);

        setForm(
            formularioInicial
        );

        setMensagem('');
    }

    // ==================================================
    // EXCLUIR NOTA
    // ==================================================

    async function excluirNota(id) {

        const confirmar =
            window.confirm(
                'Deseja realmente excluir esta nota?'
            );

        if (!confirmar) {
            return;
        }

        try {

            setExcluindoId(id);

            const resposta =
                await fetch(
                    `${API_URL}/notas/${id}`,
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
                        'Você não tem permissão para excluir notas.'
                    );
                }

                throw new Error(
                    dados.mensagem ||
                    dados.erro ||
                    'Erro ao excluir nota.'
                );
            }

            mostrarMensagem(
                'Nota excluída com sucesso!',
                'success'
            );

            if (
                notaEditando &&
                Number(notaEditando.id) ===
                    Number(id)
            ) {

                cancelarEdicao();
            }

            await carregarNotas();

            if (alunoConsultaId) {

                await consultarAluno(
                    alunoConsultaId
                );
            }

        } catch (erro) {

            console.error(
                'Erro ao excluir nota:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Erro ao excluir nota.',
                'error'
            );

        } finally {

            setExcluindoId(null);
        }
    }

    // ==================================================
    // CONSULTAR BOLETIM
    // ==================================================

    async function consultarAluno(
        alunoId
    ) {

        if (!alunoId) {

            setNotasConsulta([]);
            setAlunoConsultaNome('');

            return;
        }

        try {

            setCarregandoBoletim(true);

            const resposta =
                await fetch(
                    `${API_URL}/notas/aluno/${alunoId}`,
                    {
                        method: 'GET',
                        headers:
                            headersComToken()
                    }
                );

            if (!resposta.ok) {

                const erro =
                    await resposta.text();

                throw new Error(
                    erro ||
                    'Erro ao consultar notas do aluno.'
                );
            }

            const dados =
                await resposta.json();

            setNotasConsulta(
                Array.isArray(dados.notas)
                    ? dados.notas
                    : []
            );

            setAlunoConsultaNome(
                dados.aluno?.nome || ''
            );

        } catch (erro) {

            console.error(
                'Erro ao consultar boletim:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Erro ao consultar notas do aluno.',
                'error'
            );

            setNotasConsulta([]);

        } finally {

            setCarregandoBoletim(false);
        }
    }

    // ==================================================
    // ALTERAR ALUNO DO BOLETIM
    // ==================================================

    function alterarAlunoConsulta(
        event
    ) {

        const novoId =
            event.target.value;

        setAlunoConsultaId(
            novoId
        );

        consultarAluno(
            novoId
        );
    }

    // ==================================================
    // NOME DO ALUNO
    // ==================================================

    function nomeDoAluno(
        alunoId
    ) {

        const aluno =
            alunos.find(
                (item) =>
                    Number(item.id) ===
                    Number(alunoId)
            );

        return aluno
            ? aluno.nome
            : '—';
    }

    // ==================================================
    // ESTATÍSTICAS
    // ==================================================

    const valoresDeTodasAsNotas =
        notas.map(
            (item) =>
                Number(item.nota)
        );

    const maiorNota =
        valoresDeTodasAsNotas.length
            ? Math.max(
                ...valoresDeTodasAsNotas
            )
            : null;

    const menorNota =
        valoresDeTodasAsNotas.length
            ? Math.min(
                ...valoresDeTodasAsNotas
            )
            : null;

    const mediaDaTurma =
        calcularMedia(
            valoresDeTodasAsNotas
        );

    // ==================================================
    // BOLETIM
    // ==================================================

    const boletimPorBimestre =
        agruparNotasPorBimestre(
            notasConsulta
        );

    const mediaGeralAluno =
        calcularMedia(
            notasConsulta.map(
                (item) =>
                    item.nota
            )
        );

    const situacaoAluno =
        situacaoDaMedia(
            mediaGeralAluno
        );

    // ==================================================
    // RENDER
    // ==================================================

    return (

        <Box>

            {/* ==========================================
                TÍTULO
            ========================================== */}

            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                    mb: 1
                }}
            >
                Lançamento de Notas
            </Typography>

            <Typography
                color="text.secondary"
                sx={{
                    mb: 3
                }}
            >
                Cadastre, edite, consulte e acompanhe
                o desempenho dos alunos.
            </Typography>

            {/* ==========================================
                MENSAGEM
            ========================================== */}

            {mensagem && (

                <Alert
                    severity={
                        tipoMensagem
                    }

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
                        {notaEditando
                            ? 'Editar Nota'
                            : 'Cadastro de Notas'}
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={
                            salvarNota
                        }
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* ALUNO */}

                            <Grid
                                item
                                xs={12}
                                md={3}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    required

                                    label="Aluno"

                                    name="aluno_id"

                                    value={
                                        form.aluno_id
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    disabled={
                                        salvando
                                    }
                                >

                                    {alunos.map(
                                        (aluno) => (

                                            <MenuItem
                                                key={
                                                    aluno.id
                                                }

                                                value={
                                                    aluno.id
                                                }
                                            >
                                                {
                                                    aluno.nome
                                                }
                                            </MenuItem>

                                        )
                                    )}

                                    {alunos.length === 0 && (

                                        <MenuItem
                                            value=""
                                            disabled
                                        >
                                            Nenhum aluno cadastrado
                                        </MenuItem>

                                    )}

                                </TextField>

                            </Grid>

                            {/* DISCIPLINA */}

                            <Grid
                                item
                                xs={12}
                                md={3}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    required

                                    label="Disciplina"

                                    name="disciplina"

                                    value={
                                        form.disciplina
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    disabled={
                                        salvando
                                    }
                                >

                                    {disciplinas.map(
                                        (disciplina) => (

                                            <MenuItem
                                                key={
                                                    disciplina.id ||
                                                    disciplina.nome
                                                }

                                                value={
                                                    disciplina.nome ||
                                                    disciplina
                                                }
                                            >
                                                {
                                                    disciplina.nome ||
                                                    disciplina
                                                }
                                            </MenuItem>

                                        )
                                    )}

                                    {disciplinas.length === 0 && (

                                        <MenuItem
                                            value=""
                                            disabled
                                        >
                                            Nenhuma disciplina cadastrada
                                        </MenuItem>

                                    )}

                                </TextField>

                            </Grid>

                            {/* BIMESTRE */}

                            <Grid
                                item
                                xs={12}
                                md={3}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    required

                                    label="Bimestre"

                                    name="bimestre"

                                    value={
                                        form.bimestre
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    disabled={
                                        salvando
                                    }
                                >

                                    {BIMESTRES.map(
                                        (bimestre) => (

                                            <MenuItem
                                                key={
                                                    bimestre
                                                }

                                                value={
                                                    bimestre
                                                }
                                            >
                                                {
                                                    bimestre
                                                }
                                            </MenuItem>

                                        )
                                    )}

                                </TextField>

                            </Grid>

                            {/* NOTA */}

                            <Grid
                                item
                                xs={12}
                                md={3}
                            >

                                <TextField
                                    fullWidth
                                    required

                                    type="number"

                                    label="Nota"

                                    name="nota"

                                    value={
                                        form.nota
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    disabled={
                                        salvando
                                    }

                                    inputProps={{
                                        min: 0,
                                        max: 10,
                                        step: 0.1
                                    }}
                                />

                            </Grid>

                        </Grid>

                        {/* BOTÕES */}

                        <Stack
                            direction={{
                                xs: 'column',
                                sm: 'row'
                            }}

                            spacing={2}

                            sx={{
                                mt: 3
                            }}
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
                                    : notaEditando
                                        ? 'Atualizar nota'
                                        : 'Salvar nota'}
                            </Button>

                            <Button
                                type="button"
                                variant="outlined"

                                disabled={
                                    salvando
                                }

                                onClick={() => {

                                    setForm(
                                        formularioInicial
                                    );

                                    setNotaEditando(
                                        null
                                    );

                                    setMensagem('');

                                }}
                            >
                                Limpar
                            </Button>

                            {notaEditando && (

                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="inherit"

                                    disabled={
                                        salvando
                                    }

                                    onClick={
                                        cancelarEdicao
                                    }
                                >
                                    Cancelar edição
                                </Button>

                            )}

                        </Stack>

                    </Box>

                </CardContent>

            </Card>

            {/* ==========================================
                ESTATÍSTICAS
            ========================================== */}

            <Grid
                container
                spacing={2}
                sx={{
                    mb: 4
                }}
            >

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            textAlign: 'center'
                        }}
                    >

                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            Maior Nota
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="success.main"
                        >
                            {maiorNota !== null
                                ? maiorNota.toFixed(1)
                                : '—'}
                        </Typography>

                    </Paper>

                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            textAlign: 'center'
                        }}
                    >

                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            Menor Nota
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="error.main"
                        >
                            {menorNota !== null
                                ? menorNota.toFixed(1)
                                : '—'}
                        </Typography>

                    </Paper>

                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2.5,
                            borderRadius: 3,
                            textAlign: 'center'
                        }}
                    >

                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            Média da Turma
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="primary.main"
                        >
                            {mediaDaTurma !== null
                                ? mediaDaTurma.toFixed(2)
                                : '—'}
                        </Typography>

                    </Paper>

                </Grid>

            </Grid>

            {/* ==========================================
                LISTAGEM
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
                        Notas cadastradas
                    </Typography>

                    <TableContainer
                        component={Paper}
                        variant="outlined"
                    >

                        <Table>

                            <TableHead>

                                <TableRow>

                                    <TableCell>
                                        <strong>
                                            Aluno
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Disciplina
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Bimestre
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Nota
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Situação
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
                                            colSpan={6}
                                            align="center"
                                        >

                                            <Typography
                                                sx={{
                                                    py: 4
                                                }}
                                            >
                                                Carregando notas...
                                            </Typography>

                                        </TableCell>

                                    </TableRow>

                                ) : notas.length === 0 ? (

                                    <TableRow>

                                        <TableCell
                                            colSpan={6}
                                            align="center"
                                        >

                                            <Typography
                                                color="text.secondary"
                                                sx={{
                                                    py: 4
                                                }}
                                            >
                                                Nenhuma nota cadastrada ainda.
                                            </Typography>

                                        </TableCell>

                                    </TableRow>

                                ) : (

                                    notas.map(
                                        (item) => {

                                            const nota =
                                                Number(
                                                    item.nota
                                                );

                                            const situacao =
                                                situacaoDaMedia(
                                                    nota
                                                );

                                            return (

                                                <TableRow
                                                    key={
                                                        item.id
                                                    }
                                                    hover
                                                >

                                                    <TableCell>
                                                        {
                                                            item.aluno
                                                                ? item.aluno.nome
                                                                : nomeDoAluno(
                                                                    item.aluno_id
                                                                )
                                                        }
                                                    </TableCell>

                                                    <TableCell>
                                                        {
                                                            item.disciplina
                                                        }
                                                    </TableCell>

                                                    <TableCell>
                                                        {
                                                            item.bimestre
                                                        }
                                                    </TableCell>

                                                    <TableCell>
                                                        <strong>
                                                            {
                                                                nota.toFixed(
                                                                    1
                                                                )
                                                            }
                                                        </strong>
                                                    </TableCell>

                                                    <TableCell>

                                                        <Chip
                                                            size="small"

                                                            label={
                                                                situacao.texto
                                                            }

                                                            color={
                                                                situacao.cor
                                                            }
                                                        />

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

                                                                disabled={
                                                                    salvando ||
                                                                    excluindoId !== null
                                                                }

                                                                onClick={() =>
                                                                    editarNota(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                Editar
                                                            </Button>

                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                variant="outlined"

                                                                disabled={
                                                                    salvando ||
                                                                    excluindoId !== null
                                                                }

                                                                onClick={() =>
                                                                    excluirNota(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                {excluindoId ===
                                                                    item.id
                                                                    ? 'Excluindo...'
                                                                    : 'Excluir'}
                                                            </Button>

                                                        </Stack>

                                                    </TableCell>

                                                </TableRow>

                                            );
                                        }
                                    )

                                )}

                            </TableBody>

                        </Table>

                    </TableContainer>

                </CardContent>

            </Card>

            {/* ==========================================
                BOLETIM
            ========================================== */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 1
                        }}
                    >
                        Boletim do Aluno
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mb: 3
                        }}
                    >
                        Selecione um aluno para visualizar
                        suas notas, médias e situação.
                    </Typography>

                    <TextField
                        select
                        label="Aluno"
                        sx={{
                            minWidth: 260,
                            mb: 3
                        }}

                        value={
                            alunoConsultaId
                        }

                        onChange={
                            alterarAlunoConsulta
                        }
                    >

                        <MenuItem value="">
                            Selecione...
                        </MenuItem>

                        {alunos.map(
                            (aluno) => (

                                <MenuItem
                                    key={
                                        aluno.id
                                    }

                                    value={
                                        aluno.id
                                    }
                                >
                                    {
                                        aluno.nome
                                    }
                                </MenuItem>

                            )
                        )}

                    </TextField>

                    {alunoConsultaId && (

                        <Paper
                            variant="outlined"
                            sx={{
                                p: 3,
                                borderRadius: 3
                            }}
                        >

                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{
                                    mb: 2
                                }}
                            >
                                Aluno:{' '}
                                {
                                    alunoConsultaNome
                                }
                            </Typography>

                            {carregandoBoletim ? (

                                <Typography
                                    color="text.secondary"
                                >
                                    Carregando boletim...
                                </Typography>

                            ) : notasConsulta.length === 0 ? (

                                <Typography
                                    color="text.secondary"
                                >
                                    Este aluno ainda não tem notas lançadas.
                                </Typography>

                            ) : (

                                <>

                                    {BIMESTRES.map(
                                        (bimestre) => {

                                            const notasDoBimestre =
                                                boletimPorBimestre[
                                                    bimestre
                                                ] || [];

                                            return (

                                                <Box
                                                    key={
                                                        bimestre
                                                    }

                                                    sx={{
                                                        mb: 3,
                                                        p: 2,
                                                        borderRadius: 2,
                                                        border:
                                                            '1px solid rgba(255,255,255,.12)',
                                                        backgroundColor:
                                                            'rgba(255,255,255,.025)'
                                                    }}
                                                >

                                                    <Typography
                                                        variant="h6"
                                                        fontWeight="bold"
                                                        sx={{
                                                            mb: 1.5
                                                        }}
                                                    >
                                                        {
                                                            bimestre
                                                        }
                                                    </Typography>

                                                    {notasDoBimestre.length === 0 ? (

                                                        <Typography
                                                            color="text.secondary"
                                                            variant="body2"
                                                        >
                                                            Nenhuma nota lançada neste bimestre.
                                                        </Typography>

                                                    ) : (

                                                        <>

                                                            <Stack
                                                                spacing={
                                                                    0.5
                                                                }
                                                            >

                                                                {notasDoBimestre.map(
                                                                    (item) => (

                                                                        <Box
                                                                            key={
                                                                                item.id
                                                                            }

                                                                            sx={{
                                                                                display:
                                                                                    'flex',
                                                                                justifyContent:
                                                                                    'space-between',
                                                                                alignItems:
                                                                                    'center',
                                                                                borderBottom:
                                                                                    '1px dotted rgba(255,255,255,.18)',
                                                                                py:
                                                                                    0.75
                                                                            }}
                                                                        >

                                                                            <Typography>
                                                                                {
                                                                                    item.disciplina
                                                                                }
                                                                            </Typography>

                                                                            <Typography
                                                                                fontWeight={
                                                                                    700
                                                                                }
                                                                            >
                                                                                {
                                                                                    Number(
                                                                                        item.nota
                                                                                    ).toFixed(
                                                                                        1
                                                                                    )
                                                                                }
                                                                            </Typography>

                                                                        </Box>

                                                                    )
                                                                )}

                                                            </Stack>

                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        'flex',
                                                                    justifyContent:
                                                                        'space-between',
                                                                    alignItems:
                                                                        'center',
                                                                    mt:
                                                                        1.5,
                                                                    pt:
                                                                        1.25,
                                                                    borderTop:
                                                                        '1px solid rgba(255,255,255,.14)'
                                                                }}
                                                            >

                                                                <Typography
                                                                    fontWeight="bold"
                                                                >
                                                                    Média do{' '}
                                                                    {
                                                                        bimestre
                                                                    }:
                                                                </Typography>

                                                                <Typography
                                                                    variant="h6"
                                                                    fontWeight="bold"
                                                                >
                                                                    {calcularMedia(
                                                                        notasDoBimestre.map(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.nota
                                                                        )
                                                                    ).toFixed(
                                                                        2
                                                                    )}
                                                                </Typography>

                                                            </Box>

                                                        </>

                                                    )}

                                                </Box>

                                            );
                                        }
                                    )}

                                    <Stack
                                        direction={{
                                            xs: 'column',
                                            sm: 'row'
                                        }}

                                        justifyContent="space-between"
                                        alignItems={{
                                            xs: 'flex-start',
                                            sm: 'center'
                                        }}

                                        spacing={2}

                                        sx={{
                                            borderTop:
                                                '2px solid rgba(255,255,255,.25)',
                                            pt: 1.5,
                                            mt: 1
                                        }}
                                    >

                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                        >
                                            Média Geral:{' '}
                                            {
                                                mediaGeralAluno.toFixed(
                                                    2
                                                )
                                            }
                                        </Typography>

                                        <Chip
                                            label={
                                                situacaoAluno.texto
                                            }

                                            color={
                                                situacaoAluno.cor
                                            }

                                            sx={{
                                                fontWeight:
                                                    'bold'
                                            }}
                                        />

                                    </Stack>

                                </>

                            )}

                        </Paper>

                    )}

                </CardContent>

            </Card>

        </Box>
    );
}

export default Notas;