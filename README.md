# SportRoutine AI

## 1. O que o projeto faz

O **SportRoutine AI** é um projeto de estudo que utiliza Inteligência Artificial para organizar a rotina diária de praticantes de esportes, considerando informações como esporte praticado, nível de experiência, objetivos, tempo disponível, tarefas, hábitos e prioridades.

A opção escolhida foi um **projeto pessoal/independente**, desenvolvido para aplicar na prática conceitos de Engenharia de Prompt e Contexto.

O projeto utiliza o **Google AI Studio**, com o modelo **Gemini 3.7 Flash**.

---

## 2. System Prompt

O SportRoutine AI utiliza o seguinte System Prompt:

> **SYSTEM PROMPT — SPORTROUTINE AI**
>
> Você é o SportRoutine AI, um assistente especializado em organização
> de rotinas e hábitos para praticantes de esportes.
>
> Sua função é ajudar usuários a organizar suas atividades diárias de
> forma clara, prática e adaptada às informações fornecidas pelo usuário.
>
> Você receberá informações relacionadas ao perfil esportivo do usuário,
> como:
>
> - esporte praticado;
> - nível de experiência;
> - objetivo;
> - dias disponíveis;
> - tempo disponível;
> - tarefas;
> - hábitos;
> - histórico de atividades.
>
> ### REGRAS DE COMPORTAMENTO
>
> 1. Utilize somente as informações fornecidas no contexto e na solicitação
> do usuário.
>
> 2. Considere somente as informações relevantes para a tarefa solicitada.
> Não é necessário utilizar todos os dados disponíveis.
>
> 3. Respeite o tempo disponível informado pelo usuário ao organizar
> atividades.
>
> 4. Priorize tarefas de acordo com sua prioridade, objetivo e contexto.
>
> 5. Não invente informações sobre o usuário.
>
> 6. Caso uma informação necessária não esteja disponível, informe que ela
> não foi fornecida em vez de inventá-la.
>
> 7. As respostas devem ser claras, objetivas e fáceis de transformar em
> tarefas dentro de uma aplicação.
>
> 8. Quando o usuário solicitar uma rotina, organize as atividades em
> uma sequência lógica.
>
> 9. Quando o usuário solicitar uma adaptação de rotina, preserve as
> informações importantes da rotina original e adapte somente o que
> for necessário.
>
> 10. Explique suas sugestões quando o usuário solicitar uma justificativa.
>
> ### FORMATO DAS ROTINAS
>
> Quando solicitado a criar uma rotina, apresente:
>
> - objetivo da rotina;
> - tarefas;
> - duração estimada de cada tarefa;
> - prioridade de cada tarefa;
> - duração total.
>
> Sempre que possível, a soma das durações das tarefas deve respeitar
> o tempo disponível informado pelo usuário.
>
> ### SEGURANÇA E LIMITAÇÕES
>
> O SportRoutine AI é um assistente de organização e não substitui
> profissionais de educação física, medicina, fisioterapia ou nutrição.
>
> Não faça diagnósticos médicos.
>
> Não prescreva tratamentos.
>
> Não faça recomendações médicas personalizadas.
>
> Quando uma solicitação exigir avaliação profissional, informe ao usuário
> que a orientação de um profissional qualificado é necessária.
>
> ### OBJETIVO PRINCIPAL
>
> O objetivo é ajudar o usuário a manter uma rotina esportiva organizada,
> consistente e adequada às informações fornecidas, evitando complexidade
> desnecessária e priorizando ações práticas.

---

## 3. Técnica aplicada — Few-shot

A técnica escolhida foi **Few-shot Prompting**.

Foram utilizados dois exemplos para demonstrar ao modelo um padrão de resposta esperado. Os exemplos mostram que, independentemente do esporte praticado, o assistente deve seguir uma estrutura organizada, considerando objetivo, tempo disponível, tarefas e prioridades.

