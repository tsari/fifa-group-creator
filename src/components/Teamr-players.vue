<template>
    <div class="container" v-show="showContent">
        <div class="subtitle has-text-centered">Competitors</div>

        <p class="control has-addons has-addons-centered">
            <input :class="{'input': true, 'is-danger': errors.has('competitor')}" autofocus class="input" type="text"
                   placeholder="Name" name="competitor" v-model="competitor" @keyup.enter="addCompetitor"
                   v-validate="{rules: {required: true, alpha_num: true, not_in: competitors}}"
                   data-vv-validate-on="input">
            <a @click="addCompetitor" class="button is-info">
                Add
            </a>
        <div class="has-text-centered">
            <span v-show="errors.has('competitor')" class="help is-danger">{{ errors.first('competitor') }}</span>
        </div>
        </p>

        <div class="content has-text-centered">
            <section class="section" v-show="show">
                <div class="box">

                    <table class="table is-striped">
                        <thead>
                        <tr>
                            <th colspan="2">Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(competitor, index) in competitors">
                            <td>{{ competitor }}</td>
                            <td class="has-text-right"><span class="icon is-small pointer" @click="removePlayer(index)"><i
                                    class="fa fa-trash"></i></span></td>
                        </tr>
                        </tbody>
                    </table>

                    <div class="content has-text-right">
                        <button class="button is-outlined" @click="clearCompetitors">Clear all</button>
                    </div>
                </div>
            </section>

            <button class="button" v-show="show" @click="nextStep">Continue to next step</button>
        </div>
    </div>
</template>


<script>
    export default {
        name: 'teamr-players',
        props: ['step'],
        data() {
            return {
                competitor: '',
                competitors: [],
                show: false,
                showContent: false
            }
        },
        methods: {
            addCompetitor(){
                this.$validator.validateAll()
                    .then(() => {
                        this.competitors.push(this.competitor);
                        this.competitor = '';
                        this.showPlayers();
                    })
                    .catch(() => {
                        // do nothing as the error is already shown in the html
                    });

            },
            removePlayer(index){
                this.competitors.splice(index, 1);
                this.showPlayers();
            },
            showPlayers(){
                this.show = this.competitors.length !== 0;
            },
            clearCompetitors(){
                this.competitors = [];
                localStorage.setItem('competitors', []);
                this.showPlayers();
            },
            nextStep(){
                this.persist();
                this.showContent = false;
            },
            persist(){
                localStorage.setItem('competitors', this.competitors);
                this.$root.$emit('showNextStep', {lastStep: this.step});
            },
            showContentData(step){
                this.errors.clear();
                this.showContent = step == null && this.step == 1 || step != null && parseInt(step.lastStep, 10) - 1 == this.step;
            }
        },
        created(){
            if (localStorage.getItem('competitors') && localStorage.getItem('competitors').length > 0) {
                this.competitors = localStorage.getItem('competitors').split(',');
            }
            this.showPlayers();

            // first page load
            this.showContentData();

            // call from another step
            this.$root.$on('showPreviousStep', this.showContentData);
        }
    }
</script>
<style type="text/css">
    .pointer {
        cursor: pointer
    }
</style>