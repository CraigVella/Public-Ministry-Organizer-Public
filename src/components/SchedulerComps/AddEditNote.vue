<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">{{this.note ? 'Edit' : 'Add'}} Note</p>
            <button
                type="button"
                class="delete"
                @click="$emit('cancel')"></button>
        </header>
        <section class="modal-card-body">
            <b-field label="Note">
                <b-input
                    v-model="newNote"
                    type="textarea">
                </b-input>
            </b-field>
        </section>
        <footer class="modal-card-foot">
            <b-button
                label="Cancel"
                @click="$emit('cancel')" type='is-danger'></b-button>
            <b-button
                :label="this.note ? 'Update' : 'Create'"
                type="is-primary" @click="updateNote(false)"></b-button>
            <b-button v-if="this.note"
                label="Remove Note"
                type="is-warning" @click="updateNote(true)"></b-button>
        </footer>
        <b-loading :is-full-page="true" v-model="loading"></b-loading>
    </div>
</template>

<script>
export default {
    name: "AddEditNote",
    props: {
        note: String
    },
    data() {
        return {
            newNote: this.note ? this.note.toString() : '',
            loading: false
        }
    },
    methods: {
        updateNote(remove) {
            this.loading = true;
            if (remove) {
                this.$emit('onNoteReturn',null);
            } else {
                this.$emit('onNoteReturn',this.newNote);
            }
        }
    }
}
</script>
