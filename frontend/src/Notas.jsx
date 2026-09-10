import { useEffect, useState } from 'react';


const API_URL = 'http://localhost:3000';

function headersComToken() {
    const token = localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Button,
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
// OPÇÕES FIXAS
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
// FUNÇÕES DE APOIO (Boss Challenge)
// ======================================================

// Nível 1 — média simples de uma lista de notas
function calcularMedia(valores) {

    if (!valores || valores.length === 0) {
        return null;
    }

    const soma = valores.reduce(
        (acumulado, valor) => acumulado + Number(valor),
        0
    );

    return soma / valores.length;

}


// Nível 2 — situação do aluno a partir da média
function situacaoDaMedia(media) {

    if (media === null) {
        return { texto: 'Sem notas', cor: 'default' };
    }

    if (media >= 6) {
        return { texto: 'Aprovado', cor: 'success' };
    }

    if (media >= 4) {
        return { texto: 'Recuperação', cor: 'warning' };
    }

    return { texto: 'Reprovado', cor: 'error' };

}


// Agrupa as notas de um aluno por disciplina e tira a média de cada uma
function mediaPorDisciplina(notas) {

    const grupos = {};

    notas.forEach((nota) => {

        if (!grupos[nota.disciplina]) {
            grupos[nota.disciplina] = [];
        }

        grupos[nota.disciplina].push(nota.nota);

    });

    return Object.entries(grupos).map(
        ([disciplina, valores]) => ({
            disciplina,
            media: calcularMedia(valores)
        })
    );

}


// ======================================================
// AGRUPAR BOLETIM POR BIMESTRE
// ======================================================

function agruparNotasPorBimestre(notas) {

    const grupos = {};

    BIMESTRES.forEach((bimestre) => {
        grupos[bimestre] = [];
    });

    notas.forEach((nota) => {

        const bimestre =
            BIMESTRES.includes(nota.bimestre)
                ? nota.bimestre
                : 'Outros';

        if (!grupos[bimestre]) {
            grupos[bimestre] = [];
        }

        grupos[bimestre].push(nota);
    });

    return grupos;
}


// ======================================================
// COMPONENTE
// ======================================================

function Notas() {

    const [form, setForm] = useState(
        formularioInicial
    );

    const [notas, setNotas] = useState([]);

    const [alunos, setAlunos] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);

    const [mensagem, setMensagem] = useState('');

    const [tipoMensagem, setTipoMensagem] =
        useState('success');


    // ==================================================
    // CONSULTA / BOLETIM DO ALUNO
    // ==================================================

    const [alunoConsultaId, setAlunoConsultaId] =
        useState('');

    const [alunoConsultaNome, setAlunoConsultaNome] =
        useState('');

    const [notasConsulta, setNotasConsulta] =
        useState([]);


    // ==================================================
    // CARREGAR NOTAS (vem do Back-End, não é array fixo)
    // ==================================================

    async function carregarDisciplinas() {
        try {
            const resposta = await fetch(
                'http://localhost:3000/disciplinas',
                {
                    headers: headersComToken()
                }
            );

            if (!resposta.ok) {
                throw new Error('Erro ao carregar disciplinas.');
            }

            const dados = await resposta.json();
            setDisciplinas(Array.isArray(dados) ? dados : []);
        } catch (erro) {
            console.error(erro);
            setDisciplinas([]);
        }
    }

    async function carregarNotas() {

        try {

            const resposta = await fetch(
                'http://localhost:3000/notas',
                { headers: headersComToken() }
            );

            if (!resposta.ok) {

                throw new Error(
                    'Erro ao carregar notas.'
                );

            }

            const dados =
                await resposta.json();

            setNotas(dados);

        } catch (erro) {

            console.error(erro);

            mostrarMensagem(
                erro.message,
                'error'
            );

        }

    }


    // ==================================================
    // CARREGAR ALUNOS (para o Select)
    // ==================================================

    async function carregarAlunos() {

        try {

            const resposta = await fetch(
                'http://localhost:3000/alunos',
                { headers: headersComToken() }
            );

            if (!resposta.ok) {

                throw new Error(
                    'Erro ao carregar alunos.'
                );

            }

            const dados =
                await resposta.json();

            setAlunos(dados);

        } catch (erro) {

            console.error(erro);

        }

    }


    // ==================================================
    // CARREGAR TUDO
    // ==================================================

    useEffect(() => {

        carregarDisciplinas();

        carregarNotas();

        carregarAlunos();

    }, []);


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
    // CADASTRAR NOTA
    // ==================================================

    async function cadastrarNota(event) {

        event.preventDefault();


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


        if (form.nota === '') {

            mostrarMensagem(
                'Informe a nota.',
                'error'
            );

            return;
        }


        const notaNumerica = Number(form.nota);

        if (
            Number.isNaN(notaNumerica) ||
            notaNumerica < 0 ||
            notaNumerica > 10
        ) {

            mostrarMensagem(
                'A nota deve ser um número entre 0 e 10.',
                'error'
            );

            return;
        }


        try {

            const resposta = await fetch(
                'http://localhost:3000/notas',
                {
                    method: 'POST',

                    headers: headersComToken(),

                    body: JSON.stringify({

                        aluno_id:
                            Number(form.aluno_id),

                        disciplina:
                            form.disciplina,

                        bimestre:
                            form.bimestre,

                        nota:
                            notaNumerica

                    })
                }
            );


            if (!resposta.ok) {

                const erro =
                    await resposta.text();

                throw new Error(
                    erro ||
                    'Erro ao salvar nota.'
                );

            }


            mostrarMensagem(
                'Nota cadastrada com sucesso!',
                'success'
            );

            setForm(
                (formularioAnterior) => ({
                    ...formularioInicial,
                    aluno_id: formularioAnterior.aluno_id
                })
            );

            await carregarNotas();

            // Se a nota cadastrada é do aluno que está sendo
            // consultado no boletim, atualiza a consulta também.
            if (
                alunoConsultaId &&
                Number(alunoConsultaId) === Number(form.aluno_id)
            ) {

                await consultarAluno(alunoConsultaId);

            }


        } catch (erro) {

            console.error(erro);

            mostrarMensagem(
                erro.message,
                'error'
            );

        }

    }


    // ==================================================
    // CONSULTAR NOTAS DE UM ALUNO (GET /notas/aluno/:id)
    // ==================================================

    async function consultarAluno(alunoId) {

        if (!alunoId) {

            setNotasConsulta([]);

            setAlunoConsultaNome('');

            return;
        }


        try {

            const resposta = await fetch(
                `http://localhost:3000/notas/aluno/${alunoId}`,
                { headers: headersComToken() }
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

            setNotasConsulta(dados.notas);

            setAlunoConsultaNome(dados.aluno.nome);

        } catch (erro) {

            console.error(erro);

            mostrarMensagem(
                erro.message,
                'error'
            );

            setNotasConsulta([]);

        }

    }


    function alterarAlunoConsulta(event) {

        const novoId = event.target.value;

        setAlunoConsultaId(novoId);

        consultarAluno(novoId);

    }


    // ==================================================
    // NOME DO ALUNO A PARTIR DO ID
    // ==================================================

    function nomeDoAluno(alunoId) {

        const aluno = alunos.find(
            (item) => item.id === alunoId
        );

        return aluno ? aluno.nome : '—';

    }


    // ==================================================
    // BOSS CHALLENGE — NÍVEL 3
    // MAIOR NOTA / MENOR NOTA / MÉDIA DA TURMA
    // ==================================================

    const valoresDeTodasAsNotas =
        notas.map((item) => Number(item.nota));

    const maiorNota =
        valoresDeTodasAsNotas.length
            ? Math.max(...valoresDeTodasAsNotas)
            : null;

    const menorNota =
        valoresDeTodasAsNotas.length
            ? Math.min(...valoresDeTodasAsNotas)
            : null;

    const mediaDaTurma =
        calcularMedia(valoresDeTodasAsNotas);


    // ==================================================
    // BOLETIM DO ALUNO CONSULTADO (Níveis 1, 2 e 4)
    // ==================================================

    const boletimPorBimestre =
        agruparNotasPorBimestre(notasConsulta);

    const mediaGeralAluno = calcularMedia(
        notasConsulta.map((item) => item.nota)
    );

    const situacaoAluno =
        situacaoDaMedia(mediaGeralAluno);


    // ==================================================
    // RENDER
    // ==================================================

    return (

        <Box>

            <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mb: 1 }}
            >
                Lançamento de Notas
            </Typography>


            <Typography
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Cadastre, consulte e acompanhe o desempenho dos alunos.
            </Typography>


            {/* ==========================================
                MENSAGEM
            ========================================== */}

            {mensagem && (

                <Alert
                    severity={tipoMensagem}
                    sx={{ mb: 3 }}

                    onClose={() =>
                        setMensagem('')
                    }
                >
                    {mensagem}
                </Alert>

            )}


            {/* ==========================================
                CADASTRO DE NOTAS
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
                        sx={{ mb: 3 }}
                    >
                        Cadastro de Notas
                    </Typography>


                    <Box
                        component="form"
                        onSubmit={cadastrarNota}
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
                                >

                                    {alunos.map(
                                        (aluno) => (

                                            <MenuItem
                                                key={aluno.id}
                                                value={aluno.id}
                                            >
                                                {aluno.nome}
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
                                >

                                    {disciplinas.map(
                                        (disciplina) => (

                                            <MenuItem
                                                key={disciplina.nome || disciplina}
                                                value={disciplina.nome || disciplina}
                                            >
                                                {disciplina.nome || disciplina}
                                            </MenuItem>

                                        )
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
                                >

                                    {BIMESTRES.map(
                                        (bimestre) => (

                                            <MenuItem
                                                key={bimestre}
                                                value={bimestre}
                                            >
                                                {bimestre}
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
                            direction="row"
                            spacing={2}
                            sx={{ mt: 3 }}
                        >

                            <Button
                                type="submit"
                                variant="contained"
                            >
                                Salvar
                            </Button>


                            <Button
                                type="button"
                                variant="outlined"

                                onClick={() => {

                                    setForm(
                                        formularioInicial
                                    );

                                    setMensagem('');

                                }}
                            >
                                Limpar
                            </Button>

                        </Stack>

                    </Box>

                </CardContent>

            </Card>


            {/* ==========================================
                BOSS CHALLENGE — NÍVEL 3
                MAIOR / MENOR / MÉDIA DA TURMA
            ========================================== */}

            <Grid
                container
                spacing={2}
                sx={{ mb: 4 }}
            >

                <Grid item xs={12} md={4}>
                    <Paper
                        variant="outlined"
                        sx={{ p: 2.5, borderRadius: 3, textAlign: 'center' }}
                    >
                        <Typography color="text.secondary" variant="body2">
                            Maior Nota
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                            {maiorNota !== null ? maiorNota.toFixed(1) : '—'}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        variant="outlined"
                        sx={{ p: 2.5, borderRadius: 3, textAlign: 'center' }}
                    >
                        <Typography color="text.secondary" variant="body2">
                            Menor Nota
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="error.main">
                            {menorNota !== null ? menorNota.toFixed(1) : '—'}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        variant="outlined"
                        sx={{ p: 2.5, borderRadius: 3, textAlign: 'center' }}
                    >
                        <Typography color="text.secondary" variant="body2">
                            Média da Turma
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" color="primary.main">
                            {mediaDaTurma !== null ? mediaDaTurma.toFixed(2) : '—'}
                        </Typography>
                    </Paper>
                </Grid>

            </Grid>


            {/* ==========================================
                LISTAGEM GERAL DE NOTAS
            ========================================== */}

            <Card sx={{ mb: 4 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
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

                                    <TableCell><strong>Aluno</strong></TableCell>
                                    <TableCell><strong>Disciplina</strong></TableCell>
                                    <TableCell><strong>Bimestre</strong></TableCell>
                                    <TableCell><strong>Nota</strong></TableCell>

                                </TableRow>

                            </TableHead>


                            <TableBody>

                                {notas.map((item) => (

                                    <TableRow
                                        key={item.id}
                                        hover
                                    >

                                        <TableCell>
                                            {item.aluno
                                                ? item.aluno.nome
                                                : nomeDoAluno(item.aluno_id)}
                                        </TableCell>

                                        <TableCell>
                                            {item.disciplina}
                                        </TableCell>

                                        <TableCell>
                                            {item.bimestre}
                                        </TableCell>

                                        <TableCell>
                                            {Number(item.nota).toFixed(1)}
                                        </TableCell>

                                    </TableRow>

                                ))}


                                {notas.length === 0 && (

                                    <TableRow>

                                        <TableCell
                                            colSpan={4}
                                            align="center"
                                        >

                                            <Typography
                                                color="text.secondary"
                                                sx={{ py: 4 }}
                                            >
                                                Nenhuma nota cadastrada ainda.
                                            </Typography>

                                        </TableCell>

                                    </TableRow>

                                )}

                            </TableBody>

                        </Table>

                    </TableContainer>

                </CardContent>

            </Card>


            {/* ==========================================
                BOLETIM DO ALUNO
                (Boss Challenge Níveis 1, 2 e 4)
            ========================================== */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                    >
                        Boletim do Aluno
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Selecione um aluno para ver a média por disciplina, a média geral e a situação.
                    </Typography>


                    <TextField
                        select
                        label="Aluno"
                        sx={{ minWidth: 260, mb: 3 }}

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
                                    key={aluno.id}
                                    value={aluno.id}
                                >
                                    {aluno.nome}
                                </MenuItem>

                            )
                        )}

                    </TextField>


                    {alunoConsultaId && (

                        <Paper
                            variant="outlined"
                            sx={{ p: 3, borderRadius: 3 }}
                        >

                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{ mb: 1 }}
                            >
                                Aluno: {alunoConsultaNome}
                            </Typography>


                            {notasConsulta.length === 0 ? (

                                <Typography color="text.secondary">
                                    Este aluno ainda não tem notas lançadas.
                                </Typography>

                            ) : (

                                <>

                                    {BIMESTRES.map((bimestre) => {

                                        const notasDoBimestre =
                                            boletimPorBimestre[bimestre] || [];

                                        if (notasDoBimestre.length === 0) {
                                            return (
                                                <Box
                                                    key={bimestre}
                                                    sx={{
                                                        mb: 2,
                                                        p: 2,
                                                        borderRadius: 2,
                                                        border: '1px dashed rgba(255,255,255,.18)',
                                                        backgroundColor: 'rgba(255,255,255,.02)'
                                                    }}
                                                >
                                                    <Typography
                                                        fontWeight="bold"
                                                        sx={{ mb: 0.5 }}
                                                    >
                                                        {bimestre}
                                                    </Typography>

                                                    <Typography
                                                        color="text.secondary"
                                                        variant="body2"
                                                    >
                                                        Nenhuma nota lançada neste bimestre.
                                                    </Typography>
                                                </Box>
                                            );
                                        }

                                        return (
                                            <Box
                                                key={bimestre}
                                                sx={{
                                                    mb: 3,
                                                    p: 2,
                                                    borderRadius: 2.5,
                                                    border: '1px solid rgba(255,255,255,.12)',
                                                    backgroundColor: 'rgba(255,255,255,.025)'
                                                }}
                                            >

                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    sx={{ mb: 1.5 }}
                                                >
                                                    {bimestre}
                                                </Typography>

                                                <Stack spacing={0.5}>

                                                    {notasDoBimestre.map(
                                                        (item) => (
                                                            <Box
                                                                key={item.id}
                                                                sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                    borderBottom: '1px dotted rgba(255,255,255,.18)',
                                                                    py: 0.75
                                                                }}
                                                            >

                                                                <Typography>
                                                                    {item.disciplina}
                                                                </Typography>

                                                                <Typography
                                                                    fontWeight={700}
                                                                >
                                                                    {Number(item.nota).toFixed(1)}
                                                                </Typography>

                                                            </Box>
                                                        )
                                                    )}

                                                </Stack>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        mt: 1.5,
                                                        pt: 1.25,
                                                        borderTop: '1px solid rgba(255,255,255,.14)'
                                                    }}
                                                >

                                                    <Typography
                                                        variant="body1"
                                                        fontWeight="bold"
                                                    >
                                                        Média do {bimestre}:
                                                    </Typography>

                                                    <Typography
                                                        variant="h6"
                                                        fontWeight="bold"
                                                    >
                                                        {calcularMedia(
                                                            notasDoBimestre.map(
                                                                (item) => item.nota
                                                            )
                                                        ).toFixed(2)}
                                                    </Typography>

                                                </Box>

                                            </Box>
                                        );
                                    })}


                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{
                                            borderTop: '2px solid rgba(255,255,255,.25)',
                                            pt: 1.5,
                                            mt: 1
                                        }}
                                    >

                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                        >
                                            Média Geral: {mediaGeralAluno.toFixed(2)}
                                        </Typography>

                                        <Chip
                                            label={situacaoAluno.texto}
                                            color={situacaoAluno.cor}
                                            sx={{ fontWeight: 'bold' }}
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