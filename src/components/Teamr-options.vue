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
                            <input autofocus class="input" type="text" v-model="options.groups"
                                   placeholder="1 ... n (default: 2)">
                        </p>

                        <div class="control-label">
                            <label class="label">Stars</label>
                        </div>
                        <p class="control is-expanded">
                            <input class="input" type="text" v-model="options.stars"
                                   placeholder="0.5 ... 5 (default: 4)">
                        </p>
                    </div>
                </div>
                <div class="control is-horizontal">
                    <div class="control-label">
                        <label class="label">Overall rating</label>
                    </div>
                    <div class="control is-grouped">
                        <p class="control is-expanded">
                            <input class="input" type="text" v-model="options.overallMin"
                                   placeholder="min: 0 ... 100 (default: 77)"
                            >
                        </p>

                        <div class="control-label">
                            <label class="label">max</label>
                        </div>
                        <p class="control is-expanded">
                            <input class="input" type="text" v-model="options.overallMax"
                                   placeholder="min: 0 ... 100 (default: 79)"
                            >
                        </p>
                    </div>
                </div>
                <div class="control is-horizontal">
                    <div class="control-label">
                        <label class="label">Team type</label>
                    </div>
                    <p class="control">
              <span class="select">
                <select v-model="options.teamType">
                  <option value="0">Club teams</option>
                  <option value="1">National teams (m)</option>
                  <option value="2">National teams (w)</option>
                </select>
              </span>
                    </p>
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
                    overallMin: this.options.overallMin || 77,
                    overallMax: this.options.overallMax || 79,
                    stars: this.options.stars || 4,
                    teamType: this.options.teamType || 0,
                    teamTypes: {
                        0: 'club',
                        1: 'nationalMen',
                        2: 'nationalWomen',
                    }
                }
            }
        },
        methods: {
            nextStep(){
                this.persist();
                this.showContent = false;
                this.$root.$emit('showNextStep', {lastStep: this.step});
            },
            prevStep(){
                this.showContent = false;
                this.$root.$emit('showPreviousStep', {lastStep: this.step});
            },
            persist(){
                localStorage.setItem('options', JSON.stringify(this.selectedOptions));
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