import { useEffect, useState } from 'react';

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
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
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material';


// ======================================================
// FORMULÁRIO INICIAL
// ======================================================

const formularioInicial = {
    serie: '',
    letra: '',
    ano: '',
    professor: ''
};


// ======================================================
// COMPONENTE
// ======================================================

function Turma() {

    const [form, setForm] = useState(
        formularioInicial
    );

    const [turmas, setTurmas] = useState([]);

    const [alunos, setAlunos] = useState([]);

    const [filtro, setFiltro] = useState('');

    const [mensagem, setMensagem] = useState('');

    const [tipoMensagem, setTipoMensagem] =
        useState('success');

    const [turmaEditando, setTurmaEditando] =
        useState(null);

    const [turmaExcluir, setTurmaExcluir] =
        useState(null);

    const [pagina, setPagina] =
        useState(0);

    const [linhasPorPagina, setLinhasPorPagina] =
        useState(5);


    // ==================================================
    // HEADERS COM TOKEN JWT
    // ==================================================

    function headersComToken() {

        return {
            'Content-Type': 'application/json',
            'Authorization':
                `Bearer ${localStorage.getItem('token')}`
        };

    }


    // ==================================================
    // CARREGAR TURMAS
    // ==================================================

    async function carregarTurmas() {

        try {

            const resposta = await fetch(
                '/api/turmas',
                {
                    headers: headersComToken()
                }
            );


            if (!resposta.ok) {

                throw new Error(
                    'Erro ao carregar turmas.'
                );

            }


            const dados =
                await resposta.json();


            setTurmas(dados);


        } catch (erro) {

            console.error(erro);

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
                    headers: headersComToken()
                }
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

        carregarTurmas();

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
    // CADASTRAR TURMA
    // ==================================================

    async function cadastrarTurma(event) {

        event.preventDefault();


        if (!form.serie) {

            mostrarMensagem(
                'Selecione a série.',
                'error'
            );

            return;
        }


        if (!form.letra) {

            mostrarMensagem(
                'Selecione a turma A, B ou C.',
                'error'
            );

            return;
        }


        if (!form.ano) {

            mostrarMensagem(
                'Informe o ano letivo.',
                'error'
            );

            return;
        }


        // ----------------------------------------------
        // O NOME É GERADO AUTOMATICAMENTE
        // ----------------------------------------------

        const nome =
            `${form.serie} ${form.letra}`;


        try {

            const resposta = await fetch(
                '/api/turmas',
                {
                    method: 'POST',

                    headers: headersComToken(),

                    body: JSON.stringify({

                        nome: nome,

                        serie: form.serie,

                        letra: form.letra,

                        ano: Number(form.ano),

                        professor:
                            form.professor ||
                            null

                    })
                }
            );


            if (!resposta.ok) {

                const erro =
                    await resposta.text();


                throw new Error(
                    erro ||
                    'Erro ao salvar turma.'
                );

            }


            mostrarMensagem(
                'Turma cadastrada com sucesso!',
                'success'
            );


            setForm(
                formularioInicial
            );


            await carregarTurmas();


        } catch (erro) {

            console.error(erro);

            mostrarMensagem(
                erro.message,
                'error'
            );

        }

    }


    // ==================================================
    // NOME DA TURMA
    // ==================================================

    function nomeDaTurma(turma) {

        if (turma.nome) {

            return turma.nome;

        }


        return `${turma.serie || ''} ${turma.letra || ''}`
            .trim();

    }


    // ==================================================
    // CONTAR ALUNOS
    // ==================================================

    function quantidadeAlunos(turmaId) {

        return alunos.filter(
            (aluno) =>
                Number(aluno.fk_turma) ===
                Number(turmaId)
        ).length;

    }


    // ==================================================
    // FILTRO GLOBAL
    // ==================================================

    const turmasFiltradas =
        turmas.filter((turma) => {

            const texto =
                filtro
                    .toLowerCase()
                    .trim();


            if (!texto) {

                return true;

            }


            const valores = [

                turma.id,
                turma.nome,
                turma.serie,
                turma.letra,
                turma.ano,
                turma.professor,
                quantidadeAlunos(
                    turma.id
                )

            ];


            return valores.some(
                (valor) =>
                    String(valor ?? '')
                        .toLowerCase()
                        .includes(texto)
            );

        });


    // ==================================================
    // PAGINAÇÃO
    // ==================================================

    const turmasDaPagina =
        turmasFiltradas.slice(

            pagina * linhasPorPagina,

            pagina * linhasPorPagina +
            linhasPorPagina

        );


    function mudarPagina(
        event,
        novaPagina
    ) {

        setPagina(novaPagina);

    }


    function mudarLinhasPorPagina(event) {

        setLinhasPorPagina(
            Number(event.target.value)
        );

        setPagina(0);

    }


    // ==================================================
    // ABRIR EDIÇÃO
    // ==================================================

    function abrirEdicao(turma) {

        setTurmaEditando({

            id: turma.id,

            nome: turma.nome || '',

            serie: turma.serie || '',

            letra: turma.letra || '',

            ano: turma.ano || '',

            professor:
                turma.professor || ''

        });

    }


    // ==================================================
    // ALTERAR EDIÇÃO
    // ==================================================

    function alterarEdicao(event) {

        const {
            name,
            value
        } = event.target;


        setTurmaEditando(
            (turmaAnterior) => ({

                ...turmaAnterior,

                [name]: value

            })
        );

    }


    // ==================================================
    // SALVAR EDIÇÃO
    // ==================================================

    async function salvarEdicao() {

        if (!turmaEditando) {

            return;

        }


        if (!turmaEditando.serie) {

            mostrarMensagem(
                'Selecione a série.',
                'error'
            );

            return;

        }


        if (!turmaEditando.letra) {

            mostrarMensagem(
                'Selecione a turma.',
                'error'
            );

            return;

        }


        if (!turmaEditando.ano) {

            mostrarMensagem(
                'Informe o ano letivo.',
                'error'
            );

            return;

        }


        // ----------------------------------------------
        // GERA O NOME NOVAMENTE
        // ----------------------------------------------

        const nome =
            `${turmaEditando.serie} ${turmaEditando.letra}`;


        try {

            const resposta = await fetch(

                `/api/turmas/${turmaEditando.id}`,

                {
                    method: 'PUT',

                    headers: headersComToken(),

                    body: JSON.stringify({

                        nome: nome,

                        serie:
                            turmaEditando.serie,

                        letra:
                            turmaEditando.letra,

                        ano:
                            Number(
                                turmaEditando.ano
                            ),

                        professor:
                            turmaEditando.professor ||
                            null

                    })

                }

            );


            if (!resposta.ok) {

                const erro =
                    await resposta.text();


                throw new Error(
                    erro ||
                    'Erro ao editar turma.'
                );

            }


            mostrarMensagem(
                'Alterações salvas com sucesso!',
                'success'
            );


            setTurmaEditando(null);


            await carregarTurmas();


        } catch (erro) {

            console.error(erro);

            mostrarMensagem(
                erro.message,
                'error'
            );

        }

    }


    // ==================================================
    // ABRIR EXCLUSÃO
    // ==================================================

    function abrirExclusao(turma) {

        setTurmaExcluir(turma);

    }


    // ==================================================
    // EXCLUIR TURMA
    // ==================================================

    async function confirmarExclusao() {

        if (!turmaExcluir) {

            return;

        }


        try {

            const resposta = await fetch(

                `/api/turmas/${turmaExcluir.id}`,

                {
                    method: 'DELETE',

                    headers: headersComToken()
                }

            );


            if (!resposta.ok) {

                const erro =
                    await resposta.text();


                throw new Error(
                    erro ||
                    'Erro ao excluir turma.'
                );

            }


            mostrarMensagem(
                'Turma excluída com sucesso!',
                'success'
            );


            setTurmaExcluir(null);


            await carregarTurmas();

            await carregarAlunos();


        } catch (erro) {

            console.error(erro);

            mostrarMensagem(
                erro.message,
                'error'
            );

        }

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
                Gestão de Turmas
            </Typography>


            <Typography
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Cadastre, filtre, edite e exclua turmas.
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
                CADASTRO
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
                        Cadastro de Turma
                    </Typography>


                    <Box
                        component="form"
                        onSubmit={cadastrarTurma}
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* SÉRIE */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    required

                                    label="Série"

                                    name="serie"

                                    value={
                                        form.serie
                                    }

                                    onChange={
                                        handleChange
                                    }
                                >

                                    <MenuItem value="1º Ano">
                                        1º Ano
                                    </MenuItem>

                                    <MenuItem value="2º Ano">
                                        2º Ano
                                    </MenuItem>

                                    <MenuItem value="3º Ano">
                                        3º Ano
                                    </MenuItem>

                                    <MenuItem value="4º Ano">
                                        4º Ano
                                    </MenuItem>

                                    <MenuItem value="5º Ano">
                                        5º Ano
                                    </MenuItem>

                                </TextField>

                            </Grid>


                            {/* TURMA */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    required

                                    label="Turma"

                                    name="letra"

                                    value={
                                        form.letra
                                    }

                                    onChange={
                                        handleChange
                                    }
                                >

                                    <MenuItem value="A">
                                        A
                                    </MenuItem>

                                    <MenuItem value="B">
                                        B
                                    </MenuItem>

                                    <MenuItem value="C">
                                        C
                                    </MenuItem>

                                </TextField>

                            </Grid>


                            {/* ANO */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required

                                    type="number"

                                    label="Ano letivo"

                                    name="ano"

                                    value={
                                        form.ano
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    inputProps={{
                                        min: 2000,
                                        max: 2100
                                    }}

                                />

                            </Grid>


                            {/* PROFESSOR */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth

                                    label="Professor responsável"

                                    name="professor"

                                    value={
                                        form.professor
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    placeholder="Opcional"

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
                                Salvar turma
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
                FILTRO GLOBAL
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
                        sx={{ mb: 2 }}
                    >
                        Filtro global
                    </Typography>


                    <TextField
                        fullWidth

                        label="Pesquisar"

                        placeholder={
                            'Pesquise por turma, série, ' +
                            'letra, ano ou professor'
                        }

                        value={
                            filtro
                        }

                        onChange={(event) => {

                            setFiltro(
                                event.target.value
                            );

                            setPagina(0);

                        }}

                    />


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                    >
                        {turmasFiltradas.length}
                        {' '}
                        turma(s) encontrada(s)
                    </Typography>

                </CardContent>

            </Card>


            {/* ==========================================
                TABELA
            ========================================== */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Turmas cadastradas
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
                                            ID
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Turma
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Série
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Letra
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Ano
                                        </strong>
                                    </TableCell>

                                    <TableCell>
                                        <strong>
                                            Professor
                                        </strong>
                                    </TableCell>

                                    <TableCell align="center">
                                        <strong>
                                            Alunos
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

                                {turmasDaPagina.map(
                                    (turma) => (

                                        <TableRow
                                            key={
                                                turma.id
                                            }
                                            hover
                                        >

                                            <TableCell>
                                                {
                                                    turma.id
                                                }
                                            </TableCell>


                                            <TableCell>
                                                <strong>
                                                    {
                                                        nomeDaTurma(
                                                            turma
                                                        )
                                                    }
                                                </strong>
                                            </TableCell>


                                            <TableCell>
                                                {
                                                    turma.serie
                                                }
                                            </TableCell>


                                            <TableCell>
                                                {
                                                    turma.letra
                                                }
                                            </TableCell>


                                            <TableCell>
                                                {
                                                    turma.ano
                                                }
                                            </TableCell>


                                            <TableCell>
                                                {
                                                    turma.professor ||
                                                    'Não informado'
                                                }
                                            </TableCell>


                                            <TableCell align="center">
                                                <strong>
                                                    {
                                                        quantidadeAlunos(
                                                            turma.id
                                                        )
                                                    }
                                                </strong>
                                            </TableCell>


                                            <TableCell>

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    justifyContent="center"
                                                >

                                                    <Button
                                                        size="small"
                                                        variant="outlined"

                                                        onClick={() =>
                                                            abrirEdicao(
                                                                turma
                                                            )
                                                        }
                                                    >
                                                        Editar
                                                    </Button>


                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"

                                                        onClick={() =>
                                                            abrirExclusao(
                                                                turma
                                                            )
                                                        }
                                                    >
                                                        Excluir
                                                    </Button>

                                                </Stack>

                                            </TableCell>

                                        </TableRow>

                                    )
                                )}


                                {turmasDaPagina.length === 0 && (

                                    <TableRow>

                                        <TableCell
                                            colSpan={8}
                                            align="center"
                                        >

                                            <Typography
                                                color="text.secondary"
                                                sx={{
                                                    py: 4
                                                }}
                                            >
                                                Nenhuma turma encontrada.
                                            </Typography>

                                        </TableCell>

                                    </TableRow>

                                )}

                            </TableBody>

                        </Table>


                        <TablePagination
                            component="div"

                            count={
                                turmasFiltradas.length
                            }

                            page={
                                pagina
                            }

                            onPageChange={
                                mudarPagina
                            }

                            rowsPerPage={
                                linhasPorPagina
                            }

                            onRowsPerPageChange={
                                mudarLinhasPorPagina
                            }

                            rowsPerPageOptions={[
                                5,
                                10,
                                25
                            ]}

                            labelRowsPerPage={
                                'Turmas por página'
                            }

                        />

                    </TableContainer>

                </CardContent>

            </Card>


            {/* ==========================================
                DIALOG EDITAR
            ========================================== */}

            <Dialog
                open={
                    Boolean(
                        turmaEditando
                    )
                }

                onClose={() =>
                    setTurmaEditando(null)
                }

                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>
                    Editar turma
                </DialogTitle>


                <DialogContent>

                    {turmaEditando && (

                        <Stack
                            spacing={2}
                            sx={{
                                mt: 1
                            }}
                        >

                            {/* SÉRIE */}

                            <TextField
                                select
                                fullWidth
                                required

                                label="Série"

                                name="serie"

                                value={
                                    turmaEditando.serie
                                }

                                onChange={
                                    alterarEdicao
                                }
                            >

                                <MenuItem value="1º Ano">
                                    1º Ano
                                </MenuItem>

                                <MenuItem value="2º Ano">
                                    2º Ano
                                </MenuItem>

                                <MenuItem value="3º Ano">
                                    3º Ano
                                </MenuItem>

                                <MenuItem value="4º Ano">
                                    4º Ano
                                </MenuItem>

                                <MenuItem value="5º Ano">
                                    5º Ano
                                </MenuItem>

                            </TextField>


                            {/* TURMA */}

                            <TextField
                                select
                                fullWidth
                                required

                                label="Turma"

                                name="letra"

                                value={
                                    turmaEditando.letra
                                }

                                onChange={
                                    alterarEdicao
                                }
                            >

                                <MenuItem value="A">
                                    A
                                </MenuItem>

                                <MenuItem value="B">
                                    B
                                </MenuItem>

                                <MenuItem value="C">
                                    C
                                </MenuItem>

                            </TextField>


                            {/* ANO */}

                            <TextField
                                fullWidth
                                required

                                type="number"

                                label="Ano letivo"

                                name="ano"

                                value={
                                    turmaEditando.ano
                                }

                                onChange={
                                    alterarEdicao
                                }

                            />


                            {/* PROFESSOR */}

                            <TextField
                                fullWidth

                                label="Professor responsável"

                                name="professor"

                                value={
                                    turmaEditando.professor
                                }

                                onChange={
                                    alterarEdicao
                                }

                            />

                        </Stack>

                    )}

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={() =>
                            setTurmaEditando(null)
                        }
                    >
                        Cancelar
                    </Button>


                    <Button
                        variant="contained"

                        onClick={
                            salvarEdicao
                        }
                    >
                        Salvar alterações
                    </Button>

                </DialogActions>

            </Dialog>


            {/* ==========================================
                DIALOG EXCLUIR
            ========================================== */}

            <Dialog
                open={
                    Boolean(
                        turmaExcluir
                    )
                }

                onClose={() =>
                    setTurmaExcluir(null)
                }
            >

                <DialogTitle>
                    Excluir turma
                </DialogTitle>


                <DialogContent>

                    <DialogContentText>

                        Tem certeza que deseja excluir a turma{' '}

                        <strong>

                            {
                                turmaExcluir
                                    ? nomeDaTurma(
                                        turmaExcluir
                                    )
                                    : ''
                            }

                        </strong>

                        ?

                    </DialogContentText>

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={() =>
                            setTurmaExcluir(null)
                        }
                    >
                        Cancelar
                    </Button>


                    <Button
                        color="error"
                        variant="contained"

                        onClick={
                            confirmarExclusao
                        }
                    >
                        Excluir
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>

    );

}


export default Turma;