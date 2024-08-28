# API Médica

Este será um projeto pessoal para estudo de API's simulando um sistema de hospital/consultório, onde secretários e  doutores teriam acesso, desta forma, podem cadastrar seus pacientes, com algumas informaçẽs de endereço e etc. 


## Assitentes podem:
- Se registrar                                              (FEITO)
- Logar                                                     (FEITO)
- Cadastrar pacientes                                       (FEITO)
- Cadastrar médicos                                         (FEITO)
                                  
- Cadastrar/remover/alterar/visualizar consultas médicas    (FEITO) **FAZER ALGUMA VALIDAÇÃO DE CONSULTAS NA MESMA HORA**
- Enviar notificação de consulta ao paciente                
- Logout                                                    (FEITO)          

## Médicos podem:
- Logar                                                     (FEITO)
- Criar relatórios médicos                                  (FEITO)     
- Visualiazar estes relatórios de pacientes (Reports)       (FEITO)
- Visualizar as consultas marcadas                                      
- Logout                                                    (FEITO)

## Pacientes podem:
- Registrar                                                 (FEITO)
- Logar                                                     (FEITO)
- Ver suas infromações                                      (FEITO)
- Alterar informações                                       (FEITO)                                                     
- Visualizar todas as consultas                                                           
- Logout                                                    (FEITO) 



# FAZER AS SEGUINTES MUDANÇAS:

**FAZER VALIDAÇÃO DE NÚMERO**
**FAZER MIDDLEWEARE PARA CONFERIR ROLE**
**FAZER MIDDLEWARE DE EMAIL PARA CONFERIR SE EXISTE OU NÃO**
**FAZER MIDDLEWARE DE SENHA PARA CONFERIR SE ESTÁ CORRETA OU NÃO**
**SISTEMA DE RECUPERAÇÃO DE SENHA??**
**FAZER UM USERROLE**
**COLOCAR NO AUTH A VALIDAÇÃO DE SENHA EM QUESTÃO DE CARACTERES**
**FAZER CACHE?**
**COLOCAR HATOES?**


**PORQUÊ --> module.exports = mongoose.model('Assistant', assistantSchema)**



## Models
1. Patient: 
name, age, email, phone_number , password

2. Doctor
name, email, password, age, medical specialty, phone_number, start_time, end_time

3. Assistant
name, email, password, phone_number, age

4. consultation
scheduled_time, doctor_id, paciente_id, status (agendada/concluída)

5. Report
doctor_id, pacient_id, date, symptoms, medicines, requested_exams, observations
