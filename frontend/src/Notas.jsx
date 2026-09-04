import { useEffect, useState } from 'react';

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
    if (!valores || valores.length === 0) {
        return null;
    }

    const soma = valores.reduce(
        (total, valor) => total + Number(valor),
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
// MÉDIA POR DISCIPLINA
// ======================================================

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
// COMPONENTE
// ======================================================

function Notas() {

    // ==================================================
    // ESTADOS
    // ==================================================

    const [form, setForm] = useState(formularioInicial);
    const [notas, setNotas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);

    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('success');

    const [alunoConsultaId, setAlunoConsultaId] = useState('');
    const [alunoConsultaNome, setAlunoConsultaNome] = useState('');
    const [notasConsulta, setNotasConsulta] = useState([]);


    // ==================================================
    // TOKEN
    // ==================================================

    function obterToken() {
        return localStorage.getItem('token');
    }


    // ==================================================
    // HEADERS AUTENTICADOS
    // ==================================================

    function headersAutenticados() {
        const token = obterToken();

        return {
            'Content-Type': 'application/json',

            ...(token
                ? {
                    Authorization: `Bearer ${token}`
                }
                : {})
        };
    }


    // ==================================================
    // MOSTRAR MENSAGEM
    // ==================================================

    function mostrarMensagem(
        texto,
        tipo = 'success'
    ) {
        setMensagem(texto);
        setTipoMensagem(tipo);
    }


    // ==================================================
    // CARREGAR NOTAS
    // ==================================================

    async function carregarNotas() {
        try {
            const resposta = await fetch(
                '/api/notas',
                {
                    headers: headersAutenticados()
                }
            );

            if (!resposta.ok) {
                throw new Error(
                    `Erro ao carregar notas. Status: ${resposta.status}`
                );
            }

            const dados = await resposta.json();

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

            mostrarMensagem(
                erro.message,
                'error'
            );
        }
    }


    // ==================================================
    // CARREGAR ALUNOS
    // ==================================================

    async function carregarAlunos() {
        try {
            const resposta = await fetch(
                '/api/alunos',
                {
                    headers: headersAutenticados()
                }
            );

            if (!resposta.ok) {
                throw new Error(
                    `Erro ao carregar alunos. Status: ${resposta.status}`
                );
            }

            const dados = await resposta.json();

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

            mostrarMensagem(
                erro.message,
                'error'
            );
        }
    }


    // ==================================================
    // CARREGAR DISCIPLINAS
    // ==================================================

    async function carregarDisciplinas() {
        try {
            const resposta = await fetch(
                'http://localhost:3000/disciplinas',
                {
                    method: 'GET',
                    headers: headersAutenticados()
                }
            );

            if (!resposta.ok) {
                const textoErro =
                    await resposta.text();

                console.error(
                    'Resposta da API de disciplinas:',
                    textoErro
                );

                throw new Error(
                    `Erro ao carregar disciplinas. Status: ${resposta.status}`
                );
            }

            const dados =
                await resposta.json();

            console.log(
                'DISCIPLINAS CARREGADAS:',
                dados
            );

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
                erro.message,
                'error'
            );
        }
    }


    // ==================================================
    // CARREGAR DADOS
    // ==================================================

    useEffect(() => {
        carregarNotas();
        carregarAlunos();
        carregarDisciplinas();
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
            (formAnterior) => ({
                ...formAnterior,
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

        const notaNumerica =
            Number(form.nota);

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
                '/api/notas',
                {
                    method: 'POST',
                    headers: headersAutenticados(),
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
                    'Erro ao cadastrar nota.'
                );
            }

            mostrarMensagem(
                'Nota cadastrada com sucesso!',
                'success'
            );

            const alunoIdAtual =
                form.aluno_id;

            setForm({
                ...formularioInicial,
                aluno_id: alunoIdAtual
            });

            await carregarNotas();

            if (
                alunoConsultaId &&
                Number(alunoConsultaId) ===
                Number(form.aluno_id)
            ) {
                await consultarAluno(
                    alunoConsultaId
                );
            }

        } catch (erro) {
            console.error(
                'Erro ao cadastrar nota:',
                erro
            );

            mostrarMensagem(
                erro.message,
                'error'
            );
        }
    }


    // ==================================================
    // CONSULTAR ALUNO
    // ==================================================

    async function consultarAluno(alunoId) {
        if (!alunoId) {
            setNotasConsulta([]);
            setAlunoConsultaNome('');
            return;
        }

        try {
            const resposta = await fetch(
                `/api/notas/aluno/${alunoId}`,
                {
                    headers:
                        headersAutenticados()
                }
            );

            if (!resposta.ok) {
                const erro =
                    await resposta.text();

                throw new Error(
                    erro ||
                    'Erro ao consultar notas.'
                );
            }

            const dados =
                await resposta.json();

            if (dados.notas) {
                setNotasConsulta(
                    Array.isArray(dados.notas)
                        ? dados.notas
                        : []
                );
            } else if (
                Array.isArray(dados)
            ) {
                setNotasConsulta(dados);
            } else {
                setNotasConsulta([]);
            }

            if (dados.aluno) {
                setAlunoConsultaNome(
                    dados.aluno.nome
                );
            } else {
                const aluno =
                    alunos.find(
                        (item) =>
                            Number(item.id) ===
                            Number(alunoId)
                    );

                setAlunoConsultaNome(
                    aluno?.nome || ''
                );
            }

        } catch (erro) {
            console.error(
                'Erro ao consultar aluno:',
                erro
            );

            mostrarMensagem(
                erro.message,
                'error'
            );

            setNotasConsulta([]);
        }
    }


    // ==================================================
    // ALTERAR ALUNO DA CONSULTA
    // ==================================================

    function alterarAlunoConsulta(event) {
        const novoId =
            event.target.value;

        setAlunoConsultaId(novoId);

        consultarAluno(novoId);
    }


    // ==================================================
    // NOME DO ALUNO
    // ==================================================

    function nomeDoAluno(alunoId) {
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
        valoresDeTodasAsNotas.length > 0
            ? Math.max(
                ...valoresDeTodasAsNotas
            )
            : null;

    const menorNota =
        valoresDeTodasAsNotas.length > 0
            ? Math.min(
                ...valoresDeTodasAsNotas
            )
            : null;

    const mediaDaTurma =
        calcularMedia(
            valoresDeTodasAsNotas
        );


    // ==================================================
    // MÉDIA GERAL DO ALUNO
    // ==================================================

    const mediaGeralAluno =
        calcularMedia(
            notasConsulta.map(
                (item) =>
                    Number(item.nota)
            )
        );

    const situacaoAluno =
        situacaoDaMedia(
            mediaGeralAluno
        );


    // ==================================================
    // NOTAS DO BIMESTRE
    // ==================================================

    function notasDoBimestre(bimestre) {
        return notasConsulta.filter(
            (nota) =>
                nota.bimestre ===
                bimestre
        );
    }


    // ==================================================
    // MÉDIA DO BIMESTRE
    // ==================================================

    function mediaDoBimestre(bimestre) {
        const notasBimestre =
            notasDoBimestre(bimestre);

        return calcularMedia(
            notasBimestre.map(
                (item) =>
                    Number(item.nota)
            )
        );
    }


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
                Cadastre, consulte e acompanhe
                o desempenho dos alunos.
            </Typography>


            {/* ==================================================
                MENSAGEM
            ================================================== */}

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


            {/* ==================================================
                CADASTRO
            ================================================== */}

            <Card sx={{ mb: 4 }}>

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
                                    value={form.aluno_id}
                                    onChange={handleChange}
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
                                    value={form.disciplina}
                                    onChange={handleChange}
                                    disabled={
                                        disciplinas.length === 0
                                    }
                                >

                                    {disciplinas.map(
                                        (disciplina) => {

                                            const nome =
                                                typeof disciplina ===
                                                'string'
                                                    ? disciplina
                                                    : disciplina.nome;

                                            const id =
                                                typeof disciplina ===
                                                'string'
                                                    ? disciplina
                                                    : disciplina.id;

                                            return (
                                                <MenuItem
                                                    key={id}
                                                    value={nome}
                                                >
                                                    {nome}
                                                </MenuItem>
                                            );
                                        }
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
                                    value={form.bimestre}
                                    onChange={handleChange}
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
                                    value={form.nota}
                                    onChange={handleChange}
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


            {/* ==================================================
                ESTATÍSTICAS
            ================================================== */}

            <Grid
                container
                spacing={2}
                sx={{ mb: 4 }}
            >

                {/* MAIOR NOTA */}

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


                {/* MENOR NOTA */}

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


                {/* MÉDIA DA TURMA */}

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


            {/* ==================================================
                NOTAS CADASTRADAS
            ================================================== */}

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

                                </TableRow>

                            </TableHead>


                            <TableBody>

                                {notas.map(
                                    (item) => (
                                        <TableRow
                                            key={item.id}
                                            hover
                                        >

                                            <TableCell>
                                                {item.aluno
                                                    ? item.aluno.nome
                                                    : nomeDoAluno(
                                                        item.aluno_id
                                                    )}
                                            </TableCell>

                                            <TableCell>
                                                {item.disciplina}
                                            </TableCell>

                                            <TableCell>
                                                {item.bimestre}
                                            </TableCell>

                                            <TableCell>
                                                {Number(
                                                    item.nota
                                                ).toFixed(1)}
                                            </TableCell>

                                        </TableRow>
                                    )
                                )}


                                {notas.length === 0 && (
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


            {/* ==================================================
                BOLETIM
            ================================================== */}

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
                        Selecione um aluno para ver
                        as notas separadas por bimestre.
                    </Typography>


                    {/* SELECIONAR ALUNO */}

                    <TextField
                        select
                        label="Aluno"
                        value={alunoConsultaId}
                        onChange={alterarAlunoConsulta}
                        sx={{
                            minWidth: 260,
                            mb: 3
                        }}
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


                    {/* BOLETIM */}

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
                                sx={{ mb: 3 }}
                            >
                                Aluno:{' '}
                                {alunoConsultaNome}
                            </Typography>


                            {/* SEM NOTAS */}

                            {notasConsulta.length === 0 ? (

                                <Typography
                                    color="text.secondary"
                                >
                                    Este aluno ainda não
                                    tem notas lançadas.
                                </Typography>

                            ) : (

                                <>

                                    <Stack spacing={3}>

                                        {BIMESTRES.map(
                                            (bimestre) => {

                                                const notasBimestre =
                                                    notasDoBimestre(
                                                        bimestre
                                                    );

                                                const mediaBimestre =
                                                    mediaDoBimestre(
                                                        bimestre
                                                    );

                                                return (
                                                    <Paper
                                                        key={bimestre}
                                                        variant="outlined"
                                                        sx={{
                                                            p: 2.5,
                                                            borderRadius: 2
                                                        }}
                                                    >

                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                mb: 2
                                                            }}
                                                        >

                                                            <Typography
                                                                variant="h6"
                                                                fontWeight="bold"
                                                            >
                                                                {bimestre}
                                                            </Typography>


                                                            {mediaBimestre !==
                                                                null && (

                                                                <Chip
                                                                    label={
                                                                        `Média: ${mediaBimestre.toFixed(2)}`
                                                                    }
                                                                    color={
                                                                        mediaBimestre >= 6
                                                                            ? 'success'
                                                                            : mediaBimestre >= 4
                                                                                ? 'warning'
                                                                                : 'error'
                                                                    }
                                                                    sx={{
                                                                        fontWeight:
                                                                            'bold'
                                                                    }}
                                                                />

                                                            )}

                                                        </Box>


                                                        {/* NOTAS DO BIMESTRE */}

                                                        {notasBimestre.length ===
                                                        0 ? (

                                                            <Typography
                                                                color="text.secondary"
                                                            >
                                                                Nenhuma nota lançada neste bimestre.
                                                            </Typography>

                                                        ) : (

                                                            <Stack
                                                                spacing={0.5}
                                                            >

                                                                {mediaPorDisciplina(
                                                                    notasBimestre
                                                                ).map(
                                                                    (item) => (

                                                                        <Box
                                                                            key={
                                                                                item.disciplina
                                                                            }
                                                                            sx={{
                                                                                display: 'flex',
                                                                                justifyContent: 'space-between',
                                                                                alignItems: 'center',
                                                                                borderBottom: '1px dotted #777',
                                                                                py: 0.8
                                                                            }}
                                                                        >

                                                                            <Typography>
                                                                                {
                                                                                    item.disciplina
                                                                                }
                                                                            </Typography>

                                                                            <Typography
                                                                                fontWeight={600}
                                                                            >
                                                                                {
                                                                                    item.media !==
                                                                                    null
                                                                                        ? item.media.toFixed(1)
                                                                                        : '—'
                                                                                }
                                                                            </Typography>

                                                                        </Box>

                                                                    )
                                                                )}

                                                            </Stack>

                                                        )}

                                                    </Paper>
                                                );
                                            }
                                        )}

                                    </Stack>


                                    {/* ==================================================
                                        MÉDIA GERAL
                                    ================================================== */}

                                    <Box
                                        sx={{
                                            mt: 3,
                                            pt: 2,
                                            borderTop:
                                                '2px solid #333'
                                        }}
                                    >

                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >

                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                            >
                                                Média Geral:{' '}

                                                {mediaGeralAluno !==
                                                null
                                                    ? mediaGeralAluno.toFixed(2)
                                                    : '—'}
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

                                    </Box>

                                </>

                            )}

                        </Paper>

                    )}

                </CardContent>

            </Card>

        </Box>
    );
}


// ======================================================
// EXPORTAÇÃO
// ======================================================

export default Notas;