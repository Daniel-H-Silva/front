import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

// Delete
export const removerMembro = async (membroId) => {
  try {
    const response = await api.delete(`/membro/${membroId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao remover membro:', error.message);
    throw error;
  }
};


// Post

export const postRelatorio = async (idUsuario, idProjeto, nomeRelatorio, nomeProjeto) => {
  try {
    const response = await api.post('/reports', { idUsuario, idProjeto, nomeRelatorio, nomeProjeto });
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    throw error;
  }
};

export const registerUserService = async (nome, email, senha) => {
  try {
    const response = await api.post('/register', { nome, email, senha });
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    throw error;
  }
};

export const postProjeto = async (nomeProjeto, idGestor, objetivoProjeto, informacoesProjeto) => {
  try {
    const response = await api.post('/projects', {nomeProjeto, idGestor, objetivoProjeto, informacoesProjeto});
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    throw error;
  }
};

export const postTarefa = async (nomeTarefa, infoTarefa, idProjeto, idPercurso, idQuadro, idDesignado) => {
  try {
    const response = await api.post('/tasks', { nomeTarefa, infoTarefa, idProjeto, idPercurso, idQuadro, idDesignado });
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    throw error;
  }
};

export const postGrupo = async (idProjeto, idPercurso, nomeTabela) => {
  try {
    const response = await api.post('/grupo', { idProjeto, idPercurso, nomeTabela });
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    throw error;
  }
};

export const postPercurso = async (nomePercurso, idProjeto, dataInicial, dataFinal) => {
  try {
    await api.post('/novopercurso', { nomePercurso, idProjeto, dataInicial, dataFinal });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    throw error;
  }
};

export const postMembro = async (idProjeto, idUsuario) => {
  try {
    const response = await api.post('/projeto/add-membro', { idProjeto, idUsuario });
    return response;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    throw error;
  }
};

export const postBuscarMembro = async (nome, email) => {
  try {
    const response = await api.post('/busca-membros', { nome, email});
    return response;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    throw error;
  }
};

export const login = async (email, senha) => {
  try {
    const response = await api.post('/login', { email, senha });
    return response.data;
  } catch (error) {
    console.error('Erro no login:', error.message);
    throw error;
  }
};

// Put

export const updateGruposService = async (updates) => {
  try {
    await api.put(`/atualizarGrupos`, updates); 
  } catch (error) {
      console.error('Erro ao atualizar grupos:', error.message);
      throw error; 
  }
};

export const updateTarefasService = async (updates) => {
  try {
    await api.put(`/atualizarTarefas`, updates); 
  } catch (error) {
      console.error('Erro ao atualizar grupos:', error.message);
      throw error; 
  }
};

export const updateGrupo = async (grupoId, nomeGrupo) => {
  try {
    const response = await api.put(`/grupo-atualizado/${grupoId}`, {
      nomeGrupo: nomeGrupo
    });
    return response; 
  } catch (error) {
    console.error('Erro ao atualizar grupo:', error.message);
    throw error;
  }
};

export const updatePercurso = async (idPercurso, nomePercurso, dataFinal) => {
  try {
    const response = await api.put(`/percurso-atualizar/${idPercurso}`, {
      nomePercurso: nomePercurso,
      dataFinal: dataFinal
    });
    return response; 
  } catch (error) {
    console.error('Erro ao atualizar grupo:', error.message);
    throw error;
  }
};

export const updateTarefa = async (taskId, nomeTarefa, infoTarefa, idProjeto,idPercurso, idQuadro, idDesignado) => {
  try {
    const response = await api.put(`/percurso-atualizar/${taskId}`, {
      nomeTarefa: nomeTarefa,
      infoTarefa: infoTarefa,
      idProjeto: idProjeto,
      idPercurso: idPercurso,
      idQuadro: idQuadro,
      idDesignado: idDesignado
    });
    return response; 
  } catch (error) {
    console.error('Erro ao atualizar grupo:', error.message);
    throw error;
  }
};

export const updateProjeto = async (idProjet, nomeProjeto, objetivoProjeto, informacoesProjeto) => {
  try {
    const response = await api.put(`/project-alter/${idProjet}`, {
      nomeProjeto: nomeProjeto,
      objetivoProjeto: objetivoProjeto,
      informacoesProjeto: informacoesProjeto
    });
    return response; 
  } catch (error) {
    console.error('Erro ao atualizar grupo:', error.message);
    throw error;
  }
};

export const updateTarefaModalDesignado = async (idMembro, idGestor) => {
  try {
    const response = await api.put(`mod-desig-tesk/${idMembro}`, {
      idGestor: idGestor
    });
    return response; 
  } catch (error) {
    console.error('Erro ao atualizar grupo:', error.message);
    throw error;
  }
};

// Get

export const getNomeProjeto = async (id) => {
  try {
    const response = await api.get(`/projetoNome/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar nome do projeto:', error.message);
    throw error;
  }
};

export const getMembrosProjetos = async (id) => {
  try {
    const response = await api.get(`/project-members-initials/${id}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getMembrosProjet = async (idProjeto) => {
  try {
    const response = await api.get(`/project-members/${idProjeto}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getPercurso = async (id) => {
  try {
    const response = await api.get(`/project-percursos-det/${id}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getPercursoOptions = async (idProjeto) => {
  try {
    const response = await api.get(`/project-current-percurso/${idProjeto}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getGrupos = async (idPercurso) => {
  try {
    const response = await api.get(`percurso-grupo/${idPercurso}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getTarefasQuadro = async (idQuadro) => {
  try {
    const response = await api.get(`quadro-tarefas/${idQuadro}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getTarefasUsuario = async (userId) => {
  try {
    const response = await api.get(`user-tasks/${userId}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getTarefas = async (userId) => {
  try {
    const response = await api.get(`tasks/${userId}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getNomePercurso = async (idPercurso) => {
  try {
    const response = await api.get(`nomePercurso/${idPercurso}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getProjetoGestorUsuario = async (userId) => {
  try {
    const response = await api.get(`/user-projects-gestor/${userId}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getProjetoUsuario = async (userId) => {
  try {
    const response = await api.get(`/user-projects/${userId}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getProjeto = async (userId) => {
  try {
    const response = await api.get(`/projects/${userId}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getRelatorioUsuario = async (userId) => {
  try {
    const response = await api.get(`user-reports/${userId}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getPercursoAberto = async (idProjeto) => {
  try {
    const response = await api.get(`percursoAberto/${idProjeto}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getGruposQuadro = async (idProjeto, percurso) => {
  try {
    const response = await api.get(`project-percurso-quadros/${idProjeto}/${percurso}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getTodosUsuarios = async (userId) => {
  try {
    const response = await api.get(`user-all-projects/${userId}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getModalPercurso = async (projetoId) => {
  try {
    const response = await api.get(`project-percursos-modal/${projetoId}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getNomesPercursos = async (idProjeto,idPercurso) => {
  try {
    const response = await api.get(`PROJETO_PERCURSO-nomes/${idProjeto}/${idPercurso}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getMembro = async (IdProjeto) => {
  try {
    const response = await api.get(`membro/${IdProjeto}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error.message);
    throw error;
  }
};

export const getInfoProjeto = async (idProjet) => {
  try {
    const response = await api.get(`project-info/${idProjet}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar informações do projeto:', error.message);
    throw error;
  }
};

export const getInfoTarefas = async (taskId) => {
  try {
    const response = await api.get(`detalhesTarefas/${taskId}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar informações da tarefa:', error.message);
    throw error;
  }
};

export const getInfoPercurso = async (idPercurso) => {
  try {
    const response = await api.get(`percurso-info/${idPercurso}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar informações do percurso:', error.message);
    throw error;
  }
};

export const getNomeGrupo = async (grupoId) => {
  try {
    const response = await api.get(`grup-name/${grupoId}`);
    return response;
  } catch (error) {
    console.error('Erro ao buscar o nome do grupo:', error.message);
    throw error;
  }
};