<br/>
<p align="center">

  <h3 align="center">Snake IA</h3>

</p>

## Conteúdo
- [Conteúdo](#conteúdo)
- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Links](#links)
- [Licença](#licença)
- [Autores](#autores)
- [Referencias](#referencias)

## Sobre o projeto

Este projeto implementa o algoritmo Q-Learning para treinar um agente em um jogo inspirado no clássico 'Snake'. O Q-Learning é uma técnica de aprendizado por reforço que permite que um agente aprenda a tomar decisões ótimas em um ambiente desconhecido, maximizando uma recompensa cumulativa ao longo do tempo.

O jogo consiste em um agente (cobra) que precisa coletar frutas evitando colidir com seu próprio corpo ou as bordas do tabuleiro. O agente utiliza o Q-Learning para aprender a escolher ações que maximizem sua pontuação.

## Funcionalidades

- **Estado do Jogo**: O estado atual do jogo é representado pela posição do jogador, da fruta e da trilha.
- **Ações Disponíveis**: As ações disponíveis para o agente são 'up', 'down', 'left' e 'right'.
  
- **Tabela Q**: A tabela Q é utilizada para armazenar o valor de ação para cada par de estado e ação possível.
  
- **Atualização da Tabela Q**: A tabela Q é atualizada usando a equação Q-Learning: Q(s, a) = Q(s, a) + α [r + γ max Q(s', a') - Q(s, a)], onde α é a taxa de aprendizado, γ é o fator de desconto, r é a recompensa instantânea, s é o estado atual, a é a ação tomada, e s' é o próximo estado.
  
- **Treinamento e Execução**: O projeto oferece métodos para treinar o agente usando o Q-Learning e executar o agente treinado para jogar o jogo.

## Links

 - Aplicação [Snake IA](https://snakev1.netlify.app/)
 - Video [YouTube]()

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para obter mais informações.


## Autores

* **Rodrigo Santana Camargo** - *Comp Sci Student* - [Rodrigo Santana Camargo](https://github.com/ShaanCoding/) - **
* **Tiago Alves de Farias** - *Comp Sci Student* - [Tiago Alves de Farias](https://github.com/Phewrys/) - **

## Referencias

* [ShaanCoding](https://github.com/ShaanCoding/)
* [Othneil Drew](https://github.com/othneildrew/Best-README-Template)
* [ImgShields](https://shields.io/)
