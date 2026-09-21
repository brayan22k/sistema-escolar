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
// API
// ======================================================

const API_URL =
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000';

// ======================================================
// HEADERS COM TOKEN
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

    // ==================================================
    // ESTADOS
    // ==================================================

    const [form, setForm] =
        useState(formularioInicial);

    const [turmas, setTurmas] =
        useState([]);

    const [alunos, setAlunos] =
        useState([]);

    const [filtro, setFiltro] =
        useState('');

    const [mensagem, setMensagem] =
        useState('');

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

    const [carregando, setCarregando] =
        useState(false);

    const [salvando, setSalvando] =
        useState(false);

    const [excluindo, setExcluindo] =
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
    // CARREGAR TURMAS
    // ==================================================

    async function carregarTurmas() {

        try {

            setCarregando(true);

            const resposta = await fetch(
                `${API_URL}/turmas`,
                {
                    method: 'GET',
                    headers: headersComToken()
                }
            );

            if (!resposta.ok) {

                const erro =
                    await resposta.text();

                throw new Error(
                    erro ||
                    'Erro ao carregar turmas.'
                );
            }

            const dados =
                await resposta.json();

            setTurmas(
                Array.isArray(dados)
                    ? dados
                    : []
            );

        } catch (erro) {

            console.error(
                'Erro ao carregar turmas:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Erro ao carregar turmas.',
                'error'
            );

        } finally {

            setCarregando(false);

        }
    }

    // ==================================================
    // CARREGAR ALUNOS
    // ==================================================

    async function carregarAlunos() {

        try {

            const resposta = await fetch(
                `${API_URL}/alunos`,
                {
                    method: 'GET',
                    headers: headersComToken()
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
    // VALIDAR FORMULÁRIO
    // ==================================================

    function validarFormulario(dados) {

        if (!dados.serie) {

            mostrarMensagem(
                'Selecione a série.',
                'error'
            );

            return false;
        }

        if (!dados.letra) {

            mostrarMensagem(
                'Selecione a turma.',
                'error'
            );

            return false;
        }

        if (!dados.ano) {

            mostrarMensagem(
                'Informe o ano letivo.',
                'error'
            );

            return false;
        }

        const ano =
            Number(dados.ano);

        if (
            !Number.isInteger(ano) ||
            ano < 2000 ||
            ano > 2100
        ) {

            mostrarMensagem(
                'Informe um ano letivo válido entre 2000 e 2100.',
                'error'
            );

            return false;
        }

        return true;
    }

    // ==================================================
    // CADASTRAR TURMA
    // ==================================================

    async function cadastrarTurma(event) {

        event.preventDefault();

        if (!validarFormulario(form)) {
            return;
        }

        const nome =
            `${form.serie} ${form.letra}`;

        try {

            setSalvando(true);

            const resposta = await fetch(
                `${API_URL}/turmas`,
                {
                    method: 'POST',

                    headers:
                        headersComToken(),

                    body: JSON.stringify({
                        nome,

                        serie:
                            form.serie,

                        letra:
                            form.letra,

                        ano:
                            Number(form.ano),

                        professor:
                            form.professor.trim() ||
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

            console.error(
                'Erro ao cadastrar turma:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Erro ao salvar turma.',
                'error'
            );

        } finally {

            setSalvando(false);

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
    // QUANTIDADE DE ALUNOS
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

    const inicio =
        pagina * linhasPorPagina;

    const fim =
        inicio + linhasPorPagina;

    const turmasDaPagina =
        turmasFiltradas.slice(
            inicio,
            fim
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

            nome:
                turma.nome || '',

            serie:
                turma.serie || '',

            letra:
                turma.letra || '',

            ano:
                turma.ano || '',

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

        if (
            !validarFormulario(
                turmaEditando
            )
        ) {
            return;
        }

        const nome =
            `${turmaEditando.serie} ${turmaEditando.letra}`;

        try {

            setSalvando(true);

            const resposta =
                await fetch(
                    `${API_URL}/turmas/${turmaEditando.id}`,
                    {
                        method: 'PUT',

                        headers:
                            headersComToken(),

                        body: JSON.stringify({

                            nome,

                            serie:
                                turmaEditando.serie,

                            letra:
                                turmaEditando.letra,

                            ano:
                                Number(
                                    turmaEditando.ano
                                ),

                            professor:
                                turmaEditando.professor
                                    ?.trim() || null
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

            console.error(
                'Erro ao editar turma:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Erro ao editar turma.',
                'error'
            );

        } finally {

            setSalvando(false);

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

            setExcluindo(true);

            const resposta =
                await fetch(
                    `${API_URL}/turmas/${turmaExcluir.id}`,
                    {
                        method: 'DELETE',
                        headers:
                            headersComToken()
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

            console.error(
                'Erro ao excluir turma:',
                erro
            );

            mostrarMensagem(
                erro.message ||
                'Erro ao excluir turma.',
                'error'
            );

        } finally {

            setExcluindo(false);

        }
    }

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

            <Card sx={{ mb: 4 }}>

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

                                    <MenuItem value="D">
                                        D
                                    </MenuItem>

                                    <MenuItem value="E">
                                        E
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
                                disabled={salvando}
                            >
                                {salvando
                                    ? 'Salvando...'
                                    : 'Salvar turma'}
                            </Button>

                            <Button
                                type="button"
                                variant="outlined"

                                disabled={salvando}

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
                FILTRO
            ========================================== */}

            <Card sx={{ mb: 4 }}>

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
                            'Pesquise por turma, série, letra, ano ou professor'
                        }

                        value={filtro}

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

                                {carregando ? (

                                    <TableRow>

                                        <TableCell
                                            colSpan={8}
                                            align="center"
                                        >
                                            <Typography
                                                sx={{
                                                    py: 4
                                                }}
                                            >
                                                Carregando turmas...
                                            </Typography>
                                        </TableCell>

                                    </TableRow>

                                ) : (

                                    turmasDaPagina.map(
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
                                    )

                                )}

                                {!carregando &&
                                    turmasDaPagina.length === 0 && (

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
                    !salvando &&
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

                                <MenuItem value="D">
                                    D
                                </MenuItem>

                                <MenuItem value="E">
                                    E
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

                                inputProps={{
                                    min: 2000,
                                    max: 2100
                                }}

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

                        disabled={salvando}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"

                        onClick={
                            salvarEdicao
                        }

                        disabled={salvando}
                    >
                        {salvando
                            ? 'Salvando...'
                            : 'Salvar alterações'}
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
                    !excluindo &&
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

                        disabled={excluindo}
                    >
                        Cancelar
                    </Button>

                    <Button
                        color="error"
                        variant="contained"

                        onClick={
                            confirmarExclusao
                        }

                        disabled={excluindo}
                    >
                        {excluindo
                            ? 'Excluindo...'
                            : 'Excluir'}
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
}

export default Turma;