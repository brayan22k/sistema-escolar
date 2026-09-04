import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

// Missao 002: componente puramente de apresentacao.
// Recebe a lista de turmas (ja com quantidade_alunos calculada pelo backend) via prop.
function ListaTurmas({ turmas }) {
  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Turmas cadastradas
        </Typography>

        {turmas.length === 0 ? (
          <Typography color="text.secondary">Nenhuma turma cadastrada ainda.</Typography>
        ) : (
          <Stack spacing={1}>
            {turmas.map((turma) => (
              <Box key={turma.id} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography fontWeight={600}>{turma.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Ano: {turma.ano} • Série: {turma.serie}
                  {turma.professor_responsavel ? ` • Professor: ${turma.professor_responsavel}` : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {turma.quantidade_alunos ?? 0} aluno(s) cadastrado(s)
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export default ListaTurmas;