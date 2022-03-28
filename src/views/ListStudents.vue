<template>
  <v-card>
    <!-- Campo para pesquisar aluno -->
    <v-card-title>
      <v-toolbar color="#efb300">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Pesquisar pelo nome do aluno"
          clearable
          solo-inverted
          hide-details
          color="#efb300"
        ></v-text-field>
      </v-toolbar>
    </v-card-title>

    <!-- Tabela para exibir os alunos cadastrados -->
    <!-- Inicia os registros ordenados pelo nome do aluno -->
    <v-data-table
      :headers="headers"
      :items="students"
      :search="search"
      sort-by="name"
      class="elevation-1"
    >
      <template v-slot:[`top`]>
        <v-toolbar
          flat
        >
          <!-- Título de identificação da listagem -->
          <v-toolbar-title>Alunos cadastrados</v-toolbar-title>
          
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>

          <v-spacer></v-spacer>

          <!-- Caixa de diálogo para cadastro e edição de aluno -->
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:[`activator`]="{ on, attrs }">
              <v-btn
                color="#efb300"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                <span style="color:black">Cadastrar</span>
              </v-btn>
            </template>

            <v-card>
              <!-- Título do formulário -->
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <!-- Campos do formulário -->
              <v-card-text>
                <v-container>
                  <v-row>
                    
                    <!-- Campo nome -->
                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        ref="name"
                        label="Nome"
                        v-model="editedItem.name"
                        autofocus
                        placeholder="Informe o nome"
                      ></v-text-field>
                    </v-col>

                    <!-- Campo e-mail -->
                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        ref="email"
                        label="E-mail"
                        v-model="editedItem.email"
                        placeholder="Informe o e-mail"
                      ></v-text-field>
                    </v-col>

                    <!-- Campo registro acadêmico -->
                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        type="number"
                        ref="academic_record"
                        label="Registro acadêmico"
                        placeholder="Informe o número do registro acadêmico"
                        v-model="editedItem.academic_record"
                        :disabled=disableAcademicRecord
                      ></v-text-field>
                    </v-col>

                    <!-- Campo CPF -->
                    <v-col
                      cols="12"
                    >
                      <v-text-field
                        ref="cpf"
                        label="CPF"
                        placeholder="Informe o CPF"
                        v-model="editedItem.cpf"
                        :disabled=disableCpf
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <!-- Botões para salvar ou cancelar o processo de cadastro -->
              <v-card-actions>

                <v-spacer></v-spacer>
                
                <!-- Botão para cancelar o processo e não salvar os dados no banco de dados -->
                <v-btn
                  color="#efb300"
                  dark
                  class="mb-2"
                  @click="close"
                >
                  <span style="color:black">Cancelar</span>
                </v-btn>
                
                <!-- Botão para salvar os dados do aluno no banco de dados -->
                <v-btn
                  color="#efb300"
                  dark
                  class="mb-2 mr-5"
                  @click="save"
                >
                  <span style="color:black">Salvar</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Caixa de diálogo para confirmação da exclusão de um aluno -->
          <v-dialog v-model="dialogDelete" max-width="520px">
            <v-card>
              <v-card-title class="text-h5">Tem certeza que deseja excluir este aluno?</v-card-title>
              
              <!-- Botões para cancelamento ou confirmação da exclusão -->
              <v-card-actions>
                <v-spacer></v-spacer>
                
                <v-btn 
                  color="#efb300"
                  dark
                  @click="closeDelete"
                >
                  <span style="color:black">Não</span>
                </v-btn>
                
                <v-btn 
                  color="#efb300"
                  dark
                  @click="deleteItemConfirm"
                >
                  <span style="color:black">Sim</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <!-- Botões para manipular os registros da listagem de alunos(Edição e Exclusão) -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- Caixa de diálogo para exibição de uma mensagem informativa ao usuário. -->
    <v-dialog
        v-model="showDialogInformation"
        max-width="560px"
    >
        <v-card>
            <v-card-title>
                {{msgDialogInformation}}
            </v-card-title>

            <v-divider class="mx-4" color="#efb300"></v-divider>
            
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    small
                    color="#efb300"
                    class="texto-botao-ok"
                    @click="showDialogInformation = false"
                >
                Ok
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import axios from 'axios';
  
  export default {
    data () {
      return {
        showDialogInformation: false,
        msgDialogInformation: '',
        search: '',
        dialog: false,
        dialogDelete: false,
        headers: [
          { 
            text: 'Registro acadêmico', 
            value: 'academic_record',
            align: 'start',
            sortable: false,
            filterable: false
          },
          {
            text: 'Nome',
            value: 'name',
            align: 'start',
            sortable: true,
            filterable: true
          },
          { 
            text: 'CPF', 
            value: 'cpf',
            align: 'start',
            sortable: false,
            filterable: false
          },
          { 
            text: 'Ações', 
            value: 'actions', 
            sortable: false 
          }
        ],
        primarykey: -1,
        editedItem: {
          academic_record: '',
          name: '',
          cpf: '',
          email: ''
        },
        students: [],
        headersRequest: {
            headers: {
              'Accept': 'application/json'
            }
        },
        disableCpf: false,
        disableAcademicRecord: false
      }
    },
    computed: {
      formTitle () {
        return this.primarykey === -1 ? 'Novo aluno' : 'Editar aluno'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        axios.get('http://localhost:8081/students', this.headersRequest)
          .then((response) => {
            this.students = response.data;
          }
        );
      },
      editItem (item) {
        this.disableCpf = true;
        this.disableAcademicRecord = true;
        // Coleta o registro seleciondo para edição
        this.editedItem = Object.assign({}, item)
        // Coleta o indice do resgitro selecionado pera edição
        this.primarykey = this.editedItem.academic_record;
        this.dialog = true
      },
      deleteItem (item) {
        // Coleta o registro seleciondo para edição
        this.editedItem = Object.assign({}, item)
        // Coleta o indice do resgitro selecionado pera edição
        this.primarykey = this.editedItem.academic_record;
        this.dialogDelete = true
      },
      deleteItemConfirm () {
        // Exclui o aluno no banco de dados
        axios.delete('http://localhost:8081/student/' + this.primarykey, this.headersRequest)
          .then((response) => {
            console.log(response);
            this.closeDelete()
          }
        );
      },
      close () {
        this.dialog = false;
        this.primarykey = -1
        this.clearForm();
        this.initialize ();
      },
      closeDelete () {
        this.dialogDelete = false;
        this.primarykey = -1;
        this.initialize ();
      },
      save () {
        if ( !isNaN(this.primarykey) && (this.primarykey > -1) ) {
          if(this.editedItem.name == '') {
            this.msgDialogInformation = 'O nome é obrigatório!';
            this.showDialogInformation = true;
            return false;
          }
          
          if(this.editedItem.email == '') {
            this.msgDialogInformation = 'O E-mail é obrigatório!';
            this.showDialogInformation = true;
            return false;
          }

          // Quando primaryKey é informada indica uma operação de edição
          axios.put('http://localhost:8081/student/' + this.primarykey, this.editedItem, this.headersRequest)
            .then((response) => {
              this.returnInsertEdit(response.data.erro);
            }
          );
        } else {
          if(this.editedItem.name == '') {
            this.msgDialogInformation = 'O nome é obrigatório!';
            this.showDialogInformation = true;
            return false;
          }
          
          if(this.editedItem.email == '') {
            this.msgDialogInformation = 'O E-mail é obrigatório!';
            this.showDialogInformation = true;
            return false;
          }

          if(this.editedItem.academic_record == '') {
            this.msgDialogInformation = 'O registro acadêmico é obrigatório!';
            this.showDialogInformation = true;
            return false;
          }

          if(this.editedItem.cpf == '') {
            this.msgDialogInformation = 'O CPF é obrigatório!';
            this.showDialogInformation = true;
            return false;
          }

          // Quando primaryKey não é informada indica uma operação de inclusão
          axios.post('http://localhost:8081/student', this.editedItem, this.headersRequest)
            .then((response) => {
              this.returnInsertEdit(response.data.erro);
            }
          );
        }
      },
      returnInsertEdit (returnError) {
        if ( (returnError != undefined) && (returnError != '') ) {
          this.msgDialogInformation = returnError;
          this.showDialogInformation = true;
        } else {
          this.close();
        }  
      }, 
      clearForm () {
        this.disableCpf = false;
        this.disableAcademicRecord = false;
        
        if (this.$refs.name.value != '') {
          this.$refs.name.reset();
        }
        if (this.$refs.email.value != '') {
        this.$refs.email.reset();
        }
        
        if (this.$refs.academic_record.value != '') {
          this.$refs.academic_record.reset();
        }

        if (this.$refs.cpf.value != '') {
          this.$refs["cpf"].reset();
        }
      }
    }
  }
</script>