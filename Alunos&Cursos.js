const express = require("express")
const alunosCurso = express()
alunosCurso.use(express.json())

let alunos = []
let cursos = []
let matriculas = []
let alunosId = 1
let cursosId = 1

const validaAlunos = (aluno) => {
    const erros = [];
    if (!aluno.nome || aluno.nome.length < 3 || aluno.nome.length > 100) {
        erros.push("O aluno deve coneter um nome entre 3 e 100 caracteres.");
    }
    if (!aluno.email || aluno.email.length < 3 || aluno.email.length > 100) {
        erros.push("O aluno deve coneter um email entre 3 e 100 caracteres.");
    }
    if (!aluno.email.includes('@') || !aluno.email.split('@')[1].includes('.')) {
        erros.push("O email deve conter '@' e '.' após o '@'");
    }
    return erros;
};

const validaCursos = (curso) => {
    const erros = [];
    if (!curso.nome || curso.nome.length < 3 || curso.nome.length > 100) {
        erros.push("O curso deve coneter um nome entre 3 e 100 caracteres.");
    }
    return erros;
};

alunosCurso.get('/alunos', (req,res) =>{
    res.json(alunos)
})

alunosCurso.post('/alunos', (req, res) => {
    const erros = validaAlunos(req.body)
    if(erros.length > 0){
        return res.status(404).json({erros})
    }
    const novoAluno = {id: alunosId++, ...req.body}
    alunos.push(novoAluno)
    res.status(201).json({message: "Aluno cadastrado com sucesso"})
})

alunosCurso.get('/cursos', (req,res) =>{
    res.json(cursos)
})

alunosCurso.post('/cursos', (req, res) => {
    const erros = validaCursos(req.body)
    if(erros.length > 0){
        return res.status(404).json({erros})
    }
    const novoCurso = {id: cursosId++, ...req.body}
    cursos.push(novoCurso)
    res.status(201).json({message: "Curso cadastrado com sucesso"})
})

alunosCurso.post('/matricula', (req, res) => {
    const {alunosId, cursoId} = req.body
    const aluno = alunos.find((a) => a.id === alunosId)
    const curso = cursos.find((c) => c.id === cursoId)

    // Verifica se existem
    if(!aluno){
        return res.status(404).json("Alno não encontrado")
    }
    if(!curso){
        return res.status(404).json("Curso não encontrado")
    }

     // Verifica se já está matriculado
    const jaMatriculado = matriculas.find(
        (mat) => mat.alunosId === alunosId && mat.cursoId === cursoId
    );
    if (jaMatriculado) {
        return res.status(400).json({ error: "Aluno já matriculado neste curso." });
    }

    matriculas.push({ alunosId, cursoId });
    res.status(201).json({ message: "Matrícula realizada com sucesso." });
})

// Lista os cursos nos quais um aluno está matriculado
alunosCurso.get('/alunos/:id/cursos', (req, res) => {
    const alunosId = parseInt(req.params.id);
    const aluno = alunos.find((a) => a.id === alunosId);

    if (!aluno) {
        return res.status(404).json({ error: "Aluno não encontrado." });
    }

    const cursosDoAluno = matriculas
        .filter((mat) => mat.alunosId === alunosId)
        .map((mat) => cursos.find((c) => c.id === mat.cursosId));

    res.json(cursosDoAluno);
});

alunosCurso.get('/cursos/:id/estudantes', (req, res) => {
    const cursosId = parseInt(req.params.id);
    const curso = cursos.find((c) => c.id === cursosId);

    if (!curso) {
        return res.status(404).json({ erro: "Curso não encontrado." });
    }

    const alunosCurso = matriculas
        .filter((m) => m.cursosId === cursosId)
        .map((m) => alunos.find((a) => a.id === m.alunosId));

    res.json(alunosCurso);
});

alunosCurso.listen(3000, () => {
    console.log("Servidor aberto na porta 3000");
});
