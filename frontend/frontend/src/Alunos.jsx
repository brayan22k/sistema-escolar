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
    Paper,
    MenuItem
} from '@mui/material';


function Alunos() {

    const [alunos, setAlunos] = useState([]);
    const [turmas, setTurmas] = useState([]);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [fkTurma, setFkTurma] = useState('');

    const [mensagem, setMensagem] = useState('');

    const [editandoId, setEditandoId] = useState(null);


    // ==========================================
    // CARREGAR ALUNOS
    // ==========================================

    async function carregarAlunos() {

        try {

            const resposta = await fetch(
                'http://localhost:3000/alunos'
            );

            if (!resposta.ok) {
                throw new Error(
                    'Erro ao buscar alunos'
                );
            }

            const dados = await resposta.json();

            setAlunos(dados);

        } catch (erro) {

            console.error(erro);

            setMensagem(
                'Não foi possível carregar os alunos.'
            );

        }

    }


    // ==========================================
    // CARREGAR TURMAS
    // ==========================================

    async function carregarTurmas() {

        try {

            const resposta = await fetch(
                'http://localhost:3000/turmas'
            );

            if (!resposta.ok) {
                throw new Error(
                    'Erro ao buscar turmas'
                );
            }

            const dados = await resposta.json();

            setTurmas(dados);

        } catch (erro) {

            console.error(erro);

            setMensagem(
                'Não foi possível carregar as turmas.'
            );

        }

    }


    // ==========================================
    // CARREGAR DADOS
    // ==========================================

    useEffect(() => {

        carregarAlunos();
        carregarTurmas();

    }, []);


    // ==========================================
    // LIMPAR FORMULÁRIO
    // ==========================================

    function limparFormulario() {

        setNome('');
        setEmail('');
        setDataNascimento('');
        setFkTurma('');
        setEditandoId(null);

    }


    // ==========================================
    // VALIDAR DATA
    // ==========================================

    function validarDataNascimento(data) {

        if (!data) {
            return false;
        }

        const dataInformada = new Date(
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

        return ano > 2000 && ano < 2028;

    }


    // ==========================================
    // FORMATAR DATA
    // ==========================================

    function formatarData(data) {

        if (!data) {
            return '';
        }

        const valor =
            String(data).substring(0, 10);

        const partes =
            valor.split('-');

        if (partes.length !== 3) {
            return data;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    // ==========================================
    // NOME DA TURMA
    // ==========================================

    function nomeDaTurma(aluno) {

        if (!aluno.fk_turma) {
            return 'Sem turma';
        }

        const turma =
            turmas.find(
                (item) =>
                    Number(item.id) ===
                    Number(aluno.fk_turma)
            );

        if (!turma) {
            return `Turma ${aluno.fk_turma}`;
        }

        return (
            turma.nome ||
            turma.descricao ||
            turma.turma ||
            `Turma ${turma.id}`
        );

    }


    // ==========================================
    // SALVAR ALUNO
    // ==========================================

    async function salvarAluno(event) {

        event.preventDefault();

        setMensagem('');


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


        try {

            const dadosAluno = {

                nome: nome.trim(),

                email: email.trim(),

                data_nascimento:
                    dataNascimento,

                fk_turma:
                    fkTurma
                        ? Number(fkTurma)
                        : null

            };


            console.log(
                'Dados enviados:',
                dadosAluno
            );


            let resposta;


            // ==================================
            // EDITAR
            // ==================================

            if (editandoId) {

                resposta = await fetch(
                    `http://localhost:3000/alunos/${editandoId}`,
                    {
                        method: 'PUT',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify(
                            dadosAluno
                        )
                    }
                );

            }


            // ==================================
            // CADASTRAR
            // ==================================

            else {

                resposta = await fetch(
                    'http://localhost:3000/alunos',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify(
                            dadosAluno
                        )
                    }
                );

            }


            // ==================================
            // LER RESPOSTA
            // ==================================

            const textoResposta =
                await resposta.text();

            console.log(
                'Resposta do servidor:',
                textoResposta
            );


            if (!resposta.ok) {

                throw new Error(
                    textoResposta ||
                    `Erro HTTP ${resposta.status}`
                );

            }


            // ==================================
            // SUCESSO
            // ==================================

            setMensagem(
                editandoId
                    ? 'Aluno atualizado com sucesso!'
                    : 'Aluno cadastrado com sucesso!'
            );


            limparFormulario();

            carregarAlunos();


        } catch (erro) {

            console.error(
                'ERRO COMPLETO AO SALVAR ALUNO:',
                erro
            );


            setMensagem(
                erro.message ||
                'Erro ao salvar o aluno.'
            );

        }

    }


    // ==========================================
    // EDITAR ALUNO
    // ==========================================

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

        setFkTurma(
            aluno.fk_turma
                ? String(aluno.fk_turma)
                : ''
        );

        setEditandoId(
            aluno.id
        );

        setMensagem('');

    }


    // ==========================================
    // EXCLUIR ALUNO
    // ==========================================

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
                    `http://localhost:3000/alunos/${id}`,
                    {
                        method: 'DELETE'
                    }
                );


            const textoResposta =
                await resposta.text();


            if (!resposta.ok) {

                throw new Error(
                    textoResposta ||
                    'Erro ao excluir aluno'
                );

            }


            setMensagem(
                'Aluno excluído com sucesso!'
            );


            carregarAlunos();


        } catch (erro) {

            console.error(erro);

            setMensagem(
                erro.message ||
                'Erro ao excluir o aluno.'
            );

        }

    }


    return (

        <Box>

            {/* =====================================
                TÍTULO
            ====================================== */}

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
                Cadastre, edite e consulte os alunos
                da escola.
            </Typography>


            {/* =====================================
                MENSAGEM
            ====================================== */}

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
                        mb: 3,
                        whiteSpace: 'pre-wrap'
                    }}
                >
                    {mensagem}
                </Alert>

            )}


            {/* =====================================
                FORMULÁRIO
            ====================================== */}

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
                                md={4}
                            >

                                <TextField
                                    fullWidth
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


                            {/* DATA */}

                            <Grid
                                item
                                xs={12}
                                md={2}
                            >

                                <TextField
                                    fullWidth
                                    label="Data de nascimento"
                                    type="date"
                                    value={dataNascimento}
                                    onChange={(event) =>
                                        setDataNascimento(
                                            event.target.value
                                        )
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    inputProps={{
                                        min: '2001-01-01',
                                        max: '2027-12-31'
                                    }}
                                />

                            </Grid>


                            {/* TURMA */}

                            <Grid
                                item
                                xs={12}
                                md={2}
                            >

                                <TextField
                                    select
                                    fullWidth
                                    label="Turma"
                                    value={fkTurma}
                                    onChange={(event) =>
                                        setFkTurma(
                                            event.target.value
                                        )
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
                                                    turma.descricao ||
                                                    turma.turma ||
                                                    `Turma ${turma.id}`}
                                            </MenuItem>

                                        )
                                    )}

                                </TextField>

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


            {/* =====================================
                LISTA
            ====================================== */}

            <Typography
                variant="h5"
                gutterBottom
            >
                Alunos Cadastrados
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
                                <strong>
                                    Data de Nascimento
                                </strong>
                            </TableCell>

                            <TableCell>
                                <strong>
                                    Turma
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

                        {alunos.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={6}
                                    align="center"
                                >
                                    Nenhum aluno cadastrado.
                                </TableCell>

                            </TableRow>

                        ) : (

                            alunos.map(
                                (aluno) => (

                                    <TableRow
                                        key={
                                            aluno.id
                                        }
                                    >

                                        <TableCell>
                                            {aluno.id}
                                        </TableCell>

                                        <TableCell>
                                            {aluno.nome}
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
                                            {nomeDaTurma(
                                                aluno
                                            )}
                                        </TableCell>

                                        <TableCell>

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    mr: 1
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