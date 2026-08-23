import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
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
  { key: 'boletim', label: 'Boletim', description: 'Lançamento e consulta de notas' },
];

const initialNotaForm = {
  aluno_id: '',
  disciplina: '',
  bimestre: '1º Bimestre',
  nota: '',
};

const initialDisciplinaForm = {
  turma_id: '',
  nome: '',
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [notas, setNotas] = useState([]);
  const [turmaForm, setTurmaForm] = useState(initialTurmaForm);
  const [disciplinaForm, setDisciplinaForm] = useState(initialDisciplinaForm);
  const [notaForm, setNotaForm] = useState(initialNotaForm);
  const [alunosSelecionados, setAlunosSelecionados] = useState({});
  const [alunoBusca, setAlunoBusca] = useState('');
  const [turmaBusca, setTurmaBusca] = useState('');
  const [disciplinaBusca, setDisciplinaBusca] = useState('');
  const [notaBusca, setNotaBusca] = useState('');
  const [alunoEmEdicao, setAlunoEmEdicao] = useState(null);
  const [turmaEmEdicao, setTurmaEmEdicao] = useState(null);
  const [disciplinaEmEdicao, setDisciplinaEmEdicao] = useState(null);
  const [notaEmEdicao, setNotaEmEdicao] = useState(null);
  const [message, setMessage] = useState('');
  const [turmaMessage, setTurmaMessage] = useState('');
  const [notaMessage, setNotaMessage] = useState('');
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

  const carregarNotas = async () => {
    try {
      const response = await fetch('/api/notas');
      if (!response.ok) throw new Error('Erro ao carregar notas');
      setNotas(await response.json());
    } catch (error) {
      setNotaMessage(error.message);
    }
  };

  const carregarDisciplinas = async () => {
    try {
      const response = await fetch('/api/disciplinas');
      if (!response.ok) throw new Error('Erro ao carregar disciplinas');
      setDisciplinas(await response.json());
    } catch (error) {
      setNotaMessage(error.message);
    }
  };

  useEffect(() => {
    carregarAlunos();
    carregarTurmas();
    carregarDisciplinas();
    carregarNotas();
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

  const handleDisciplinaChange = (event) => {
    const { name, value } = event.target;
    setDisciplinaForm({ ...disciplinaForm, [name]: value });
  };

  const handleNotaChange = (event) => {
    const { name, value } = event.target;
    setNotaForm({ ...notaForm, [name]: value });
  };

  const handleDisciplinaSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(disciplinaEmEdicao ? `/api/disciplinas/${disciplinaEmEdicao}` : '/api/disciplinas', {
        method: disciplinaEmEdicao ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          turma_id: Number(disciplinaForm.turma_id),
          nome: disciplinaForm.nome,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erro || 'Erro ao cadastrar disciplina');
      }

      setNotaMessage(disciplinaEmEdicao ? 'Disciplina atualizada com sucesso!' : 'Disciplina cadastrada com sucesso!');
      setDisciplinaForm(initialDisciplinaForm);
      setDisciplinaEmEdicao(null);
      carregarDisciplinas();
    } catch (error) {
      setNotaMessage(error.message);
    }
  };

  const handleNotaSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(notaEmEdicao ? `/api/notas/${notaEmEdicao}` : '/api/notas', {
        method: notaEmEdicao ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...notaForm,
          aluno_id: Number(notaForm.aluno_id),
          nota: Number(notaForm.nota),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erro || 'Erro ao cadastrar nota');
      }

      setNotaMessage(notaEmEdicao ? 'Nota atualizada com sucesso!' : 'Nota cadastrada com sucesso!');
      setNotaForm(initialNotaForm);
      setNotaEmEdicao(null);
      carregarNotas();
    } catch (error) {
      setNotaMessage(error.message);
    }
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

  const desvincularAluno = async (turmaId, alunoId) => {
    if (!window.confirm('Deseja desvincular este aluno da turma?')) return;

    try {
      const response = await fetch(`/api/turmas/${turmaId}/alunos/${alunoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.erro || 'Erro ao desvincular aluno');
      }

      setTurmaMessage('Aluno desvinculado com sucesso!');
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

  const editarDisciplina = (disciplina) => {
    setDisciplinaEmEdicao(disciplina.id);
    setDisciplinaForm({ turma_id: String(disciplina.turma_id), nome: disciplina.nome });
    setView('turmas');
  };

  const editarNota = (nota) => {
    setNotaEmEdicao(nota.id);
    setNotaForm({
      aluno_id: String(nota.aluno_id),
      disciplina: nota.disciplina,
      bimestre: nota.bimestre,
      nota: String(nota.nota),
    });
    setView('boletim');
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
    carregarDisciplinas();
  };

  const excluirDisciplina = async (disciplina) => {
    if (!window.confirm(`Excluir a disciplina ${disciplina.nome}?`)) return;
    const response = await fetch(`/api/disciplinas/${disciplina.id}`, { method: 'DELETE' });
    if (!response.ok) {
      setNotaMessage('Não foi possível excluir a disciplina.');
      return;
    }
    setNotaMessage('Disciplina excluída com sucesso!');
    carregarDisciplinas();
  };

  const excluirNota = async (nota) => {
    if (!window.confirm(`Excluir a nota de ${nota.aluno?.nome || 'este aluno'}?`)) return;
    const response = await fetch(`/api/notas/${nota.id}`, { method: 'DELETE' });
    if (!response.ok) {
      setNotaMessage('Não foi possível excluir a nota.');
      return;
    }
    setNotaMessage('Nota excluída com sucesso!');
    carregarNotas();
  };

  const alunosFiltrados = alunos.filter((aluno) => (
    `${aluno.nome} ${aluno.email} ${aluno.serie}`.toLowerCase().includes(alunoBusca.toLowerCase())
  ));

  const turmasFiltradas = turmas.filter((turma) => (
    `${turma.nome} ${turma.serie} ${turma.ano}`.toLowerCase().includes(turmaBusca.toLowerCase())
  ));

  const disciplinasFiltradas = disciplinas.filter((disciplina) => {
    const turmaNome = turmas.find((turma) => Number(turma.id) === Number(disciplina.turma_id))?.nome || '';
    return `${disciplina.nome} ${turmaNome}`.toLowerCase().includes(disciplinaBusca.toLowerCase());
  });

  const notasFiltradas = notas.filter((nota) => {
    const alunoNome = nota.aluno?.nome || '';
    return `${alunoNome} ${nota.disciplina} ${nota.bimestre}`.toLowerCase().includes(notaBusca.toLowerCase());
  });

  const resumoBoletim = alunos.map((aluno) => {
    const notasAluno = notas.filter((nota) => Number(nota.aluno_id) === Number(aluno.id));
    const media = notasAluno.length
      ? (notasAluno.reduce((soma, nota) => soma + Number(nota.nota), 0) / notasAluno.length).toFixed(1)
      : '—';

    return {
      aluno,
      media,
      notas: notasAluno,
      situacao: media === '—' ? 'Sem notas' : Number(media) >= 7 ? 'Aprovado' : Number(media) >= 5 ? 'Recuperação' : 'Reprovado',
    };
  });

  const mediaGeral = notas.length
    ? (notas.reduce((soma, nota) => soma + Number(nota.nota), 0) / notas.length).toFixed(1)
    : '0.0';

  const calcularSituacao = (media) => {
    if (media === null || Number.isNaN(media)) return 'Sem notas';
    if (media >= 7) return 'Aprovado';
    if (media >= 5) return 'Recuperação';
    return 'Reprovado';
  };

  const maiorNotaGeral = notas.length ? Math.max(...notas.map((nota) => Number(nota.nota))) : 0;
  const menorNotaGeral = notas.length ? Math.min(...notas.map((nota) => Number(nota.nota))) : 0;

  const desempenhoPorAluno = alunos.map((aluno) => {
    const notasAluno = notas.filter((nota) => Number(nota.aluno_id) === Number(aluno.id));
    const mediaAluno = notasAluno.length
      ? notasAluno.reduce((soma, nota) => soma + Number(nota.nota), 0) / notasAluno.length
      : null;

    return {
      aluno,
      mediaAluno,
      maiorNota: notasAluno.length ? Math.max(...notasAluno.map((nota) => Number(nota.nota))) : null,
      menorNota: notasAluno.length ? Math.min(...notasAluno.map((nota) => Number(nota.nota))) : null,
      situacao: calcularSituacao(mediaAluno),
      miniBoletim: notasAluno.map((nota) => ({
        disciplina: nota.disciplina,
        nota: Number(nota.nota),
      })),
    };
  });

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
            <Button type="button" variant="outlined" onClick={() => setLoggedIn(false)}>
              Sair
            </Button>
          </Box>

          <Grid container spacing={2}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.key}>
                <Button
                  type="button"
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

          {view === 'boletim' ? (
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Boletim digital
              </Typography>

              {notaMessage && (
                <Alert severity={notaMessage.includes('sucesso') ? 'success' : 'error'} sx={{ mb: 2 }}>
                  {notaMessage}
                </Alert>
              )}

              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <form onSubmit={handleNotaSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField select fullWidth label="Aluno" name="aluno_id" value={notaForm.aluno_id} onChange={handleNotaChange} required>
                        {alunos.map((aluno) => (
                          <MenuItem key={aluno.id} value={aluno.id}>{aluno.nome}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        select
                        fullWidth
                        label="Disciplina"
                        name="disciplina"
                        value={notaForm.disciplina}
                        onChange={handleNotaChange}
                        required
                        disabled={!disciplinas.length}
                      >
                        {disciplinas.map((disciplina) => (
                          <MenuItem key={disciplina.id} value={disciplina.nome}>{disciplina.nome}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField select fullWidth label="Bimestre" name="bimestre" value={notaForm.bimestre} onChange={handleNotaChange} required>
                        <MenuItem value="1º Bimestre">1º Bimestre</MenuItem>
                        <MenuItem value="2º Bimestre">2º Bimestre</MenuItem>
                        <MenuItem value="3º Bimestre">3º Bimestre</MenuItem>
                        <MenuItem value="4º Bimestre">4º Bimestre</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField fullWidth label="Nota" name="nota" type="number" inputProps={{ min: 0, max: 10, step: '0.1' }} value={notaForm.nota} onChange={handleNotaChange} required />
                    </Grid>
                  </Grid>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" size="large" disabled={!disciplinas.length}>{notaEmEdicao ? 'Atualizar nota' : 'Salvar nota'}</Button>
                    <Button variant="outlined" size="large" onClick={() => { setNotaForm(initialNotaForm); setNotaEmEdicao(null); }}>Limpar</Button>
                  </Stack>
                </form>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Resumo do boletim</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f7ff' }}>
                      <Typography variant="body2" color="text.secondary">Média geral da turma</Typography>
                      <Typography variant="h5" fontWeight={700}>{mediaGeral}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5fff7' }}>
                      <Typography variant="body2" color="text.secondary">Maior nota</Typography>
                      <Typography variant="h5" fontWeight={700}>{notas.length ? maiorNotaGeral.toFixed(1) : '0.0'}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fffaf1' }}>
                      <Typography variant="body2" color="text.secondary">Menor nota</Typography>
                      <Typography variant="h5" fontWeight={700}>{notas.length ? menorNotaGeral.toFixed(1) : '0.0'}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5f7ff' }}>
                      <Typography variant="body2" color="text.secondary">Total de notas</Typography>
                      <Typography variant="h5" fontWeight={700}>{notas.length}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f5fff7' }}>
                      <Typography variant="body2" color="text.secondary">Alunos com notas</Typography>
                      <Typography variant="h5" fontWeight={700}>{resumoBoletim.filter((item) => item.notas.length).length}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fffaf1' }}>
                      <Typography variant="body2" color="text.secondary">Status da turma</Typography>
                      <Typography variant="h5" fontWeight={700}>{notas.length ? (Number(mediaGeral) >= 7 ? 'Aprovada' : Number(mediaGeral) >= 5 ? 'Recuperação' : 'Reprovada') : 'Sem notas'}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Desempenho por aluno</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Aluno</TableCell>
                        <TableCell>Média</TableCell>
                        <TableCell>Maior nota</TableCell>
                        <TableCell>Menor nota</TableCell>
                        <TableCell>Situação</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {desempenhoPorAluno.map(({ aluno, mediaAluno, maiorNota, menorNota, situacao }) => (
                        <TableRow key={aluno.id} hover>
                          <TableCell>{aluno.nome}</TableCell>
                          <TableCell>{mediaAluno === null ? '—' : mediaAluno.toFixed(1)}</TableCell>
                          <TableCell>{maiorNota === null ? '—' : maiorNota.toFixed(1)}</TableCell>
                          <TableCell>{menorNota === null ? '—' : menorNota.toFixed(1)}</TableCell>
                          <TableCell>{situacao}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Mini boletim</Typography>
                <Grid container spacing={2}>
                  {desempenhoPorAluno.filter((item) => item.miniBoletim.length > 0).map(({ aluno, mediaAluno, miniBoletim, situacao }) => (
                    <Grid item xs={12} md={6} key={aluno.id}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight={700}>{aluno.nome}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Média: {mediaAluno === null ? '—' : mediaAluno.toFixed(1)} · Situação: {situacao}
                        </Typography>
                        <Stack spacing={1}>
                          {miniBoletim.map((item) => (
                            <Box key={`${aluno.id}-${item.disciplina}`} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', pb: 0.5 }}>
                              <Typography variant="body2">{item.disciplina}</Typography>
                              <Typography variant="body2" fontWeight={600}>{item.nota.toFixed(1)}</Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
                  <Typography variant="h6">Notas cadastradas</Typography>
                  <TextField size="small" label="Buscar nota" value={notaBusca} onChange={(event) => setNotaBusca(event.target.value)} />
                </Stack>

                {notasFiltradas.length === 0 ? (
                  <Typography color="text.secondary">Nenhuma nota cadastrada ainda.</Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Aluno</TableCell>
                          <TableCell>Disciplina</TableCell>
                          <TableCell>Bimestre</TableCell>
                          <TableCell>Nota</TableCell>
                          <TableCell>Situação</TableCell>
                          <TableCell align="right">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {notasFiltradas.map((nota) => {
                          const media = Number(nota.nota);
                          const situacao = media >= 7 ? 'Aprovado' : media >= 5 ? 'Recuperação' : 'Reprovado';
                          return (
                            <TableRow key={nota.id} hover>
                              <TableCell>{nota.aluno?.nome || 'Aluno removido'}</TableCell>
                              <TableCell>{nota.disciplina}</TableCell>
                              <TableCell>{nota.bimestre}</TableCell>
                              <TableCell>{Number(nota.nota).toFixed(1)}</TableCell>
                              <TableCell>{situacao}</TableCell>
                              <TableCell align="right">
                                <Button size="small" onClick={() => editarNota(nota)}>Editar</Button>
                                <Button size="small" color="error" onClick={() => excluirNota(nota)}>Excluir</Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Box>
          ) : view === 'alunos' ? (
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
                <Typography variant="h6" sx={{ mb: 2 }}>Cadastre disciplinas da turma</Typography>
                <form onSubmit={handleDisciplinaSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                      <TextField select fullWidth label="Turma" name="turma_id" value={disciplinaForm.turma_id} onChange={handleDisciplinaChange} required>
                        {turmas.map((turma) => (
                          <MenuItem key={turma.id} value={turma.id}>{turma.nome} - {turma.serie}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <TextField fullWidth label="Nome da disciplina" name="nome" value={disciplinaForm.nome} onChange={handleDisciplinaChange} placeholder="Ex.: Matemática" required />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Button type="submit" variant="contained" fullWidth sx={{ height: '100%' }}>{disciplinaEmEdicao ? 'Atualizar' : 'Salvar'}</Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>

              <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
                  <Typography variant="h6">Disciplinas cadastradas</Typography>
                  <TextField size="small" label="Buscar disciplina" value={disciplinaBusca} onChange={(event) => setDisciplinaBusca(event.target.value)} />
                </Stack>
                {disciplinasFiltradas.length === 0 ? (
                  <Typography color="text.secondary">Nenhuma disciplina cadastrada ainda.</Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Disciplina</TableCell>
                          <TableCell>Turma</TableCell>
                          <TableCell align="right">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {disciplinasFiltradas.map((disciplina) => {
                          const turma = turmas.find((item) => Number(item.id) === Number(disciplina.turma_id));
                          return (
                            <TableRow key={disciplina.id} hover>
                              <TableCell>{disciplina.nome}</TableCell>
                              <TableCell>{turma ? `${turma.nome} - ${turma.serie}` : 'Turma não encontrada'}</TableCell>
                              <TableCell align="right">
                                <Button size="small" onClick={() => editarDisciplina(disciplina)}>Editar</Button>
                                <Button size="small" color="error" onClick={() => excluirDisciplina(disciplina)}>Excluir</Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>

              <Paper variant="outlined" sx={{ mt: 2, p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Alunos por turma</Typography>
                {turmasFiltradas.map((turma) => {
                  const alunosVinculados = turma.alunos || [];
                  const alunosDisponiveis = alunos.filter((aluno) => !aluno.turma_id);
                  return (
                    <Box key={turma.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                      <Typography fontWeight={600}>{turma.nome}</Typography>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 1 }}>
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Adicionar aluno"
                          value={alunosSelecionados[turma.id] || ''}
                          onChange={(event) => setAlunosSelecionados({ ...alunosSelecionados, [turma.id]: event.target.value })}
                        >
                          {alunosDisponiveis.map((aluno) => (
                            <MenuItem key={aluno.id} value={aluno.id}>{aluno.nome}</MenuItem>
                          ))}
                        </TextField>
                        <Button variant="outlined" onClick={() => vincularAluno(turma.id)} disabled={!alunosSelecionados[turma.id]}>
                          Vincular
                        </Button>
                      </Stack>

                      <Box sx={{ mt: 2 }}>
                        {alunosVinculados.length ? (
                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                            {alunosVinculados.map((aluno) => (
                              <Chip
                                key={aluno.id}
                                label={aluno.nome}
                                onDelete={() => desvincularAluno(turma.id, aluno.id)}
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">Nenhum aluno vinculado.</Typography>
                        )}
                      </Box>
                    </Box>
                  );
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
