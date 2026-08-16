import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
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
  Typography,
} from '@mui/material';

const initialForm = {
  nome: '',
  email: '',
  data_nascimento: '',
  serie: '',
  cpf: '',
  telefone: '',
  endereco: '',
};

const initialTurmaForm = {
  nome: '',
  serie: '',
  ano: new Date().getFullYear().toString(),
};

const menuItems = [
  { key: 'dashboard', label: 'Início', description: 'Visão geral do sistema' },
  { key: 'alunos', label: 'Alunos', description: 'Cadastro e consulta de estudantes' },
  { key: 'turmas', label: 'Turmas', description: 'Organização escolar' },
];

function App() {
  const [form, setForm] = useState(initialForm);
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [turmaForm, setTurmaForm] = useState(initialTurmaForm);
  const [alunosSelecionados, setAlunosSelecionados] = useState({});
  const [alunoBusca, setAlunoBusca] = useState('');
  const [turmaBusca, setTurmaBusca] = useState('');
  const [alunoEmEdicao, setAlunoEmEdicao] = useState(null);
  const [turmaEmEdicao, setTurmaEmEdicao] = useState(null);
  const [message, setMessage] = useState('');
  const [turmaMessage, setTurmaMessage] = useState('');
  const [view, setView] = useState('dashboard');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ usuario: '', senha: '' });

  const carregarAlunos = async () => {
    try {
      const response = await fetch('/api/alunos');
      if (!response.ok) throw new Error('Erro ao carregar alunos');
      const data = await response.json();
      setAlunos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const carregarTurmas = async () => {
    try {
      const response = await fetch('/api/turmas');
      if (!response.ok) throw new Error('Erro ao carregar turmas');
      setTurmas(await response.json());
    } catch (error) {
      setTurmaMessage(error.message);
    }
  };

  useEffect(() => {
    carregarAlunos();
    carregarTurmas();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (loginForm.usuario && loginForm.senha) {
      setLoggedIn(true);
    }
  };

  const handleTurmaChange = (event) => {
    const { name, value } = event.target;
    setTurmaForm({ ...turmaForm, [name]: value });
  };

  const handleTurmaSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(turmaEmEdicao ? `/api/turmas/${turmaEmEdicao}` : '/api/turmas', {
        method: turmaEmEdicao ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(turmaForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erro || 'Erro ao cadastrar turma');
      }

      setTurmaMessage(turmaEmEdicao ? 'Turma atualizada com sucesso!' : 'Turma cadastrada com sucesso!');
      setTurmaForm(initialTurmaForm);
      setTurmaEmEdicao(null);
      carregarTurmas();
    } catch (error) {
      setTurmaMessage(error.message);
    }
  };

  const vincularAluno = async (turmaId) => {
    const alunoId = alunosSelecionados[turmaId];
    if (!alunoId) return;

    try {
      const response = await fetch(`/api/turmas/${turmaId}/alunos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alunoId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erro || 'Erro ao vincular aluno');
      }

      setTurmaMessage('Aluno vinculado com sucesso!');
      setAlunosSelecionados({ ...alunosSelecionados, [turmaId]: '' });
      carregarAlunos();
      carregarTurmas();
    } catch (error) {
      setTurmaMessage(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(alunoEmEdicao ? `/api/alunos/${alunoEmEdicao}` : '/api/alunos', {
        method: alunoEmEdicao ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao cadastrar aluno');
      }

      setMessage(alunoEmEdicao ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso!');
      setForm(initialForm);
      setAlunoEmEdicao(null);
      carregarAlunos();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const editarAluno = (aluno) => {
    setAlunoEmEdicao(aluno.id);
    setForm({
      nome: aluno.nome || '',
      email: aluno.email || '',
      data_nascimento: aluno.data_nascimento || '',
      serie: aluno.serie || '',
      cpf: aluno.cpf || '',
      telefone: aluno.telefone || '',
      endereco: aluno.endereco || '',
    });
    setView('alunos');
  };

  const excluirAluno = async (aluno) => {
    if (!window.confirm(`Excluir o aluno ${aluno.nome}?`)) return;
    const response = await fetch(`/api/alunos/${aluno.id}`, { method: 'DELETE' });
    if (!response.ok) {
      setMessage('Não foi possível excluir o aluno.');
      return;
    }
    setMessage('Aluno excluído com sucesso!');
    carregarAlunos();
  };

  const editarTurma = (turma) => {
    setTurmaEmEdicao(turma.id);
    setTurmaForm({ nome: turma.nome, serie: turma.serie, ano: String(turma.ano) });
    setView('turmas');
  };

  const excluirTurma = async (turma) => {
    if (!window.confirm(`Excluir a turma ${turma.nome}? Os alunos serão desassociados.`)) return;
    const response = await fetch(`/api/turmas/${turma.id}`, { method: 'DELETE' });
    if (!response.ok) {
      setTurmaMessage('Não foi possível excluir a turma.');
      return;
    }
    setTurmaMessage('Turma excluída com sucesso!');
    carregarAlunos();
    carregarTurmas();
  };

  const alunosFiltrados = alunos.filter((aluno) => (
    `${aluno.nome} ${aluno.email} ${aluno.serie}`.toLowerCase().includes(alunoBusca.toLowerCase())
  ));

  const turmasFiltradas = turmas.filter((turma) => (
    `${turma.nome} ${turma.serie} ${turma.ano}`.toLowerCase().includes(turmaBusca.toLowerCase())
  ));

  if (!loggedIn) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
          <Stack spacing={3} alignItems="center">
            <Box textAlign="center">
              <Typography variant="h4" fontWeight={700}>
                Sistema Escolar
              </Typography>
              <Typography color="text.secondary">
                Acesso provisório ao painel administrativo.
              </Typography>
            </Box>

            <form onSubmit={handleLoginSubmit} style={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Usuário"
                  name="usuario"
                  value={loginForm.usuario}
                  onChange={handleLoginChange}
                />
                <TextField
                  fullWidth
                  label="Senha"
                  name="senha"
                  type="password"
                  value={loginForm.senha}
                  onChange={handleLoginChange}
                />
                <Button type="submit" variant="contained" size="large">
                  Entrar
                </Button>
              </Stack>
            </form>

            <Typography variant="body2" color="text.secondary" textAlign="center">
              Login ainda será implementado com autenticação real no próximo passo.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Painel Escolar
              </Typography>
              <Typography color="text.secondary">
                Gestão administrativa e cadastro de estudantes.
              </Typography>
            </Box>
            <Button variant="outlined" onClick={() => setLoggedIn(false)}>
              Sair
            </Button>
          </Box>

          <Grid container spacing={2}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.key}>
                <Button
                  fullWidth
                  variant={view === item.key ? 'contained' : 'outlined'}
                  sx={{ justifyContent: 'flex-start', py: 2, px: 2, minHeight: 88 }}
                  onClick={() => setView(item.key)}
                >
                  <Box textAlign="left">
                    <Typography fontWeight={600}>{item.label}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>

          {view === 'alunos' ? (
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Cadastro de Alunos
              </Typography>

              {message && (
                <Alert severity={message.includes('sucesso') ? 'success' : 'error'} sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Nome" name="nome" value={form.nome} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField fullWidth label="Data de nascimento" name="data_nascimento" type="date" value={form.data_nascimento} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField select fullWidth label="Série" name="serie" value={form.serie} onChange={handleChange} required>
                        <MenuItem value="1º Ano">1º Ano</MenuItem>
                        <MenuItem value="2º Ano">2º Ano</MenuItem>
                        <MenuItem value="3º Ano">3º Ano</MenuItem>
                        <MenuItem value="4º Ano">4º Ano</MenuItem>
                        <MenuItem value="5º Ano">5º Ano</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField fullWidth label="CPF" name="cpf" value={form.cpf} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField fullWidth label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField fullWidth label="Endereço" name="endereco" value={form.endereco} onChange={handleChange} />
                    </Grid>
                  </Grid>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" size="large">
                      {alunoEmEdicao ? 'Atualizar aluno' : 'Salvar aluno'}
                    </Button>
                    <Button variant="outlined" size="large" onClick={() => { setForm(initialForm); setAlunoEmEdicao(null); }}>
                      Limpar
                    </Button>
                  </Stack>
                </form>
              </Paper>

              <Paper variant="outlined" sx={{ mt: 4, p: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
                  <Typography variant="h6">Lista de alunos</Typography>
                  <TextField size="small" label="Buscar aluno" value={alunoBusca} onChange={(event) => setAlunoBusca(event.target.value)} />
                </Stack>
                {alunosFiltrados.length === 0 ? (
                    <Typography color="text.secondary">Nenhum aluno cadastrado ainda.</Typography>
                  ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead><TableRow><TableCell>Nome</TableCell><TableCell>E-mail</TableCell><TableCell>Série</TableCell><TableCell align="right">Ações</TableCell></TableRow></TableHead>
                      <TableBody>{alunosFiltrados.map((aluno) => (
                        <TableRow key={aluno.id} hover>
                          <TableCell>{aluno.nome}</TableCell><TableCell>{aluno.email}</TableCell><TableCell>{aluno.serie}</TableCell>
                          <TableCell align="right"><Button size="small" onClick={() => editarAluno(aluno)}>Editar</Button><Button size="small" color="error" onClick={() => excluirAluno(aluno)}>Excluir</Button></TableCell>
                        </TableRow>
                      ))}</TableBody>
                    </Table>
                  </TableContainer>
                  )}
              </Paper>
            </Box>
          ) : view === 'turmas' ? (
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Gestão de Turmas
              </Typography>

              {turmaMessage && (
                <Alert severity={turmaMessage.includes('sucesso') ? 'success' : 'error'} sx={{ mb: 2 }}>
                  {turmaMessage}
                </Alert>
              )}

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <form onSubmit={handleTurmaSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField fullWidth label="Nome da turma" name="nome" value={turmaForm.nome} onChange={handleTurmaChange} placeholder="Ex.: 3º DS" required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField select fullWidth label="Série" name="serie" value={turmaForm.serie} onChange={handleTurmaChange} required>
                        <MenuItem value="1º Ano">1º Ano</MenuItem>
                        <MenuItem value="2º Ano">2º Ano</MenuItem>
                        <MenuItem value="3º Ano">3º Ano</MenuItem>
                        <MenuItem value="4º Ano">4º Ano</MenuItem>
                        <MenuItem value="5º Ano">5º Ano</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField fullWidth label="Ano letivo" name="ano" type="number" value={turmaForm.ano} onChange={handleTurmaChange} inputProps={{ min: 2000, max: 2100 }} required />
                    </Grid>
                  </Grid>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" size="large">{turmaEmEdicao ? 'Atualizar turma' : 'Salvar turma'}</Button>
                    <Button variant="outlined" size="large" onClick={() => { setTurmaForm(initialTurmaForm); setTurmaEmEdicao(null); }}>Limpar</Button>
                  </Stack>
                </form>
              </Paper>

              <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
                  <Typography variant="h6">Lista de turmas</Typography>
                  <TextField size="small" label="Buscar turma" value={turmaBusca} onChange={(event) => setTurmaBusca(event.target.value)} />
                </Stack>
                {turmasFiltradas.length === 0 ? <Typography color="text.secondary">Nenhuma turma cadastrada ainda.</Typography> : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead><TableRow><TableCell>Turma</TableCell><TableCell>Série</TableCell><TableCell>Ano</TableCell><TableCell>Alunos</TableCell><TableCell align="right">Ações</TableCell></TableRow></TableHead>
                      <TableBody>{turmasFiltradas.map((turma) => {
                  const alunosVinculados = turma.alunos || [];
                  const alunosDisponiveis = alunos.filter((aluno) => !aluno.turma_id);

                  return (
                    <TableRow key={turma.id} hover>
                      <TableCell>{turma.nome}</TableCell><TableCell>{turma.serie}</TableCell><TableCell>{turma.ano}</TableCell><TableCell>{alunosVinculados.length}</TableCell>
                      <TableCell align="right"><Button size="small" onClick={() => editarTurma(turma)}>Editar</Button><Button size="small" color="error" onClick={() => excluirTurma(turma)}>Excluir</Button></TableCell>
                    </TableRow>
                  );
                })}</TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>

              <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Alunos por turma</Typography>
                {turmasFiltradas.map((turma) => {
                  const alunosVinculados = turma.alunos || [];
                  const alunosDisponiveis = alunos.filter((aluno) => !aluno.turma_id);
                  return <Box key={turma.id} sx={{ mb: 2 }}><Typography fontWeight={600}>{turma.nome}</Typography><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}><TextField select fullWidth size="small" label="Adicionar aluno" value={alunosSelecionados[turma.id] || ''} onChange={(event) => setAlunosSelecionados({ ...alunosSelecionados, [turma.id]: event.target.value })}>{alunosDisponiveis.map((aluno) => <MenuItem key={aluno.id} value={aluno.id}>{aluno.nome}</MenuItem>)}</TextField><Button variant="outlined" onClick={() => vincularAluno(turma.id)} disabled={!alunosSelecionados[turma.id]}>Vincular</Button></Stack><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{alunosVinculados.length ? alunosVinculados.map((aluno) => aluno.nome).join(', ') : 'Nenhum aluno vinculado.'}</Typography></Box>;
                })}
              </Paper>
            </Box>
          ) : (
            <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom>
                {menuItems.find((item) => item.key === view)?.label}
              </Typography>
              <Typography color="text.secondary">
                Selecione uma opção no menu para começar.
              </Typography>
            </Paper>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

export default App;
