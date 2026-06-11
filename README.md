*Leia em: [Português](#senac-hc-mobile-gestão-de-horas-complementares) | [English](#senac-hc-mobile-complementary-hours-management)*

---

# SENAC HC Mobile: Gestão de Horas Complementares

> Um aplicativo mobile desenvolvido em React Native e Expo para o gerenciamento e envio de horas complementares (atividades acadêmico-científico-culturais) de alunos de graduação do Senac. Desenvolvido como Projeto Integrador para o **Curso de Tecnologia em Análise e Desenvolvimento de Sistemas** do **Centro Universitário Senac**.

[![Licença](https://img.shields.io/badge/licenca-MIT-green)](LICENSE)
[![Senac](https://img.shields.io/badge/Instituicao-Senac-blue)](https://www.sp.senac.br/)
[![Conformidade LGPD](https://img.shields.io/badge/Conformidade-LGPD%20Ready-blueviolet)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)

---

## Visão Geral do Projeto

O **SENAC HC Mobile** é o aplicativo móvel do ecossistema digital SENAC HC, projetado especificamente para que os estudantes possam enviar, acompanhar e controlar suas horas complementares de maneira fácil e prática a partir de seus dispositivos móveis. Através do aplicativo, os discentes podem fazer o envio de novos certificados via câmera ou arquivos locais, visualizar em tempo real o progresso percentual de suas horas aprovadas (por meio de gráficos circulares) e conferir o andamento detalhado e o status de cada solicitação.

### Funcionalidades Principais

* **Visualização Intuitiva de Progresso:** Dashboard com gráfico circular mostrando o progresso de horas aprovadas versus necessárias, além de detalhamento por categorias (Ensino, Pesquisa, Extensão).
* **Envio Facilitado de Certificados:** Upload rápido de comprovantes digitais (PDF ou imagem) a partir da câmera do celular ou da galeria de fotos do dispositivo.
* **Histórico Detalhado:** Acompanhamento do status de cada solicitação (Pendente, Aprovado, Rejeitado) e visualização de observações enviadas pela coordenação.
* **Alternância de Cursos:** Suporte para discentes com múltiplas matrículas ativas, permitindo alternar de forma transparente entre regras e painéis de diferentes cursos.
* **Segurança e Persistência:** Sessão segura gerenciada via AsyncStorage e autenticação baseada em tokens JWT.

---

## LGPD & Privacidade de Dados (Lei Geral de Proteção de Dados)

Por processar dados pessoais cadastrais dos discentes (como nome, RA, e-mail e vínculo de curso) e armazenar documentos comprobatórios que contêm informações pessoais e de terceiros (certificados de cursos, palestras e eventos), o aplicativo móvel do SENAC HC adota princípios de privacidade por design, em estrita conformidade com a Lei Federal nº 13.709/2018 (LGPD).

### Padrões de Privacidade Implementados:

* **Base Legal para Tratamento (Art. 7º, V & XI):** O tratamento dos dados dos usuários e o envio de certificados são amparados pela execução de contrato (serviços educacionais prestados pela instituição de ensino), sendo essenciais para a apuração e validação do cumprimento das obrigações curriculares do aluno.
* **Minimização e Segurança:** O aplicativo solicita apenas dados pertinentes à validação da carga horária. O envio e processamento dos comprovantes em PDF ou imagens são feitos de maneira criptografada para a API backend, garantindo que somente os agentes autorizados (Coordenadores e Administradores) tenham acesso aos documentos para auditoria acadêmica.
* **Direitos do Titular (Art. 18):** O estudante tem controle total de suas informações diretamente no aplicativo móvel:
  * Confirmação da existência de tratamento e consulta aos dados de progresso e informações cadastrais.
  * Correção de dados incorretos, desatualizados ou incompletos.
  * Transparência total sobre quais certificados foram enviados e seu respectivo processamento.
* **Segurança da Informação (Art. 46):** Toda a comunicação com a API backend é realizada sob protocolo seguro (HTTPS) com autorização via tokens JWT de expiração controlada. Os dados sensíveis de autenticação (como senhas) são tratados sob técnicas de hash seguras no backend, e a sessão local no celular é protegida através de armazenamento seguro local.

---

## Tecnologias Utilizadas (Mobile)

* **Framework Principal:** React Native com Expo (v54.0.35)
* **Navegação:** React Navigation (Navegação baseada em Abas e Pilhas)
* **Comunicação de Rede:** Axios com interceptores de requisição (inclusão automática de token JWT)
* **Persistência de Estado Local:** AsyncStorage
* **Interface e Estilização:** Componentes nativos estilizados com StyleSheet, `react-native-circular-progress` para gráficos de progresso e `@expo/vector-icons` para ícones do sistema.

---

## Configuração e Execução Local (Desenvolvimento)

Siga os passos abaixo para configurar e executar o aplicativo móvel localmente.

### 1. Pré-requisitos
Certifique-se de possuir instalado em sua máquina:
* **Node.js** (v18.0.0 ou superior)
* **Git**
* Gerenciador de pacotes **npm** (incluso com o Node.js)
* Aplicativo **Expo Go** instalado em seu dispositivo móvel (Android ou iOS) para testar fisicamente, ou um emulador configurado (Android Studio ou Xcode Simulator).

### 2. Configuração (`axiosConfig.js`)
Para comunicar-se com a API de backend, configure o endereço IP correto do servidor no arquivo [axiosConfig.js](file:///c:/Users/Joelson/Desktop/Residencia%20Mobile/hc_frontMobile/src/api/axiosConfig.js). Por padrão, ele tenta ler de `process.env.EXPO_PUBLIC_API_URL` ou utiliza o IP local padrão configurado. Certifique-se de que o dispositivo móvel ou emulador esteja na mesma rede local que a máquina rodando o backend.

### 3. Setup e Inicialização
Abra o terminal no diretório raiz do frontend móvel (`hc_frontMobile`):

```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar o servidor de desenvolvimento do Expo
npm run start
```

Após o início, um QR Code será exibido no terminal e/ou no painel do Expo.
* **Para testar no celular físico:** Abra a câmera (iOS) ou o app **Expo Go** (Android) e escaneie o QR Code.
* **Para testar no emulador:** Pressione `a` no terminal para rodar no emulador Android ou `i` para rodar no simulador iOS.

---

## Telas & Fluxo de Navegação

* **Tela de Login (`LoginScreen.js`):** Ponto de entrada do aplicativo, permitindo que os discentes realizem autenticação segura por meio de e-mail e senha cadastrados.
* **Esqueci minha Senha (`ForgotPasswordScreen.js`):** Interface para solicitar uma redefinição de senha, que dispara um e-mail com novas credenciais a partir do backend.
* **Painel Inicial (`HomeScreen.js`):** Dashboard com o gráfico de progresso das horas válidas do curso selecionado, resumo detalhado de horas por categorias (Ensino, Pesquisa, Extensão), contadores rápidos de solicitações por status (Pendente, Aprovado, Rejeitado), além de um modal para trocar de curso em contas com mais de uma matrícula.
* **Lista de Certificados (`CertificateListScreen.js`):** Histórico completo de envios realizados, apresentando detalhes de cada comprovante (nome do evento, data de envio, carga horária solicitada e computada, status de validação, observações e curso associado).
* **Envio de Comprovante (`UploadProofScreen.js`):** Primeira etapa do fluxo de submissão, permitindo que o aluno tire uma foto do certificado usando a câmera do celular ou selecione um arquivo de imagem/PDF a partir do seletor de documentos.
* **Detalhes da Atividade (`NewActivityScreen.js`):** Segunda etapa do fluxo, onde o aluno preenche os metadados do certificado (título, carga horária e a regra correspondente).
* **Seleção de Curso (`CourseSelectionScreen.js`):** Última etapa do envio, utilizada para indicar para qual(is) curso(s) o aluno deseja direcionar as horas complementares daquela atividade.

---

## Melhorias Futuras

* **Notificações Push:** Envio de alertas em tempo real no dispositivo quando o status de um certificado for alterado pela coordenação.
* **Suporte Offline com Cache Local:** Armazenamento local de informações de progresso do aluno para acesso offline sem dependência de internet ativa.
* **Visualização Integrada de Documentos:** Pré-visualização nativa dos PDFs ou imagens dos certificados diretamente na tela de detalhes do aplicativo.
* **Suporte a Dark Mode:** Implementação de tema escuro dinâmico para maior conforto visual e acessibilidade.

---

## Autores & Equipe do Projeto

* **Homero Flávio**
* **Joelson José**
* **Kallyne Melo**
* **Lucas Ximenes**
* **Marcelly Arcanjo**
* **Nicollas Abrão**
* **Thayanne Rodrigues**

---
---

# SENAC HC Mobile: Complementary Hours Management

> A mobile application developed in React Native and Expo for managing and submitting complementary hours (academic, scientific, and cultural activities) for Senac undergraduate students. Developed as a Capstone Project (*Projeto Integrador*) for the **Systems Analysis and Development Program** at **Senac College**.

[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Senac](https://img.shields.io/badge/Institution-Senac%20College-blue)](https://www.sp.senac.br/)
[![LGPD Compliance](https://img.shields.io/badge/Compliance-LGPD%20Ready-blueviolet)](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)

---

## Project Overview

**SENAC HC Mobile** is the mobile app of the digital ecosystem SENAC HC, specifically designed to empower students to submit, track, and monitor their complementary hours easily and conveniently from their mobile devices. Through the app, students can upload new certificates using their phone's camera or local files, view their approved hours progress in real-time (via circular charts), and check the detailed status of each request.

### Key Features

* **Intuitive Progress Tracking:** A dashboard featuring a circular progress bar showing approved hours against required hours, plus category-specific breakdowns (Teaching, Research, Extension).
* **Easy Certificate Upload:** Quick upload of digital certificates (PDF or image) using the mobile device's camera or local document/photo gallery.
* **Detailed Submission History:** Track the validation progress of each request (Pending, Approved, Rejected) and view comments sent by the academic coordination.
* **Course Switcher:** Full support for students with multiple active course enrollments, allowing seamless switching between course rules and dashboards.
* **Security & Session Persistence:** Secure local session management handled via AsyncStorage and authenticated using JWT tokens.

---

## LGPD & Data Privacy Compliance (Lei Geral de Proteção de Dados)

Because this application processes personal registration details of students (such as name, academic record/RA, email, and course enrollment) and stores supporting documents containing personal information (certificates of courses, lectures, and events), the SENAC HC mobile application adopts privacy by design principles, in strict compliance with Brazilian Federal Law nº 13.709/2018 (LGPD).

### Implemented Privacy Standards:

* **Legal Basis for Processing (Art. 7, V & XI):** Processing user registration data and uploading certificates are grounded on the performance of a contract (educational services agreement between the student and the educational institution), being essential for verifying and validating the completion of curriculum requirements.
* **Data Minimization & Security:** The application only requests data strictly necessary for validation. Uploaded certificates (PDFs or images) are sent securely to the backend API, ensuring that only authorized agents (Coordinators and Administrators) can access the documents for academic auditing.
* **User Rights Panel (Art. 18):** Students have full control of their information directly from the mobile app:
  * Access and confirmation of the existence of data processing regarding their academic progress and profile.
  * Correction of incomplete, inaccurate, or outdated records.
  * Full transparency regarding all submitted certificates and their corresponding validation process.
* **Security (Art. 46):** All API communications are performed under secure protocols (HTTPS) authorized by JWT (JSON Web Tokens) with controlled expiration. Sensitive authentication credentials (passwords) are securely hashed on the backend, and local session data is protected via secure storage on the device.

---

## Tech Stack (Mobile)

* **Main Framework:** React Native with Expo (v54.0.35)
* **Navigation:** React Navigation (Tab-based and Stack-based navigation flow)
* **Network Communication:** Axios with request interceptors (automatically attaching the JWT token)
* **Local State Persistence:** AsyncStorage
* **UI & Styling:** Native components styled via StyleSheet, `react-native-circular-progress` for charts, and `@expo/vector-icons` for application icons.

---

## Getting Started (Local Development)

Follow the steps below to configure and run the mobile application locally.

### 1. Prerequisites
Ensure you have installed on your machine:
* **Node.js** (v18.0.0 or higher)
* **Git**
* Package manager **npm** (included with Node.js)
* **Expo Go** app installed on your physical mobile device (Android or iOS) for physical testing, or a configured emulator (Android Studio or Xcode Simulator).

### 2. Configuration (`axiosConfig.js`)
To connect with the backend API, configure the server IP address in the [axiosConfig.js](file:///c:/Users/Joelson/Desktop/Residencia%20Mobile/hc_frontMobile/src/api/axiosConfig.js) file. By default, it reads from `process.env.EXPO_PUBLIC_API_URL` or falls back to a local machine IP. Make sure your mobile device or emulator is on the same local network as the computer running the backend server.

### 3. Setup and Execution
Open a terminal in the mobile frontend root directory (`hc_frontMobile`):

```bash
# 1. Install project dependencies
npm install

# 2. Start Expo development server
npm run start
```

Once started, a QR Code will be printed in the terminal and/or the Expo Developer Tools.
* **To test on a physical phone:** Open the camera app (iOS) or the **Expo Go** app (Android) and scan the QR Code.
* **To test on an emulator:** Press `a` in the terminal for the Android emulator or `i` for the iOS simulator.

---

## Screens & Navigation Flow

* **Login Screen (`LoginScreen.js`):** Entry point of the application, permitting students to securely authenticate using their email and password.
* **Forgot Password Screen (`ForgotPasswordScreen.js`):** Interface to request a password reset, triggering an automated email containing new credentials from the backend.
* **Dashboard Screen (`HomeScreen.js`):** Main view showing a circular progress chart of the student's valid hours, category-specific hour progress (Teaching, Research, Extension), quick submission status counters (Pending, Approved, Rejected), and a course switcher modal for multi-course accounts.
* **My Certificates Screen (`CertificateListScreen.js`):** A history of all submissions made, listing details for each certificate (activity title, submission date, requested and computed hours, status, remarks, and course).
* **Upload Proof Screen (`UploadProofScreen.js`):** The first step in submitting a certificate, allowing the student to take a photo using their device's camera or select a local image/PDF file.
* **New Activity Details Screen (`NewActivityScreen.js`):** The second step in submitting a certificate, where the user enters the activity title, hours, and selection of the corresponding rule.
* **Choose Course Screen (`CourseSelectionScreen.js`):** The final step of submission, where the student specifies which of their courses should receive the activity's complementary hours.

---

## Future Improvements

* **Push Notifications:** Real-time push alerts sent to devices when coordinators update certificate status.
* **Offline Support with Caching:** Local caching of the student's progress and history data for offline visibility.
* **In-App Document Viewer:** Native rendering of certificate images and PDFs directly within the app's detail views.
* **Dark Mode Support:** Dynamic dark theme implementation for enhanced visual comfort and accessibility.

---

## Authors & Project Team

* **Homero Flávio**
* **Joelson José**
* **Kallyne Melo**
* **Lucas Ximenes**
* **Marcelly Arcanjo**
* **Nicollas Abrão**
* **Thayanne Rodrigues**

### Academic Advisor
* **Technical English Course Professor:** Prof. Leonardo Trevas