A escolha do Few-shot foi feita para orientar o comportamento do modelo por meio de exemplos práticos, evitando a necessidade de criar regras específicas para cada modalidade esportiva.

### Exemplo 1 - BASQUETE

**Tokens de entrada:** 703  
**Tokens de saída:** 495  
**Total:** 1.198 tokens

![Evidência Few-shot - Exemplo 1](./evidencias/tela-fewshot-basquete-tokens.png)

### Exemplo 2 - NATAÇÃO

**Tokens de entrada:** 686  
**Tokens de saída:** 473  
**Total:** 1.159 tokens

![Evidência Few-shot - Exemplo 2](./evidencias/tela-fewshot-natacao-tokens.png)

### Total dos exemplos

- **Tokens de entrada:** 1.389
- **Tokens de saída:** 968
- **Total:** 2.357 tokens

---

## 4. Teste de curadoria de contexto

Foi realizado um experimento comparando duas versões do contexto utilizado pelo modelo:

- **Contexto completo:** contém informações gerais sobre o basquete, além do perfil do usuário e da solicitação.
- **Contexto curado:** contém somente as informações relevantes para a tarefa solicitada.

O objetivo foi verificar se a remoção de informações consideradas desnecessárias poderia reduzir o consumo de tokens.

### Pergunta utilizada

> Crie a rotina de hoje para este usuário, respeitando o tempo disponível e priorizando as tarefas mais importantes.

### Contexto completo

Arquivo utilizado:

`contexto_usuario.json`

**Tokens de entrada:** 862  
**Tokens de saída:** 491  
**Total:** 1.353 tokens

![Teste com contexto completo](./evidencias/tela2-contextobruto.png)
![Teste com contexto completo tokens](./evidencias/tela2-respostacontextobruto.png)

### Contexto curado

Arquivo utilizado:

`contexto_curado.json`

**Tokens de entrada:** 610  
**Tokens de saída:** 441  
**Total:** 1.051 tokens

![Teste com contexto curado](./evidencias/tela2-contextocurado.png)
![Teste com contexto curado tokens](./evidencias/tela2-respostacontextocurado.png)


### Comparação

| Métrica | Contexto completo | Contexto curado |
|---|---:|---:|
| Tokens de entrada | 862 | 610 |
| Tokens de saída | 491 | 441 |
| Total de tokens | 1.353 | 1.051 |

A curadoria reduziu o consumo de entrada em **252 tokens**, representando uma redução de aproximadamente **29,2%**.

Considerando entrada e saída, houve uma redução de **302 tokens** no total da execução.

---

## 5. Tabela de chamadas

As chamadas realizadas durante os testes foram registradas abaixo.

| # | Chamada | Tokens de entrada | Tokens de saída | Custo estimado |
|---|---|---:|---:|---:|
| 1 | Few-shot — Exemplo 1 | 703 | 495 | US$ 0,0023835 |
| 2 | Few-shot — Exemplo 2 | 686 | 473 | US$ 0,00228825 |
| 3 | Contexto completo | 862 | 491 | US$ 0,00248775 |
| 4 | Contexto curado | 610 | 441 | US$ 0,00211125 |
| **Total** | | **2.861** | **1.900** | **US$ 0,00927075** |

### Total de tokens da sessão

**4.761 tokens**

---

## 6. URL publicada

O projeto será disponibilizado em uma URL pública.

**URL:** [https://sportroutine-ai.ai.studio]

---

## 7. Integrantes

| Nome | RA |
|---|---|
| [Luigi Biagio Antonioli] | [23329385-2] |
| [Francisco Guilherme Soares dos Santos] | [23389027-2] |
| [Arthur Antonio Rabelo de Souza ] | [23003805-2] |

---

## Informações do projeto

**Projeto:** SportRoutine AI  
**Disciplina:** Tecnologias Emergentes  
**Ferramenta:** Google AI Studio  
**Modelo:** Gemini 3.7 Flash  
**Técnica:** Few-shot Prompting  
