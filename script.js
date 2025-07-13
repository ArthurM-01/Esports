const apiKeyInput = document.getElementById("apiKey")
const gameSelect = document.getElementById("gameSelect")
const questionInput = document.getElementById("questionInput")
const askButton = document.getElementById("askButton")
const aiResponse = document.getElementById("aiResponse")
const form = document.getElementById("form")

const markdownToHTML = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}


const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash"
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  
  const perguntaLOL = ` 
    ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}.

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
    - Considere a data atual ${new Date().toLocaleDateString('pt-BR')}
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda itens que você não tenha certeza de que existe no patch atual.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    pergunta do usuário: Melhor build rengar jungle
    resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n

    ---
    Aqui está a pergunta do usuário: ${question}
  `

  const perguntaValorant = ` 
    ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}.

    ## Tarefa
    Você deve responder às perguntas do usuário com base no seu conhecimento de Agentes, mapas, estratégias, táticas, composições de equipe e dicas específicas do Valorant.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
    - Considere a data atual: ${new Date().toLocaleDateString('pt-BR')}.
    - Faça pesquisas atualizadas sobre o **patch atual** do Valorant, baseado na data atual, para dar uma       resposta coerente e alinhada com o meta.
    - Nunca responda itens que você não tenha certeza de que existe no patch atual (ex: Agentes removidos, mudanças de balanceamento não implementadas).

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo **500 caracteres**.
    - Responda em **markdown**.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    pergunta do usuário: Melhor Agente para Ascent
    resposta: Para Ascent, \n\n**Agentes:**\n\n coloca os agentes aqui. \n\n**Jett, Omen:**\n\nsão fortes devido à sua mobilidade e controle. Sova também é excelente para coleta de informações.

    ---
    Aqui está a pergunta do usuário: ${question}
  `

  const perguntaCSGO = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}.

    ## Tarefa
    Você deve responder às perguntas do usuário com base no seu conhecimento de mapas, estratégias, economia, armas, utilitários (granadas) e dicas específicas do CS:GO.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
    - Considere a data atual: ${new Date().toLocaleDateString('pt-BR')} do CS:GO antes da transição para o CS2, que foi por volta de **setembro de 2023**. Todas as informações devem ser baseadas no estado do jogo **antes** da chegada do CS2.
    - Não faça referência a funcionalidades, armas ou mapas que são exclusivos do CS2.
    - Nunca responda itens que você não tenha certeza de que existiam no CS:GO antes de sua substituição.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo **500 caracteres**. 
    - Responda em **markdown**.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

  
    ## Exemplo de resposta 
    pergunta do usuário: Melhor smoke para B na Mirage 
    resposta: Para B na Mirage (CS:GO), a smoke mais comum é a que cobre a entrada do apartamento, vinda do meio.    
    Isso isola os defensores e permite a entrada do time. Outra importante é a smoke da janela do mercado para defender a entrada.

    ---
    Aqui está a pergunta do usuário: ${question}
  `

  const perguntaFragpunk = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo ${game}.

    ## Tarefa
    Você deve responder às perguntas do usuário com base no seu conhecimento de Agentes (Heróis), cartas de modificação (Cards), armas, mapas, estratégias e dicas específicas do FragPunk.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
    - Considere a data atual: ${new Date().toLocaleDateString('pt-BR')}.
    - Faça pesquisas atualizadas sobre o **patch/temporada atual** do FragPunk, baseado na data atual, para dar uma resposta coerente e alinhada com o meta.
    - Nunca responda itens que você não tenha certeza de que existe no patch atual (ex: Heróis ou Cards que foram removidos ou balanceados).

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo **500 caracteres**.
    - Responda em **markdown**.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    pergunta do usuário: Qual a melhor estratégia com o Card "Bala Explosiva"?
    resposta: O Card "Bala Explosiva" é excelente para controle de área e dano em grupo. Combine-o com Heróis que possam forçar agrupamentos de inimigos ou que tenham habilidades de supressão. Utilize em pontos de estrangulamento para maximizar o impacto.

    ---
    Aqui está a pergunta do usuário: ${question}
  `

  const perguntaAssasinsCreed = `
    ## Especialidade
    Você é um especialista assistente de meta e guia para o jogo ${game}.

    ## Tarefa
    Você deve responder às perguntas do usuário com base no seu conhecimento de história (lore), exploração do mundo aberto, missões principais e secundárias, combate, árvores de habilidades, equipamentos (armas e armaduras), assentamento (Ravensthorpe) e dicas de progressão específicas do Assassin's Creed Valhalla.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
    - Considere a data atual: ${new Date().toLocaleDateString('pt-BR')}.
    - Faça pesquisas atualizadas sobre o **último patch ou DLC** do Assassin's Creed Valhalla, baseado na data atual, para dar uma resposta coerente e alinhada com o estado final do jogo.
    - Nunca responda itens que você não tenha certeza de que existe no jogo ou em seus DLCs oficiais.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo **500 caracteres**.
    - Responda em **markdown**.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    pergunta do usuário: Qual a melhor build para combate com duas armas leves?
    resposta: Para combate com duas armas leves em Assassin's Creed Valhalla, foque na árvore de habilidades "Corvo" para furtividade e "Urso" para dano. Use habilidades como "Ataque Furioso" e "Arremesso de Machado". Combine Adagas ou Espadas Leves com runas de dano corpo a corpo.

    ---
    Aqui está a pergunta do usuário: ${question}
  `

  let pergunta = ''
  
    if (game == 'valorant') {
      pergunta = perguntaValorant
    } 
    else if (game == 'lol') {
      pergunta = perguntaLOL
    }
     else if (game == 'csgo') {
      pergunta = perguntaCSGO
     } 
     else if (game == 'fragpunk') {
      pergunta = perguntaFragpunk
     }
     else if (game == 'assasins creed valhalla') {
      pergunta = perguntaAssasinsCreed
     }
     else {
      pergunta = "Desculpe, o jogo especificado não é suportado no momento. Por favor, especifique um dos jogos que eu conheço: Valorant, League of Legends, CS:GO, FragPunk ou Assassin's Creed Valhalla."
     }
     
  const contents = [{
    role: "user",
    parts: [{
      text: pergunta
    }]
  }]

  const tools = [{
    google_search: {}
  }]

  // chamda API
  const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      tools
    })
  })

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

  if (apiKey == "" || game == "" || question == "") {
    alert("Por favor, preencha todos os campos")
    return
  }

  askButton.disabled = true
  askButton.textContent = "Perguntando..."
  askButton.classList.add("loading")

  try {
    // perguntar para a IA
    const text = await perguntarAI(question, game, apiKey)
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
    aiResponse.classList.remove("hidden")
  } catch(error) {
    console.log("Erro:", error)
  } finally {
    askButton.disabled = false
    askButton.textContent = "Perguntar"
    askButton.classList.remove("loading")
  }

}
form.addEventListener("submit", enviarFormulario)