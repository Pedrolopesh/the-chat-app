<template>
    <div>
        <div v-if="items.length === 0 ">
            <h2 v-if="!apiLoading" class="mt-5 mb-5">Não há usuários para iniciar uma conversa, compartilhe nosso app com seus amigos 😆</h2>
        </div>

        <div v-else>
            <div class="d-flex" v-for="(items, index) in items" :key="index">
                <button
                    :class="activeSelected === index ? 'activeSelected' : 'notSelected' "
                    class="mt-2 button-contact"
                    :active="active == 0"
                    @click="selectedUserOption(items, index)"
                >
                    <b-avatar
                        v-if="items.img_profile != '' "
                        class="ml-2"
                        :src='items.img_profile'
                    ></b-avatar>
                    <div class="center ml-2"> {{ items.name }} </div>
                </button>
            </div>

            <div>
                <div class="footer-dialog">
                    <div class="new">
                        <button
                            @click="tryCreateChat()"
                            class="submitValue"
                            :disabled="addDisable"
                            :class="addDisable ? 'disableSubmit' : 'enableSubmit' "
                        >
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { BIconEnvelope } from 'bootstrap-vue';

import dayjs from 'dayjs';

export default {
    components: {
        BIconEnvelope,
    },

    data:() => ({
        active:true,
        activeSelected: false,
        addDisable: false,
        items: '',
        userData: '',
        selectedUserChat:'',
    }),

    computed:{
        ...mapGetters({
            apiLoading:'apiLoading',
            userDataVuex:'userData',
        })
    },

    methods:{

        async getAllUsers(){
            this.$store.commit('setApiLoading', true)
            const resp = await this.$http.get(this.$url + '/list/users').catch(err => { console.log(err) })
            if(resp.data == ''){ this.$store.commit('setApiLoading', false) }
            else{ this.$store.commit('setApiLoading', false) }
            this.rebuildUsersArray(resp.data)
        },

        rebuildUsersArray(allUsers) {
            const filterArray = allUsers.filter((item) => {
                return item._id !== this.userData
            })
            this.items = filterArray
        },

        selectedUserOption(param, index) {
            this.activeSelected = index
            this.selectedUserChat = param
            this.$emit('selectedUser', param)
        },

        tryCreateChat() {
            if(this.selectedUserChat === ''){
                return this.$vs.notification({ color: 'danger', position: 'top-center', title: 'Você deve selecionar uma pessoa para começar uma conversa!' })
            }

            var now = dayjs()
            let time = now.format("HH:mm")
            let date = now.format("DD/MM/YYYY")

            let chatData = [{ sender: "origin", message: "olá", timestamp: date + '-' + time}]
            let body = {
                user_origin:this.userDataVuex._id,
                user_response:this.selectedUserChat._id,
                chatData:chatData
            }

            this.$http.post(this.$url + '/create/chat', body)
            .then(resp =>{
                if(resp.data.error == 'Alredy have a chat'){
                    console.log(resp.data.message._id)
                    this.$vs.notification({ color: 'danger', position: 'top-center', title: 'você já possui uma conversa com esse usuário. vá em conversas 😓', })
                }else{
                    sessionStorage.setItem('chatId', JSON.stringify(resp.data));
                    this.$store.commit('setChatCreated', true)
                    this.$vs.notification({ color: 'success', position: 'top-center', title: 'Nova conversa adicionada com sucesso, 👏', })
                    this.$store.commit('setChatId', resp.data)
                    this.$emit('closeNewChatModal', false)
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    },

    created() {
        this.userData = localStorage.getItem('id')
        this.getAllUsers()
        const loading = this.$vs.loading()
        setTimeout(() => {
            loading.close()
        }, 2000)
    },

    watch: {
        // userDataVuex() {
        //     console.log('wacth', this.userDataVuex)
        // }
    }
}
</script>


<style lang="scss">
.button-contact {
    cursor: pointer;
    border: none;
    padding: 10px;
    max-width: 100%;
    width: 100%;
    align-items: end;
    justify-content: end;
    display: inline-flex;
    border-radius: 10px;
    background: none;

    &:hover {
        transition: 0.7s;
        border-radius: 10px;
        background-color: #ffe2e2 !important;
        box-shadow: -10px 6px 15px rgb(0 0 0 / 20%) !important;
    }

    &:not(:hover){
        transition: 0.7s;
    }
}

.activeSelected {
    transition: 0.7s;
    border-radius: 10px;
    background-color: #ffe2e2 !important;
    box-shadow: -10px 6px 15px rgb(0 0 0 / 20%) !important;
}

.notSelected {
    border-radius: 0;
    background: none;
    box-shadow: none;
}
</style>