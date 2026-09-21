import { useEffect, useMemo, useState } from 'react';

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
    Paper,
    InputAdornment,
    MenuItem
} from '@mui/material';


// ======================================================
// CONFIGURAÇÃO
// ======================================================

const API_URL =
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000';


// ======================================================
// HEADERS
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

function Alunos() {

    // ==================================================
    // ALUNOS
    // ==================================================

    const [alunos, setAlunos] =
        useState([]);


    // ==================================================
    // TURMAS
    // ==================================================

    const [turmas, setTurmas] =
        useState([]);


    // ==================================================
    // FORMULÁRIO
    // ==================================================

    const [nome, setNome] =
        useState('');

    const [email, setEmail] =
        useState('');

    const [dataNascimento, setDataNascimento] =
        useState('');

    const [serie, setSerie] =
        useState('');

    const [cpf, setCpf] =
        useState('');

    const [telefone, setTelefone] =
        useState('');

    const [endereco, setEndereco] =
        useState('');

    const [fkTurma, setFkTurma] =
        useState('');


    // ==================================================
    // CONTROLE
    // ==================================================

    const [mensagem, setMensagem] =
        useState('');

    const [editandoId, setEditandoId] =
        useState(null);

    const [busca, setBusca] =
        useState('');

    const [carregando, setCarregando] =
        useState(false);

    const [carregandoTurmas, setCarregandoTurmas] =
        useState(false);


    // ==================================================
    // CARREGAR ALUNOS
    // ==================================================

    async function carregarAlunos() {

        try {

            setCarregando(true);

            const resposta =
                await fetch(
                    `${API_URL}/alunos`,
                    {
                        headers:
                            headersComToken()
                    }
                );


            if (!resposta.ok) {

                throw new Error(
                    'Erro ao buscar alunos.'
                );

            }


            const dados =
                await resposta.json();


            setAlunos(dados);


        } catch (erro) {

            console.error(erro);

            setMensagem(
                'Não foi possível carregar os alunos.'
            );


        } finally {

            setCarregando(false);

        }

    }


    // ==================================================
    // CARREGAR TURMAS
    // ==================================================

    async function carregarTurmas() {

        try {

            setCarregandoTurmas(true);

            const resposta =
                await fetch(
                    `${API_URL}/turmas`,
                    {
                        headers:
                            headersComToken()
                    }
                );


            if (!resposta.ok) {

                throw new Error(
                    'Erro ao buscar turmas.'
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

            console.error(erro);

            setMensagem(
                'Não foi possível carregar as turmas.'
            );


        } finally {

            setCarregandoTurmas(false);

        }

    }


    // ==================================================
    // INICIALIZAÇÃO
    // ==================================================

    useEffect(() => {

        carregarAlunos();

        carregarTurmas();

    }, []);


    // ==================================================
    // FILTRAR ALUNOS
    // ==================================================

    const alunosFiltrados =
        useMemo(() => {

            const termo =
                busca
                    .trim()
                    .toLowerCase();


            if (!termo) {

                return alunos;

            }


            return alunos.filter((aluno) => {

                const id =
                    String(
                        aluno.id ?? ''
                    );


                const nomeAluno =
                    String(
                        aluno.nome ?? ''
                    )
                        .toLowerCase();


                const emailAluno =
                    String(
                        aluno.email ?? ''
                    )
                        .toLowerCase();


                const cpfAluno =
                    String(
                        aluno.cpf ?? ''
                    )
                        .toLowerCase();


                return (
                    id.includes(termo) ||
                    nomeAluno.includes(termo) ||
                    emailAluno.includes(termo) ||
                    cpfAluno.includes(termo)
                );

            });

        }, [alunos, busca]);


    // ==================================================
    // LIMPAR FORMULÁRIO
    // ==================================================

    function limparFormulario() {

        setNome('');

        setEmail('');

        setDataNascimento('');

        setSerie('');

        setCpf('');

        setTelefone('');

        setEndereco('');

        setFkTurma('');

        setEditandoId(null);

    }


    // ==================================================
    // VALIDAR DATA DE NASCIMENTO
    // ==================================================

    function validarDataNascimento(data) {

        if (!data) {

            return false;

        }


        const dataInformada =
            new Date(
                `${data}T00:00:00`
            );


        if (
            Number.isNaN(
                dataInformada.getTime()
            )
        ) {

            return false;

        }


        const ano =
            dataInformada.getFullYear();


        return (
            ano > 2000 &&
            ano < 2028
        );

    }


    // ==================================================
    // FORMATAR DATA
    // ==================================================

    function formatarData(data) {

        if (!data) {

            return '';

        }


        const valor =
            String(data)
                .substring(0, 10);


        const partes =
            valor.split('-');


        if (
            partes.length !== 3
        ) {

            return data;

        }


        return (
            `${partes[2]}/` +
            `${partes[1]}/` +
            `${partes[0]}`
        );

    }


    // ==================================================
    // FORMATAR CPF
    // ==================================================

    function formatarCpf(valor) {

        const somenteNumeros =
            valor
                .replace(/\D/g, '')
                .substring(0, 11);


        if (
            somenteNumeros.length <= 3
        ) {

            return somenteNumeros;

        }


        if (
            somenteNumeros.length <= 6
        ) {

            return (
                `${somenteNumeros.slice(0, 3)}.` +
                `${somenteNumeros.slice(3)}`
            );

        }


        if (
            somenteNumeros.length <= 9
        ) {

            return (
                `${somenteNumeros.slice(0, 3)}.` +
                `${somenteNumeros.slice(3, 6)}.` +
                `${somenteNumeros.slice(6)}`
            );

        }


        return (
            `${somenteNumeros.slice(0, 3)}.` +
            `${somenteNumeros.slice(3, 6)}.` +
            `${somenteNumeros.slice(6, 9)}-` +
            `${somenteNumeros.slice(9)}`
        );

    }


    // ==================================================
    // FORMATAR TELEFONE
    // ==================================================

    function formatarTelefone(valor) {

        const somenteNumeros =
            valor
                .replace(/\D/g, '')
                .substring(0, 11);


        if (
            somenteNumeros.length <= 2
        ) {

            return somenteNumeros;

        }


        if (
            somenteNumeros.length <= 7
        ) {

            return (
                `(${somenteNumeros.slice(0, 2)}) ` +
                `${somenteNumeros.slice(2)}`
            );

        }


        return (
            `(${somenteNumeros.slice(0, 2)}) ` +
            `${somenteNumeros.slice(2, 7)}-` +
            `${somenteNumeros.slice(7)}`
        );

    }


    // ==================================================
    // CADASTRAR / EDITAR
    // ==================================================

    async function salvarAluno(event) {

        event.preventDefault();

        setMensagem('');


        // ==============================================
        // VALIDAÇÕES
        // ==============================================

        if (!nome.trim()) {

            setMensagem(
                'Digite o nome do aluno.'
            );

            return;

        }


        if (!email.trim()) {

            setMensagem(
                'Digite o e-mail do aluno.'
            );

            return;

        }


        if (!dataNascimento) {

            setMensagem(
                'Informe a data de nascimento do aluno.'
            );

            return;

        }


        if (
            !validarDataNascimento(
                dataNascimento
            )
        ) {

            setMensagem(
                'A data de nascimento deve ter ano entre 2001 e 2027.'
            );

            return;

        }


        if (!serie.trim()) {

            setMensagem(
                'Informe a série do aluno.'
            );

            return;

        }


        try {

            const dadosAluno = {

                nome:
                    nome.trim(),

                email:
                    email.trim(),

                data_nascimento:
                    dataNascimento,

                serie:
                    serie.trim(),

                cpf:
                    cpf.trim() || null,

                telefone:
                    telefone.trim() || null,

                endereco:
                    endereco.trim() || null,

                fk_turma:
                    fkTurma
                        ? Number(fkTurma)
                        : null

            };


            let resposta;


            // ==========================================
            // EDITAR
            // ==========================================

            if (editandoId) {

                resposta =
                    await fetch(
                        `${API_URL}/alunos/${editandoId}`,
                        {
                            method: 'PUT',

                            headers:
                                headersComToken(),

                            body:
                                JSON.stringify(
                                    dadosAluno
                                )
                        }
                    );

            }


            // ==========================================
            // CADASTRAR
            // ==========================================

            else {

                resposta =
                    await fetch(
                        `${API_URL}/alunos`,
                        {
                            method: 'POST',

                            headers:
                                headersComToken(),

                            body:
                                JSON.stringify(
                                    dadosAluno
                                )
                        }
                    );

            }


            // ==========================================
            // TRATAMENTO DE ERRO
            // ==========================================

            if (!resposta.ok) {

                let detalhe =
                    'Erro ao salvar aluno.';


                try {

                    const texto =
                        await resposta.text();


                    if (texto) {

                        detalhe =
                            texto;

                    }

                } catch {

                    // Mantém mensagem padrão.

                }


                throw new Error(
                    detalhe
                );

            }


            // ==========================================
            // SUCESSO
            // ==========================================

            setMensagem(
                editandoId
                    ? 'Aluno atualizado com sucesso!'
                    : 'Aluno cadastrado com sucesso!'
            );


            limparFormulario();


            await carregarAlunos();


        } catch (erro) {

            console.error(erro);


            setMensagem(
                erro.message ||
                'Erro ao salvar o aluno.'
            );

        }

    }


    // ==================================================
    // EDITAR
    // ==================================================

    function editarAluno(aluno) {

        setNome(
            aluno.nome || ''
        );


        setEmail(
            aluno.email || ''
        );


        setDataNascimento(
            aluno.data_nascimento
                ? String(
                    aluno.data_nascimento
                ).substring(0, 10)
                : ''
        );


        setSerie(
            aluno.serie || ''
        );


        setCpf(
            aluno.cpf || ''
        );


        setTelefone(
            aluno.telefone || ''
        );


        setEndereco(
            aluno.endereco || ''
        );


        setFkTurma(
            aluno.fk_turma
                ? String(aluno.fk_turma)
                : ''
        );


        setEditandoId(
            aluno.id
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

    async function excluirAluno(id) {

        const confirmar =
            window.confirm(
                'Deseja realmente excluir este aluno?'
            );


        if (!confirmar) {

            return;

        }


        try {

            const resposta =
                await fetch(
                    `${API_URL}/alunos/${id}`,
                    {
                        method: 'DELETE',

                        headers:
                            headersComToken()
                    }
                );


            if (!resposta.ok) {

                let detalhe =
                    'Erro ao excluir aluno.';


                try {

                    const texto =
                        await resposta.text();


                    if (texto) {

                        detalhe =
                            texto;

                    }

                } catch {

                    // Mantém mensagem padrão.

                }


                throw new Error(
                    detalhe
                );

            }


            setMensagem(
                'Aluno excluído com sucesso!'
            );


            if (
                editandoId === id
            ) {

                limparFormulario();

            }


            await carregarAlunos();


        } catch (erro) {

            console.error(erro);


            setMensagem(
                erro.message ||
                'Erro ao excluir o aluno.'
            );

        }

    }


    // ==================================================
    // LIMPAR PESQUISA
    // ==================================================

    function limparBusca() {

        setBusca('');

    }


    // ==================================================
    // ENCONTRAR NOME DA TURMA
    // ==================================================

    function nomeDaTurma(idTurma) {

        if (!idTurma) {

            return 'Sem turma';

        }


        const turma =
            turmas.find(
                (item) =>
                    Number(item.id) ===
                    Number(idTurma)
            );


        if (!turma) {

            return `Turma #${idTurma}`;

        }


        return (
            turma.nome ||
            `${turma.serie} ${turma.letra}`
        );

    }


    // ==================================================
    // INTERFACE
    // ==================================================

    return (

        <Box>

            {/* ==========================================
                CABEÇALHO
            ========================================== */}

            <Typography
                variant="h4"
                gutterBottom
            >
                Cadastro de Alunos
            </Typography>


            <Typography
                color="text.secondary"
                sx={{
                    mb: 3
                }}
            >
                Cadastre, edite, pesquise e consulte
                os alunos da escola.
            </Typography>


            {/* ==========================================
                MENSAGEM
            ========================================== */}

            {mensagem && (

                <Alert
                    severity={
                        mensagem.includes(
                            'sucesso'
                        )
                            ? 'success'
                            : 'error'
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
                        sx={{
                            mb: 2
                        }}
                    >
                        {editandoId
                            ? 'Editar Aluno'
                            : 'Cadastrar Aluno'}
                    </Typography>


                    <Box
                        component="form"
                        onSubmit={salvarAluno}
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* NOME */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Nome do aluno"
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
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
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


                            {/* DATA DE NASCIMENTO */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Data de nascimento"
                                    type="date"
                                    value={
                                        dataNascimento
                                    }
                                    onChange={(event) =>
                                        setDataNascimento(
                                            event.target.value
                                        )
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    inputProps={{
                                        min:
                                            '2001-01-01',
                                        max:
                                            '2027-12-31'
                                    }}
                                />

                            </Grid>


                            {/* SÉRIE */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Série"
                                    placeholder="Ex.: 3º Ano"
                                    value={serie}
                                    onChange={(event) =>
                                        setSerie(
                                            event.target.value
                                        )
                                    }
                                />

                            </Grid>


                            {/* TURMA */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >

                                <TextField
                                    fullWidth
                                    select
                                    label="Turma"
                                    value={fkTurma}
                                    onChange={(event) =>
                                        setFkTurma(
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        carregandoTurmas
                                    }
                                    helperText={
                                        carregandoTurmas
                                            ? 'Carregando turmas...'
                                            : turmas.length === 0
                                                ? 'Nenhuma turma cadastrada.'
                                                : 'Opcional'
                                    }
                                >

                                    <MenuItem value="">
                                        Sem turma
                                    </MenuItem>


                                    {turmas.map(
                                        (turma) => (

                                            <MenuItem
                                                key={
                                                    turma.id
                                                }
                                                value={
                                                    turma.id
                                                }
                                            >
                                                {turma.nome ||
                                                    `${turma.serie} ${turma.letra}`}
                                                {turma.ano
                                                    ? ` - ${turma.ano}`
                                                    : ''}
                                            </MenuItem>

                                        )
                                    )}

                                </TextField>

                            </Grid>


                            {/* CPF */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >

                                <TextField
                                    fullWidth
                                    label="CPF"
                                    placeholder="000.000.000-00"
                                    value={cpf}
                                    onChange={(event) =>
                                        setCpf(
                                            formatarCpf(
                                                event.target.value
                                            )
                                        )
                                    }
                                    inputProps={{
                                        inputMode:
                                            'numeric',
                                        maxLength:
                                            14
                                    }}
                                />

                            </Grid>


                            {/* TELEFONE */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Telefone"
                                    placeholder="(00) 00000-0000"
                                    value={telefone}
                                    onChange={(event) =>
                                        setTelefone(
                                            formatarTelefone(
                                                event.target.value
                                            )
                                        )
                                    }
                                    inputProps={{
                                        inputMode:
                                            'numeric',
                                        maxLength:
                                            15
                                    }}
                                />

                            </Grid>


                            {/* ENDEREÇO */}

                            <Grid
                                item
                                xs={12}
                                md={8}
                            >

                                <TextField
                                    fullWidth
                                    label="Endereço"
                                    placeholder="Rua, número, bairro..."
                                    value={endereco}
                                    onChange={(event) =>
                                        setEndereco(
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
                                        ? 'Atualizar Aluno'
                                        : 'Salvar Aluno'}
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


            {/* ==========================================
                LISTA
            ========================================== */}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent:
                        'space-between',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    flexWrap: 'wrap'
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        gutterBottom
                    >
                        Alunos Cadastrados
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {alunosFiltrados.length}
                        {' '}
                        {alunosFiltrados.length === 1
                            ? 'aluno encontrado'
                            : 'alunos encontrados'}
                    </Typography>

                </Box>


                {/* ======================================
                    PESQUISA
                ====================================== */}

                <TextField
                    size="small"
                    label="Pesquisar aluno"
                    placeholder="Nome, e-mail, CPF ou ID"
                    value={busca}
                    onChange={(event) =>
                        setBusca(
                            event.target.value
                        )
                    }
                    sx={{
                        minWidth: {
                            xs: '100%',
                            sm: 300
                        }
                    }}
                    InputProps={{
                        startAdornment: (

                            <InputAdornment
                                position="start"
                            >
                                🔎
                            </InputAdornment>

                        ),

                        endAdornment:
                            busca && (

                                <Button
                                    size="small"
                                    onClick={
                                        limparBusca
                                    }
                                >
                                    Limpar
                                </Button>

                            )
                    }}
                />

            </Box>


            {/* ==========================================
                TABELA
            ========================================== */}

            <TableContainer
                component={Paper}
                sx={{
                    overflowX: 'auto'
                }}
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
                                    Data de Nascimento
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Série
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Turma
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    CPF
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Telefone
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Ações
                                </strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {/* CARREGANDO */}

                        {carregando ? (

                            <TableRow>

                                <TableCell
                                    colSpan={9}
                                    align="center"
                                >
                                    Carregando alunos...
                                </TableCell>

                            </TableRow>

                        )


                        /* NENHUM ALUNO */

                        : alunos.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={9}
                                    align="center"
                                >
                                    Nenhum aluno cadastrado.
                                </TableCell>

                            </TableRow>

                        )


                        /* PESQUISA SEM RESULTADO */

                        : alunosFiltrados.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={9}
                                    align="center"
                                >

                                    Nenhum aluno encontrado
                                    para:

                                    <strong
                                        style={{
                                            marginLeft: 5
                                        }}
                                    >
                                        "{busca}"
                                    </strong>


                                    <Box
                                        sx={{
                                            mt: 1
                                        }}
                                    >

                                        <Button
                                            size="small"
                                            onClick={
                                                limparBusca
                                            }
                                        >
                                            Limpar pesquisa
                                        </Button>

                                    </Box>

                                </TableCell>

                            </TableRow>

                        )


                        /* ALUNOS */

                        : (

                            alunosFiltrados.map(
                                (aluno) => (

                                    <TableRow
                                        key={aluno.id}
                                        hover
                                    >

                                        <TableCell>
                                            {aluno.id}
                                        </TableCell>


                                        <TableCell>
                                            <strong>
                                                {aluno.nome}
                                            </strong>
                                        </TableCell>


                                        <TableCell>
                                            {aluno.email}
                                        </TableCell>


                                        <TableCell>
                                            {formatarData(
                                                aluno.data_nascimento
                                            )}
                                        </TableCell>


                                        <TableCell>
                                            {aluno.serie ||
                                                '-'}
                                        </TableCell>


                                        <TableCell>
                                            {nomeDaTurma(
                                                aluno.fk_turma
                                            )}
                                        </TableCell>


                                        <TableCell>
                                            {aluno.cpf ||
                                                '-'}
                                        </TableCell>


                                        <TableCell>
                                            {aluno.telefone ||
                                                '-'}
                                        </TableCell>


                                        <TableCell>

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    mr: 1,
                                                    mb: {
                                                        xs: 1,
                                                        sm: 0
                                                    }
                                                }}
                                                onClick={() =>
                                                    editarAluno(
                                                        aluno
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
                                                    excluirAluno(
                                                        aluno.id
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


export default Alunos;