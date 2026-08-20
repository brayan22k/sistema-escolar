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


function Professores() {

    const [professores, setProfessores] = useState([]);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [disciplina, setDisciplina] = useState('');

    const [mensagem, setMensagem] = useState('');

    const [editandoId, setEditandoId] = useState(null);


    // ==========================================
    // CARREGAR PROFESSORES
    // ==========================================

    async function carregarProfessores() {

        try {

            const resposta = await fetch(
                'http://localhost:3000/professores'
            );

            if (!resposta.ok) {
                throw new Error(
                    'Erro ao buscar professores'
                );
            }

            const dados = await resposta.json();

            setProfessores(dados);

        } catch (erro) {

            console.error(erro);

            setMensagem(
                'Não foi possível carregar os professores.'
            );

        }

    }


    useEffect(() => {

        carregarProfessores();

    }, []);


    // ==========================================
    // LIMPAR FORMULÁRIO
    // ==========================================

    function limparFormulario() {

        setNome('');
        setEmail('');
        setDisciplina('');

        setEditandoId(null);

    }


    // ==========================================
    // SALVAR PROFESSOR
    // ==========================================

    async function salvarProfessor(event) {

        event.preventDefault();

        setMensagem('');


        if (!nome.trim()) {

            setMensagem(
                'Digite o nome do professor.'
            );

            return;

        }


        if (!email.trim()) {

            setMensagem(
                'Digite o e-mail do professor.'
            );

            return;

        }


        if (!disciplina.trim()) {

            setMensagem(
                'Digite a disciplina do professor.'
            );

            return;

        }


        try {

            const dadosProfessor = {

                nome: nome,

                email: email,

                disciplina: disciplina

            };


            let resposta;


            // ==================================
            // EDITAR
            // ==================================

            if (editandoId) {

                resposta = await fetch(
                    `http://localhost:3000/professores/${editandoId}`,
                    {
                        method: 'PUT',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify(
                            dadosProfessor
                        )
                    }
                );

            }


            // ==================================
            // CADASTRAR
            // ==================================

            else {

                resposta = await fetch(
                    'http://localhost:3000/professores',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify(
                            dadosProfessor
                        )
                    }
                );

            }


            if (!resposta.ok) {

                throw new Error(
                    'Erro ao salvar professor'
                );

            }


            setMensagem(
                editandoId
                    ? 'Professor atualizado com sucesso!'
                    : 'Professor cadastrado com sucesso!'
            );


            limparFormulario();

            carregarProfessores();


        } catch (erro) {

            console.error(erro);

            setMensagem(
                'Erro ao salvar o professor.'
            );

        }

    }


    // ==========================================
    // EDITAR
    // ==========================================

    function editarProfessor(professor) {

        setNome(professor.nome || '');

        setEmail(professor.email || '');

        setDisciplina(
            professor.disciplina || ''
        );

        setEditandoId(professor.id);

        setMensagem('');

    }


    // ==========================================
    // EXCLUIR
    // ==========================================

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
                `http://localhost:3000/professores/${id}`,
                {
                    method: 'DELETE'
                }
            );


            if (!resposta.ok) {

                throw new Error(
                    'Erro ao excluir professor'
                );

            }


            setMensagem(
                'Professor excluído com sucesso!'
            );


            carregarProfessores();


        } catch (erro) {

            console.error(erro);

            setMensagem(
                'Erro ao excluir o professor.'
            );

        }

    }


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


            {/* MENSAGEM */}

            {mensagem && (

                <Alert
                    severity={
                        mensagem.includes('sucesso')
                            ? 'success'
                            : 'error'
                    }
                    sx={{
                        mb: 3
                    }}
                >
                    {mensagem}
                </Alert>

            )}


            {/* FORMULÁRIO */}

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


            {/* LISTA */}

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

                            professores.map((professor) => (

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

                            ))

                        )}

                    </TableBody>

                </Table>

            </TableContainer>

        </Box>

    );

}


export default Professores;