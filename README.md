Projeto Angular - [Villle de verbes]

Este é um projeto desenvolvido com:
Node versão 22.14.0, [Angular](https://angular.io/),
 [spring boot ](https://spring.io/projects/spring-boot),
 [Mysql]( https://www.mysql.com/) focado em [ gamificação educativa de verbos no idioma francês.].
Backend desenvolvido com  Java Spring Boot  para fornecer API  REST 
que alimentam o frontend do projeto Ville de verbes com os  sujeitos, verbos, complementos e respostas esperadas .

===============================================================================================
Funcionalidades
- Interface responsiva com Tailwind CSS
- Componentes reutilizáveis com Angular
- Animações e lógica para perguntas/respostas
- Sistema de medalhas e troféus
- Navegação entre ambientes ( Casa, Parque, Universidade)

===============================================================================================
 Tecnologias Utilizadas no Front-end
- [Angular CLI](https://angular.io/cli)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- HTML5 & CSS3

************************************
Tecnologias Utilizadas utilizadas no back-end 
- Java 17
- Spring Boot
- Spring Data JPA
- MySQL
- Maven 
- Spring Security (se houver autenticação)
- Outros: [ JavaMail, MapStruct, etc.]

===============================================================================================

1-Instalação e Execução para rodar o projeto frontend localmente:

- Clone este repositório no terminal
git clone https://github.com/Jack1sn/villeverbes-front
-  Acesse a pasta do projeto
cd seu-repositorio-angular
-  Instale as dependências
npm install
Para  Rodar o projeto frontend
ng serve
Projeto  Java  - [Villle de verbes]


****************************************************
2-Instalação e Execução para rodar o projeto backend localmente:

Pré-requisitos:

- Java JDK 17 ou superior instalado
- MySQL instalado e configurado
- Maven 
- Banco de dados MySQL8


Clone o repositório no terminal:

git clone https://github.com/Jack1sn/backendv_verbes
cd seu-backend

 *************
  Manipulação dos dados
1- Criar um banco de dados utilizando sua senha e usuário local
2- Colocar o nome do banco de dados: bd_vverbes.	
3- Dentro do diretorio do backend, no arquivo villeverbes\src\main\resources\application.properties
	deve-se  "spring.datasource.password= " colocar sua senha do  MySQL local.

4- para rodar o backend, deve-se executar a classe principal do sistema, que está no diretorio
	villeverbes\src\main\java\br\net\villeverbes\VilleverbesApplication.java


================================================================================================================



