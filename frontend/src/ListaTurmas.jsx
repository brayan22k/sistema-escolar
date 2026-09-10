import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

// Missao 002: componente puramente de apresentacao.
// Recebe a lista de turmas (ja com quantidade_alunos calculada pelo backend) via prop.
function ListaTurmas({ turmas }) {
  return (
    <Card
      sx={{
        mt: 4,
        borderRadius: 3,
        border: '1px solid #e5e7eb',
        boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: '#172033',
            mb: 2
          }}
        >
          Turmas cadastradas
        </Typography>

        {turmas.length === 0 ? (
          <Box
            sx={{
              py: 4,
              px: 2,
              textAlign: 'center',
              borderRadius: 2,
              backgroundColor: '#f8fafc',
              border: '1px dashed #cbd5e1'
            }}
          >
            <Typography
              color="text.secondary"
              sx={{
                fontSize: '0.95rem'
              }}
            >
              Nenhuma turma cadastrada ainda.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {turmas.map((turma) => (
              <Box
                key={turma.id}
                sx={{
                  p: 2,
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  backgroundColor: '#ffffff',
                  transition: 'all 0.2s ease',

                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    borderColor: '#cbd5e1',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)'
                  }
                }}
              >
                <Typography
                  fontWeight={700}
                  sx={{
                    color: '#1e293b',
                    fontSize: '1rem',
                    mb: 0.5
                  }}
                >
                  {turma.nome}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6
                  }}
                >
                  Ano: {turma.ano} • Série: {turma.serie}
                  {turma.professor_responsavel
                    ? ` • Professor: ${turma.professor_responsavel}`
                    : ''}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#64748b',
                    mt: 0.5,
                    fontWeight: 500
                  }}
                >
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