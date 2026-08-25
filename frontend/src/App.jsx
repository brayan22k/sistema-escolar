import { useEffect, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
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
  Typography,
} from '@mui/material';

import Turmas from './Turmas.jsx';


// ======================================================
// FORMULÁRIO INICIAL
// ======================================================

const initialForm = {
  nome: '',
  email: '',
  data_nascimento: '',
  serie: '',
  cpf: '',
  telefone: '',
  endereco: '',
};


// ======================================================
// MENU PRINCIPAL
// ======================================================

const menuItems = [
  {
    key: 'dashboard',
    label: 'Início',
    description: 'Visão geral do sistema',
  },

  {
    key: 'alunos',
    label: 'Alunos',
    description: 'Cadastro e consulta de estudantes',
  },

  {
    key: 'professores',
    label: 'Professores',
    description: 'Gestão da equipe',
  },

  {
    key: 'turmas',
    label: 'Turmas',
    description: 'Organização escolar',
  },

  {
    key: 'financeiro',
    label: 'Financeiro',
    description: 'Mensalidades e contas',
  },

  {
    key: 'relatorios',
    label: 'Relatórios',
    description: 'Indicadores da escola',
  },
];


// ======================================================
// APP
// ======================================================

function App() {

  // ====================================================
  // ESTADOS
  // ====================================================

  const [form, setForm] =
    useState(initialForm);

  const [alunos, setAlunos] =
    useState([]);

  const [message, setMessage] =
    useState('');

  const [view, setView] =
    useState('dashboard');

  const [loggedIn, setLoggedIn] =
    useState(false);

  const [loginForm, setLoginForm] =
    useState({
      usuario: '',
      senha: '',
    });


  // ====================================================
  // FILTRO GLOBAL
  // ====================================================

  const [filtroGlobal, setFiltroGlobal] =
    useState('');


  // ====================================================
  // PAGINAÇÃO
  // ====================================================

  const [pagina, setPagina] =
    useState(0);

  const [linhasPorPagina, setLinhasPorPagina] =
    useState(5);


  // ====================================================
  // EDIÇÃO
  // ====================================================

  const [alunoEditando, setAlunoEditando] =
    useState(null);


  // ====================================================
  // EXCLUSÃO
  // ====================================================

  const [alunoExcluir, setAlunoExcluir] =
    useState(null);


  // ====================================================
  // CARREGAR ALUNOS
  // ====================================================

  const carregarAlunos = async () => {

    try {

      const response =
        await fetch('/api/alunos');


      if (!response.ok) {

        throw new Error(
          'Erro ao carregar alunos'
        );

      }


      const data =
        await response.json();


      setAlunos(data);


    } catch (error) {

      console.error(
        'Erro ao carregar alunos:',
        error
      );


      setMessage(
        'Erro ao carregar alunos.'
      );

    }

  };


  // ====================================================
  // CARREGAR AO ABRIR O SISTEMA
  // ====================================================

  useEffect(() => {

    carregarAlunos();

  }, []);


  // ====================================================
  // ALTERAR FORMULÁRIO
  // ====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setForm({
      ...form,
      [name]: value,
    });

  };


  // ====================================================
  // LOGIN
  // ====================================================

  const handleLoginChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setLoginForm({
      ...loginForm,
      [name]: value,
    });

  };


  const handleLoginSubmit = (event) => {

    event.preventDefault();


    if (
      loginForm.usuario &&
      loginForm.senha
    ) {

      setLoggedIn(true);

    }

  };


  // ====================================================
  // CADASTRAR ALUNO
  // ====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setMessage('');


    try {

      const response =
        await fetch(
          '/api/alunos',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify(form),
          }
        );


      if (!response.ok) {

        const erro =
          await response.text();


        throw new Error(
          erro ||
          'Erro ao cadastrar aluno'
        );

      }


      setMessage(
        'Aluno cadastrado com sucesso!'
      );


      setForm(initialForm);


      await carregarAlunos();


    } catch (error) {

      console.error(
        'Erro ao cadastrar:',
        error
      );


      setMessage(
        error.message ||
        'Erro ao cadastrar aluno'
      );

    }

  };


  // ====================================================
  // ABRIR EDIÇÃO
  // ====================================================

  const abrirEdicao = (aluno) => {

    setAlunoEditando({
      ...aluno,
    });

  };


  // ====================================================
  // ALTERAR ALUNO EM EDIÇÃO
  // ====================================================

  const handleEditarChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setAlunoEditando({
      ...alunoEditando,
      [name]: value,
    });

  };


  // ====================================================
  // SALVAR EDIÇÃO
  // ====================================================

  const salvarEdicao = async () => {

    if (!alunoEditando) {
      return;
    }


    try {

      const response =
        await fetch(
          `/api/alunos/${alunoEditando.id}`,
          {
            method: 'PUT',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({

              nome:
                alunoEditando.nome,

              email:
                alunoEditando.email,

              data_nascimento:
                alunoEditando.data_nascimento ||
                null,

              serie:
                alunoEditando.serie ||
                null,

              cpf:
                alunoEditando.cpf ||
                null,

              telefone:
                alunoEditando.telefone ||
                null,

              endereco:
                alunoEditando.endereco ||
                null,

            }),
          }
        );


      if (!response.ok) {

        const erro =
          await response.text();


        throw new Error(
          erro ||
          'Erro ao editar aluno'
        );

      }


      setMessage(
        'Aluno atualizado com sucesso!'
      );


      setAlunoEditando(null);


      await carregarAlunos();


    } catch (error) {

      console.error(
        'Erro ao editar:',
        error
      );


      setMessage(
        error.message ||
        'Erro ao editar aluno'
      );

    }

  };


  // ====================================================
  // EXCLUIR ALUNO
  // ====================================================

  const excluirAluno = async () => {

    if (!alunoExcluir) {
      return;
    }


    try {

      const response =
        await fetch(
          `/api/alunos/${alunoExcluir.id}`,
          {
            method: 'DELETE',
          }
        );


      if (!response.ok) {

        const erro =
          await response.text();


        throw new Error(
          erro ||
          'Erro ao excluir aluno'
        );

      }


      setMessage(
        'Aluno excluído com sucesso!'
      );


      setAlunoExcluir(null);


      await carregarAlunos();


    } catch (error) {

      console.error(
        'Erro ao excluir:',
        error
      );


      setMessage(
        error.message ||
        'Erro ao excluir aluno'
      );

    }

  };


  // ====================================================
  // FILTRO GLOBAL
  // ====================================================

  const alunosFiltrados =
    alunos.filter((aluno) => {

      const texto =
        filtroGlobal
          .toLowerCase()
          .trim();


      // Se o campo estiver vazio,
      // mostra todos os alunos.

      if (texto === '') {
        return true;
      }


      const dadosAluno = [

        aluno.id,

        aluno.nome,

        aluno.email,

        aluno.serie,

        aluno.cpf,

        aluno.telefone,

        aluno.endereco,

      ];


      return dadosAluno.some(
        (valor) =>

          String(valor || '')
            .toLowerCase()
            .includes(texto)
      );

    });


  // ====================================================
  // PAGINAÇÃO
  // ====================================================

  const alunosDaPagina =
    alunosFiltrados.slice(
      pagina * linhasPorPagina,

      pagina * linhasPorPagina +
        linhasPorPagina
    );


  const handleChangePagina =
    (event, novaPagina) => {

      setPagina(novaPagina);

    };


  const handleChangeLinhasPorPagina =
    (event) => {

      setLinhasPorPagina(
        parseInt(
          event.target.value,
          10
        )
      );


      setPagina(0);

    };


  // ====================================================
  // LOGIN
  // ====================================================

  if (!loggedIn) {

    return (

      <Container
        maxWidth="sm"
        sx={{ py: 6 }}
      >

        <Paper
          elevation={6}
          sx={{
            p: {
              xs: 3,
              md: 5,
            },

            borderRadius: 4,
          }}
        >

          <Stack
            spacing={3}
            alignItems="center"
          >

            <Box textAlign="center">

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ letterSpacing: '-0.5px', color: '#172033' }}
              >
                Sistema Escolar
              </Typography>


              <Typography
                color="text.secondary"
              >
                Acesso provisório ao painel administrativo.
              </Typography>

            </Box>


            <form
              onSubmit={
                handleLoginSubmit
              }

              style={{
                width: '100%',
              }}
            >

              <Stack spacing={2}>

                <TextField
                  fullWidth
                  label="Usuário"
                  name="usuario"
                  value={
                    loginForm.usuario
                  }
                  onChange={
                    handleLoginChange
                  }
                />


                <TextField
                  fullWidth
                  label="Senha"
                  name="senha"
                  type="password"
                  value={
                    loginForm.senha
                  }
                  onChange={
                    handleLoginChange
                  }
                />


                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  Entrar
                </Button>

              </Stack>

            </form>

          </Stack>

        </Paper>

      </Container>

    );

  }


  // ====================================================
  // PAINEL PRINCIPAL
  // ====================================================

  return (

    <Container
      maxWidth="xl"
      sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}
    >

      <Paper
        elevation={3}
        sx={{
          p: {
            xs: 3,
            md: 4,
          },

          borderRadius: 4,
          border: '1px solid #e5e7eb',
          boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)',
          backgroundColor: '#ffffff',
        }}
      >

        <Stack spacing={3}>


          {/* ==========================================
              CABEÇALHO
          ========================================== */}

          <Box
            sx={{
              display: 'flex',

              justifyContent:
                'space-between',

              alignItems: 'center',

              flexWrap: 'wrap',

              gap: 2,
            }}
          >

            <Box>

              <Typography
                variant="h4"
                fontWeight={700}
              >
                Painel Escolar
              </Typography>


              <Typography
                color="text.secondary"
              >
                Gestão administrativa e cadastro de estudantes.
              </Typography>

            </Box>


            <Button
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              onClick={() =>
                setLoggedIn(false)
              }
            >
              Sair
            </Button>

          </Box>


          {/* ==========================================
              MENU
          ========================================== */}

          <Grid
            container
            spacing={2}
          >

            {menuItems.map(
              (item) => (

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={item.key}
                >

                  <Button
                    fullWidth

                    variant={
                      view === item.key
                        ? 'contained'
                        : 'outlined'
                    }

                    sx={{
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      py: 2,
                      px: 2.5,
                      minHeight: 88,
                      borderRadius: 2.5,
                      textTransform: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: view === item.key ? '0 6px 16px rgba(37, 99, 235, 0.18)' : 'none',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                      },
                    }}

                    onClick={() =>
                      setView(item.key)
                    }
                  >

                    <Box textAlign="left">

                      <Typography
                        fontWeight={600}
                      >
                        {item.label}
                      </Typography>


                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.8,
                        }}
                      >
                        {
                          item.description
                        }
                      </Typography>

                    </Box>

                  </Button>

                </Grid>

              )
            )}

          </Grid>


          {/* ==========================================
              ALUNOS
          ========================================== */}

          {view === 'alunos' ? (

            <Box>

              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ mb: 2, fontWeight: 700 }}
              >
                Cadastro de Alunos
              </Typography>


              {/* MENSAGEM */}

              {message && (

                <Alert
                  severity={
                    message
                      .toLowerCase()
                      .includes(
                        'sucesso'
                      )
                      ? 'success'
                      : 'error'
                  }

                  sx={{ mb: 2 }}

                  onClose={() =>
                    setMessage('')
                  }
                >
                  {message}
                </Alert>

              )}


              {/* ====================================
                  FORMULÁRIO
              ==================================== */}

              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  borderColor: '#e5e7eb',
                  backgroundColor: '#ffffff',
                }}
              >

                <form
                  onSubmit={
                    handleSubmit
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
                      md={6}
                    >

                      <TextField
                        fullWidth
                        label="Nome"
                        name="nome"
                        value={
                          form.nome
                        }
                        onChange={
                          handleChange
                        }
                        required
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
                        label="E-mail"
                        name="email"
                        type="email"
                        value={
                          form.email
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </Grid>


                    {/* DATA */}

                    <Grid
                      item
                      xs={12}
                      md={6}
                    >

                      <TextField
                        fullWidth
                        label="Data de nascimento"
                        name="data_nascimento"
                        type="date"
                        value={
                          form.data_nascimento
                        }
                        onChange={
                          handleChange
                        }

                        InputLabelProps={{
                          shrink: true,
                        }}

                        required
                      />

                    </Grid>


                    {/* SÉRIE */}

                    <Grid
                      item
                      xs={12}
                      md={6}
                    >

                      <TextField
                        select
                        fullWidth
                        label="Série"
                        name="serie"
                        value={
                          form.serie
                        }
                        onChange={
                          handleChange
                        }
                        required
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


                    {/* CPF */}

                    <Grid
                      item
                      xs={12}
                      md={4}
                    >

                      <TextField
                        fullWidth
                        label="CPF"
                        name="cpf"
                        value={
                          form.cpf
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </Grid>


                    {/* TELEFONE */}

                    <Grid
                      item
                      xs={12}
                      md={4}
                    >

                      <TextField
                        fullWidth
                        label="Telefone"
                        name="telefone"
                        value={
                          form.telefone
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </Grid>


                    {/* ENDEREÇO */}

                    <Grid
                      item
                      xs={12}
                      md={4}
                    >

                      <TextField
                        fullWidth
                        label="Endereço"
                        name="endereco"
                        value={
                          form.endereco
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </Grid>

                  </Grid>


                  {/* BOTÕES */}

                  <Stack
                    direction={{
                      xs: 'column',
                      sm: 'row',
                    }}

                    spacing={2}

                    sx={{
                      mt: 3,
                    }}
                  >

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                    >
                      Salvar aluno
                    </Button>


                    <Button
                      type="button"
                      variant="outlined"
                      size="large"
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}

                      onClick={() => {

                        setForm(
                          initialForm
                        );

                        setMessage('');

                      }}
                    >
                      Limpar
                    </Button>

                  </Stack>

                </form>

              </Paper>


              {/* ====================================
                  FILTRO GLOBAL
              ==================================== */}

              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  mt: 4,
                  borderRadius: 3,
                }}
              >

                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ mb: 2 }}
                >
                  🔎 Pesquisa global
                </Typography>


                <TextField
                  fullWidth

                  label="Pesquisar em todos os campos"

                  placeholder={
                    'Nome, e-mail, série, CPF, telefone, endereço...'
                  }

                  value={
                    filtroGlobal
                  }

                  onChange={(event) => {

                    setFiltroGlobal(
                      event.target.value
                    );

                    setPagina(0);

                  }}
                />


                <Box sx={{ mt: 2 }}>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >

                    {alunosFiltrados.length}{' '}
                    aluno(s) encontrado(s)

                  </Typography>

                </Box>


                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}

                  onClick={() => {

                    setFiltroGlobal('');

                    setPagina(0);

                  }}
                >
                  Limpar pesquisa
                </Button>

              </Paper>


              {/* ====================================
                  TABELA MATERIAL UI
              ==================================== */}

              <Card
                sx={{
                  mt: 4,
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
                }}
              >

                <CardContent>

                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Alunos cadastrados
                  </Typography>


                  <TableContainer
                    component={Paper}
                    variant="outlined"
                  >

                    <Table>

                      {/* CABEÇALHO */}

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
                              Série
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


                          <TableCell align="center">
                            <strong>
                              Ações
                            </strong>
                          </TableCell>

                        </TableRow>

                      </TableHead>


                      {/* CORPO */}

                      <TableBody>

                        {alunosDaPagina.map(
                          (aluno) => (

                            <TableRow
                              key={
                                aluno.id
                              }

                              hover
                            >

                              <TableCell>
                                {
                                  aluno.id
                                }
                              </TableCell>


                              <TableCell>
                                {
                                  aluno.nome
                                }
                              </TableCell>


                              <TableCell>
                                {
                                  aluno.email
                                }
                              </TableCell>


                              <TableCell>
                                {
                                  aluno.serie ||
                                  'Não informada'
                                }
                              </TableCell>


                              <TableCell>
                                {
                                  aluno.cpf ||
                                  '-'
                                }
                              </TableCell>


                              <TableCell>
                                {
                                  aluno.telefone ||
                                  '-'
                                }
                              </TableCell>


                              <TableCell>

                                <Stack
                                  direction="row"
                                  spacing={1}
                                  justifyContent="center"
                                >

                                  <Button
                                    variant="outlined"
                                    size="small"

                                    onClick={() =>
                                      abrirEdicao(
                                        aluno
                                      )
                                    }
                                  >
                                    Editar
                                  </Button>


                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"

                                    onClick={() =>
                                      setAlunoExcluir(
                                        aluno
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


                        {/* NENHUM RESULTADO */}

                        {alunosDaPagina.length === 0 && (

                          <TableRow>

                            <TableCell
                              colSpan={7}
                              align="center"
                            >

                              <Typography
                                color="text.secondary"
                                sx={{
                                  py: 4,
                                }}
                              >
                                Nenhum aluno encontrado.
                              </Typography>

                            </TableCell>

                          </TableRow>

                        )}

                      </TableBody>

                    </Table>


                    {/* PAGINAÇÃO */}

                    <TablePagination

                      component="div"

                      count={
                        alunosFiltrados.length
                      }

                      page={
                        pagina
                      }

                      onPageChange={
                        handleChangePagina
                      }

                      rowsPerPage={
                        linhasPorPagina
                      }

                      onRowsPerPageChange={
                        handleChangeLinhasPorPagina
                      }

                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                      ]}

                      labelRowsPerPage={
                        'Alunos por página'
                      }

                      labelDisplayedRows={({
                        from,
                        to,
                        count,
                      }) =>
                        `${from}-${to} de ${
                          count !== -1
                            ? count
                            : `mais de ${to}`
                        }`
                      }

                    />

                  </TableContainer>

                </CardContent>

              </Card>

            </Box>


          ) : view === 'turmas' ? (

            // =========================================
            // TURMAS
            // =========================================

            <Turmas />

          ) : (

            // =========================================
            // OUTRAS TELAS
            // =========================================

            <Paper
              variant="outlined"
              sx={{
                p: 4,
                borderRadius: 3,
              }}
            >

              <Typography
                variant="h6"
                gutterBottom
              >

                {
                  menuItems.find(
                    (item) =>
                      item.key === view
                  )?.label
                }

              </Typography>


              <Typography
                color="text.secondary"
              >
                Esta área ficará disponível para a próxima etapa do sistema escolar.
              </Typography>

            </Paper>

          )}

        </Stack>

      </Paper>


      {/* ==================================================
          DIALOG EDITAR ALUNO
      ================================================== */}

      <Dialog
        open={
          Boolean(alunoEditando)
        }

        onClose={() =>
          setAlunoEditando(null)
        }

        fullWidth

        maxWidth="md"
      >

        <DialogTitle>
          Editar aluno
        </DialogTitle>


        <DialogContent>

          {alunoEditando && (

            <Grid
              container
              spacing={2}
              sx={{
                mt: 0.5,
              }}
            >

              {/* NOME */}

              <Grid
                item
                xs={12}
                md={6}
              >

                <TextField
                  fullWidth
                  label="Nome"
                  name="nome"

                  value={
                    alunoEditando.nome ||
                    ''
                  }

                  onChange={
                    handleEditarChange
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
                  label="E-mail"
                  name="email"
                  type="email"

                  value={
                    alunoEditando.email ||
                    ''
                  }

                  onChange={
                    handleEditarChange
                  }
                />

              </Grid>


              {/* DATA */}

              <Grid
                item
                xs={12}
                md={6}
              >

                <TextField
                  fullWidth
                  label="Data de nascimento"
                  name="data_nascimento"
                  type="date"

                  value={
                    alunoEditando.data_nascimento ||
                    ''
                  }

                  onChange={
                    handleEditarChange
                  }

                  InputLabelProps={{
                    shrink: true,
                  }}
                />

              </Grid>


              {/* SÉRIE */}

              <Grid
                item
                xs={12}
                md={6}
              >

                <TextField
                  select
                  fullWidth
                  label="Série"
                  name="serie"

                  value={
                    alunoEditando.serie ||
                    ''
                  }

                  onChange={
                    handleEditarChange
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


              {/* CPF */}

              <Grid
                item
                xs={12}
                md={4}
              >

                <TextField
                  fullWidth
                  label="CPF"
                  name="cpf"

                  value={
                    alunoEditando.cpf ||
                    ''
                  }

                  onChange={
                    handleEditarChange
                  }
                />

              </Grid>


              {/* TELEFONE */}

              <Grid
                item
                xs={12}
                md={4}
              >

                <TextField
                  fullWidth
                  label="Telefone"
                  name="telefone"

                  value={
                    alunoEditando.telefone ||
                    ''
                  }

                  onChange={
                    handleEditarChange
                  }
                />

              </Grid>


              {/* ENDEREÇO */}

              <Grid
                item
                xs={12}
                md={4}
              >

                <TextField
                  fullWidth
                  label="Endereço"
                  name="endereco"

                  value={
                    alunoEditando.endereco ||
                    ''
                  }

                  onChange={
                    handleEditarChange
                  }
                />

              </Grid>

            </Grid>

          )}

        </DialogContent>


        <DialogActions>

          <Button
            onClick={() =>
              setAlunoEditando(null)
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


      {/* ==================================================
          DIALOG EXCLUIR
      ================================================== */}

      <Dialog
        open={
          Boolean(alunoExcluir)
        }

        onClose={() =>
          setAlunoExcluir(null)
        }
      >

        <DialogTitle>
          Excluir aluno
        </DialogTitle>


        <DialogContent>

          <DialogContentText>

            Tem certeza que deseja excluir o aluno{' '}

            <strong>
              {
                alunoExcluir?.nome
              }
            </strong>

            ?

            <br />

            Essa ação não poderá ser desfeita.

          </DialogContentText>

        </DialogContent>


        <DialogActions>

          <Button
            onClick={() =>
              setAlunoExcluir(null)
            }
          >
            Cancelar
          </Button>


          <Button
            color="error"
            variant="contained"
            onClick={
              excluirAluno
            }
          >
            Excluir
          </Button>

        </DialogActions>

      </Dialog>

    </Container>

  );

}


export default App;