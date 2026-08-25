import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

// Missao 002: componente puramente de apresentacao.
// Recebe a lista de turmas (ja com quantidade_alunos calculada pelo backend) via prop.
function ListaTurmas({ turmas }) {
  return (
    <Card
      sx={{
        mt: 4,
        backgroundColor: '#111111',
        border: '1px solid #333333',
        borderRadius: 2,
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: '#ffffff',
            fontWeight: 600
          }}
        >
          Turmas cadastradas
        </Typography>

        {turmas.length === 0 ? (
          <Typography
            sx={{
              color: '#999999'
            }}
          >
            Nenhuma turma cadastrada ainda.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {turmas.map((turma) => (
              <Box
                key={turma.id}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  p: 1.5,
                  border: '1px solid #444444',
                  borderRadius: 2,
                  backgroundColor: '#1b1b1b',

                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '50%',
                    height: '100%',
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                    transform: 'skewX(-25deg)',
                    animation: 'brilho 3s infinite',
                    pointerEvents: 'none'
                  },

                  '@keyframes brilho': {
                    '0%': {
                      left: '-100%'
                    },
                    '50%': {
                      left: '150%'
                    },
                    '100%': {
                      left: '150%'
                    }
                  }
                }}
              >
                <Typography
                  fontWeight={600}
                  sx={{
                    color: '#ffffff'
                  }}
                >
                  {turma.nome}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#aaaaaa'
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
                    color: '#777777'
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