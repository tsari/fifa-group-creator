<template>
    <div class="container has-text-centered" v-show="showContent">
        <div class="subtitle has-text-centered">Options</div>

        <section class="section">
            <div class="box">
                <div class="control is-horizontal">
                    <div class="control-label">
                        <label class="label">Group count</label>
                    </div>
                    <div class="control is-grouped">
                        <p class="control is-expanded">
                            <input autofocus class="input" type="text" v-model="options.groups" name="groups"
                                   v-validate="'min_value:1'"
                                   data-vv-as="group count"
                                   placeholder="1 ... n (default: 2)"
                            >
                            <span :class="{'help': true, 'is-danger': true, 'isVisible': errors.has('groups'), 'isHidden': !errors.has('groups')}">
                                {{errors.first('groups') || '&nbsp;'}}
                            </span>
                        </p>

                        <div class="control-label">
                            <label class="label">Stars</label>
                        </div>
                        <p class="control is-expanded">
                            <input :class="{'input': true, 'is-danger': errors.has('stars')}" type="text" v-model="options.stars" name="stars"
                                   placeholder="0.5 ... 5"
                                   v-validate="'in:[0.5,1,1.5,2,2.5,3,3.5,4,4.5,5]'"
                            >
                            <span :class="{'help': true, 'is-danger': true, 'isVisible': errors.has('stars'), 'isHidden': !errors.has('stars')}">
                                {{errors.first('stars') || '&nbsp;'}}
                            </span>
                        </p>
                    </div>
                </div>
                <div class="control is-horizontal">
                    <div class="control-label">
                        <label class="label">Overall rating min</label>
                    </div>
                    <div class="control is-grouped">
                        <p class="control is-expanded">
                            <input class="input" type="text" v-model="options.overallMin"
                                   placeholder="min: 0 ... 100" name="overallMin"
                                   v-validate="'between:1,100'"
                                   data-vv-as="min"
                            >
                            <span :class="{'help': true, 'is-danger': true, 'isVisible': errors.has('overallMin'), 'isHidden': !errors.has('overallMin')}">
                                {{errors.first('overallMin') || '&nbsp;'}}
                            </span>
                        </p>

                        <div class="control-label">
                            <label class="label">max</label>
                        </div>
                        <p class="control is-expanded">
                            <input class="input" type="text" v-model="options.overallMax" name="overallMax"
                                   placeholder="max: 0 ... 100"
                                   v-validate="'between:1,100'"
                                   data-vv-as="max"
                            >
                            <span :class="{'help': true, 'is-danger': true, 'isVisible': errors.has('overallMax'), 'isHidden': !errors.has('overallMax')}">
                                {{errors.first('overallMax') || '&nbsp;'}}
                            </span>
                        </p>
                    </div>
                </div>
                <div class="control is-horizontal">
                    <div class="control-label">
                        <label class="label">Team type</label>
                    </div>
                    <div class="control is-grouped">
                        <p class="control is-expanded">
                          <span class="select">
                            <select v-model="options.teamType">
                              <option value="0">Club teams</option>
                              <option value="1">National teams (m)</option>
                              <option value="2">National teams (w)</option>
                            </select>
                          </span>
                        </p>

                        <p class="control">
                            <button class="button" @click="reset">
                                Reset Form
                            </button>
                        </p>
                    </div>

                </div>

            </div>
        </section>

        <div class="columns">
            <div class="column is-one-quarter is-offset-one-quarter">
                <button class="button" v-show="!show" @click="prevStep">Previous step</button>
            </div>
            <div class="column is-one-quarter">
                <button class="button" @click="nextStep">Continue to next step</button>
            </div>
        </div>

    </div>

</template>
<script>
    export default {
        name: 'teamr-options',
        props: ['step'],
        data() {
            return {
                options: {
                    groups: '',
                    overallMin: '',
                    overallMax: '',
                    stars: '',
                    teamType: 0
                },
                show: false,
                showContent: false,
            }
        },
        computed: {
            selectedOptions(){
                return {
                    groups: this.options.groups || 2,
                    overallMin: this.options.overallMin,
                    overallMax: this.options.overallMax,
                    stars: this.options.stars,
                    teamType: this.options.teamType || 0,
                    teamTypes: {
                        0: 'club',
                        1: 'nationalMen',
                        2: 'nationalWomen',
                    }
                }
            },
            errorText(){
                return this.errors.first || '&nbsp;';
            }
        },
        methods: {
            foo(elem){
                console.log(this.errors.first(elem.target.name));
            },
            nextStep(){
                this.$validator.validateAll()
                    .then(() => {
                        this.persist();
                        this.showContent = false;
                        this.$root.$emit('showNextStep', {lastStep: this.step});
                    })
                    .catch(() => {
                        // do nothing as the error is already shown in the html
                    });
            },
            prevStep(){
                this.showContent = false;
                this.$root.$emit('showPreviousStep', {lastStep: this.step});
            },
            persist(){
                localStorage.setItem('options', JSON.stringify(this.selectedOptions));
            },
            reset(){
                this.options = {
                    groups: '',
                        overallMin: '',
                        overallMax: '',
                        stars: '',
                        teamType: 0
                }
            },
            showContentData(step){
                if (step != null && (parseInt(step.lastStep, 10) + 1 == this.step || parseInt(step.lastStep, 10) - 1 == this.step)) {
                    this.showContent = true;
                }
            }
        },
        created(){
            this.$root.$on('showNextStep', this.showContentData);
            this.$root.$on('showPreviousStep', this.showContentData);
        }
    }
</script>
<style type="text/css">
    .isVisible{visibility: visible}
    .isHidden{visibility: hidden}
</style>