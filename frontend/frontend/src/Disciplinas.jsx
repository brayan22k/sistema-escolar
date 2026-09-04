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


function Disciplinas() {

    const [disciplinas, setDisciplinas] = useState([]);

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');

    const [mensagem, setMensagem] = useState('');

    const [editandoId, setEditandoId] = useState(null);


    // ==========================================
    // CARREGAR DISCIPLINAS
    // ==========================================

    async function carregarDisciplinas() {

        try {

            const resposta = await fetch(
                'http://localhost:3000/disciplinas'
            );

            if (!resposta.ok) {
                throw new Error(
                    'Erro ao buscar disciplinas'
                );
            }

            const dados = await resposta.json();

            setDisciplinas(dados);

        } catch (erro) {

            console.error(erro);

            setMensagem(
                'Não foi possível carregar as disciplinas.'
            );

        }

    }


    useEffect(() => {

        carregarDisciplinas();

    }, []);


    // ==========================================
    // LIMPAR FORMULÁRIO
    // ==========================================

    function limparFormulario() {

        setNome('');
        setDescricao('');
        setEditandoId(null);

    }


    // ==========================================
    // SALVAR DISCIPLINA
    // ==========================================

    async function salvarDisciplina(event) {

        event.preventDefault();

        setMensagem('');


        if (!nome.trim()) {

            setMensagem(
                'Digite o nome da disciplina.'
            );

            return;

        }


        try {

            const dados = {
                nome: nome.trim(),
                descricao: descricao.trim()
            };


            let resposta;


            // ==================================
            // EDITAR
            // ==================================

            if (editandoId !== null) {

                resposta = await fetch(
                    `http://localhost:3000/disciplinas/${editandoId}`,
                    {
                        method: 'PUT',

                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify(dados)
                    }
                );

            }


            // ==================================
            // CADASTRAR
            // ==================================

            else {

                resposta = await fetch(
                    'http://localhost:3000/disciplinas',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json'
                        },

                        body: JSON.stringify(dados)
                    }
                );

            }


            if (!resposta.ok) {

                const erro = await resposta.text();

                throw new Error(
                    erro || 'Erro ao salvar disciplina'
                );

            }


            setMensagem(
                editandoId !== null
                    ? 'Disciplina atualizada com sucesso!'
                    : 'Disciplina cadastrada com sucesso!'
            );


            limparFormulario();

            await carregarDisciplinas();


        } catch (erro) {

            console.error(erro);

            setMensagem(
                erro.message ||
                'Erro ao salvar a disciplina.'
            );

        }

    }


    // ==========================================
    // EDITAR
    // ==========================================

    function editarDisciplina(disciplina) {

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

    }


    // ==========================================
    // EXCLUIR
    // ==========================================

    async function excluirDisciplina(id) {

        const confirmar = window.confirm(
            'Deseja realmente excluir esta disciplina?'
        );


        if (!confirmar) {
            return;
        }


        try {

            const resposta = await fetch(
                `http://localhost:3000/disciplinas/${id}`,
                {
                    method: 'DELETE'
                }
            );


            if (!resposta.ok) {

                const erro = await resposta.text();

                throw new Error(
                    erro || 'Erro ao excluir disciplina'
                );

            }


            setMensagem(
                'Disciplina excluída com sucesso!'
            );


            await carregarDisciplinas();


        } catch (erro) {

            console.error(erro);

            setMensagem(
                erro.message ||
                'Erro ao excluir a disciplina.'
            );

        }

    }


    // ==========================================
    // TELA
    // ==========================================

    return (

        <Box>

            <Typography
                variant="h4"
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
                Cadastre e consulte as disciplinas
                do sistema escolar.
            </Typography>


            {/* =====================================
                MENSAGEM
            ====================================== */}

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
                        {editandoId !== null
                            ? 'Editar Disciplina'
                            : 'Cadastrar Disciplina'}
                    </Typography>


                    <Box
                        component="form"
                        onSubmit={salvarDisciplina}
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid
                                item
                                xs={12}
                                md={5}
                            >

                                <TextField
                                    fullWidth
                                    label="Nome da disciplina"
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
                                md={5}
                            >

                                <TextField
                                    fullWidth
                                    label="Descrição"
                                    value={descricao}
                                    onChange={(event) =>
                                        setDescricao(
                                            event.target.value
                                        )
                                    }
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={2}
                            >

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        height: '56px'
                                    }}
                                >
                                    {editandoId !== null
                                        ? 'Atualizar'
                                        : 'Salvar'}
                                </Button>

                            </Grid>


                            {editandoId !== null && (

                                <Grid
                                    item
                                    xs={12}
                                >

                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={
                                            limparFormulario
                                        }
                                    >
                                        Cancelar
                                    </Button>

                                </Grid>

                            )}

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
                Disciplinas Cadastradas
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
                                <strong>Descrição</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Ações</strong>
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {disciplinas.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={4}
                                    align="center"
                                >
                                    Nenhuma disciplina cadastrada.
                                </TableCell>

                            </TableRow>

                        ) : (

                            disciplinas.map((disciplina) => (

                                <TableRow
                                    key={disciplina.id}
                                >

                                    <TableCell>
                                        {disciplina.id}
                                    </TableCell>

                                    <TableCell>
                                        {disciplina.nome}
                                    </TableCell>

                                    <TableCell>
                                        {disciplina.descricao ||
                                            'Sem descrição'}
                                    </TableCell>

                                    <TableCell>

                                        <Button
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                mr: 1
                                            }}
                                            onClick={() =>
                                                editarDisciplina(
                                                    disciplina
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
                                                excluirDisciplina(
                                                    disciplina.id
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


export default Disciplinas;