import { useEffect, useMemo, useState } from 'react';

import {
    Alert,
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';


const URL_AUDITORIA =
    'http://localhost:3000/auditoria';


function obterToken() {
    return (
        localStorage.getItem('token') ||
        localStorage.getItem('jwt') ||
        localStorage.getItem('accessToken') ||
        ''
    );
}


function formatarData(data) {
    if (!data) {
        return '-';
    }

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
        return data;
    }

    return dataObj.toLocaleString('pt-BR');
}


function corOperacao(operacao) {
    switch (operacao) {
        case 'CRIAR':
            return 'success';

        case 'EDITAR':
            return 'warning';

        case 'EXCLUIR':
            return 'error';

        case 'LOGIN_SUCESSO':
            return 'info';

        case 'LOGIN_RECUSADO':
            return 'error';

        default:
            return 'default';
    }
}


function Auditoria() {

    const [registros, setRegistros] =
        useState([]);

    const [carregando, setCarregando] =
        useState(true);

    const [erro, setErro] =
        useState('');

    const [busca, setBusca] =
        useState('');

    const [operacao, setOperacao] =
        useState('');

    const [inicio, setInicio] =
        useState('');

    const [fim, setFim] =
        useState('');


    async function carregarAuditoria() {

        setCarregando(true);
        setErro('');

        try {

            const token = obterToken();

            if (!token) {
                throw new Error(
                    'Token de autenticação não encontrado.'
                );
            }


            const parametros =
                new URLSearchParams();


            if (inicio) {
                parametros.append(
                    'inicio',
                    inicio
                );
            }


            if (fim) {
                parametros.append(
                    'fim',
                    fim
                );
            }


            if (operacao) {
                parametros.append(
                    'operacao',
                    operacao
                );
            }


            const url =
                parametros.toString()
                    ? `${URL_AUDITORIA}?${parametros.toString()}`
                    : URL_AUDITORIA;


            const resposta = await fetch(
                url,
                {
                    method: 'GET',

                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        'Content-Type':
                            'application/json'
                    }
                }
            );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    dados?.erro ||
                    'Não foi possível carregar a auditoria.'
                );
            }


            setRegistros(
                Array.isArray(dados)
                    ? dados
                    : []
            );

        } catch (error) {

            console.error(
                'Erro ao carregar auditoria:',
                error
            );

            setErro(
                error.message ||
                'Erro ao carregar auditoria.'
            );

            setRegistros([]);

        } finally {

            setCarregando(false);
        }
    }


    useEffect(() => {

        carregarAuditoria();

    }, [inicio, fim, operacao]);


    const registrosFiltrados =
        useMemo(() => {

            const termo =
                busca
                    .trim()
                    .toLowerCase();


            if (!termo) {
                return registros;
            }


            return registros.filter(
                (registro) => {

                    const texto = [
                        registro.usuario_nome,
                        registro.perfil,
                        registro.operacao,
                        registro.recurso,
                        registro.recurso_id,
                        registro.detalhes
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();


                    return texto.includes(termo);
                }
            );

        }, [registros, busca]);


    function limparFiltros() {

        setBusca('');
        setOperacao('');
        setInicio('');
        setFim('');
    }


    return (

        <Box
            sx={{
                width: '100%',
                minHeight: '100%',
                p: 3
            }}
        >

            {/* =========================================
                CABEÇALHO
            ========================================= */}

            <Stack
                spacing={1}
                sx={{
                    mb: 3
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Auditoria
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    Histórico de operações realizadas
                    no sistema.
                </Typography>

            </Stack>


            {/* =========================================
                FILTROS
            ========================================= */}

            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    mb: 3
                }}
            >

                <Stack
                    direction={{
                        xs: 'column',
                        md: 'row'
                    }}
                    spacing={2}
                >

                    <TextField
                        fullWidth
                        label="Pesquisar"
                        placeholder="Usuário, operação, recurso..."
                        value={busca}
                        onChange={(event) =>
                            setBusca(
                                event.target.value
                            )
                        }
                    />


                    <FormControl
                        sx={{
                            minWidth: 180
                        }}
                    >

                        <InputLabel>
                            Operação
                        </InputLabel>

                        <Select
                            value={operacao}
                            label="Operação"
                            onChange={(event) =>
                                setOperacao(
                                    event.target.value
                                )
                            }
                        >

                            <MenuItem value="">
                                Todas
                            </MenuItem>

                            <MenuItem value="LOGIN_SUCESSO">
                                Login com sucesso
                            </MenuItem>

                            <MenuItem value="LOGIN_RECUSADO">
                                Login recusado
                            </MenuItem>

                            <MenuItem value="CRIAR">
                                Criar
                            </MenuItem>

                            <MenuItem value="EDITAR">
                                Editar
                            </MenuItem>

                            <MenuItem value="EXCLUIR">
                                Excluir
                            </MenuItem>

                        </Select>

                    </FormControl>


                    <TextField
                        type="date"
                        label="Data inicial"
                        InputLabelProps={{
                            shrink: true
                        }}
                        value={inicio}
                        onChange={(event) =>
                            setInicio(
                                event.target.value
                            )
                        }
                    />


                    <TextField
                        type="date"
                        label="Data final"
                        InputLabelProps={{
                            shrink: true
                        }}
                        value={fim}
                        onChange={(event) =>
                            setFim(
                                event.target.value
                            )
                        }
                    />


                    <button
                        type="button"
                        onClick={limparFiltros}
                        style={{
                            minWidth: '120px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            border: '1px solid #777',
                            background: 'transparent',
                            padding: '0 16px'
                        }}
                    >
                        Limpar
                    </button>

                </Stack>

            </Paper>


            {/* =========================================
                ERRO
            ========================================= */}

            {erro && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3
                    }}
                >
                    {erro}
                </Alert>

            )}


            {/* =========================================
                TABELA
            ========================================= */}

            <TableContainer
                component={Paper}
                elevation={3}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Data / Hora
                            </TableCell>

                            <TableCell>
                                Usuário
                            </TableCell>

                            <TableCell>
                                Perfil
                            </TableCell>

                            <TableCell>
                                Operação
                            </TableCell>

                            <TableCell>
                                Recurso
                            </TableCell>

                            <TableCell>
                                ID
                            </TableCell>

                            <TableCell>
                                Detalhes
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {carregando ? (

                            <TableRow>

                                <TableCell
                                    colSpan={7}
                                    align="center"
                                >
                                    Carregando auditoria...
                                </TableCell>

                            </TableRow>

                        ) : registrosFiltrados.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={7}
                                    align="center"
                                >

                                    <Typography
                                        sx={{
                                            py: 4
                                        }}
                                        color="text.secondary"
                                    >
                                        Nenhum registro
                                        encontrado.
                                    </Typography>

                                </TableCell>

                            </TableRow>

                        ) : (

                            registrosFiltrados.map(
                                (registro) => (

                                    <TableRow
                                        key={registro.id}
                                        hover
                                    >

                                        <TableCell>
                                            {formatarData(
                                                registro.criado_em
                                            )}
                                        </TableCell>


                                        <TableCell>
                                            {registro.usuario_nome ||
                                                'Não identificado'}
                                        </TableCell>


                                        <TableCell>

                                            <Chip
                                                label={
                                                    registro.perfil ||
                                                    '-'
                                                }
                                                size="small"
                                            />

                                        </TableCell>


                                        <TableCell>

                                            <Chip
                                                label={
                                                    registro.operacao ||
                                                    '-'
                                                }
                                                color={
                                                    corOperacao(
                                                        registro.operacao
                                                    )
                                                }
                                                size="small"
                                            />

                                        </TableCell>


                                        <TableCell>
                                            {registro.recurso ||
                                                '-'}
                                        </TableCell>


                                        <TableCell>
                                            {registro.recurso_id ||
                                                '-'}
                                        </TableCell>


                                        <TableCell
                                            sx={{
                                                maxWidth: 400
                                            }}
                                        >
                                            {registro.detalhes ||
                                                '-'}
                                        </TableCell>

                                    </TableRow>

                                )
                            )

                        )}

                    </TableBody>

                </Table>

            </TableContainer>


            {/* =========================================
                CONTADOR
            ========================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    mt: 2
                }}
            >
                {registrosFiltrados.length}
                {' '}
                registro(s) encontrado(s)
            </Typography>

        </Box>
    );
}


export default Auditoria;