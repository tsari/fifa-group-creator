<template>
    <div class="container has-text-centered" v-show="showContent">
        <div class="subtitle">Tournament draw</div>
        <div class="content">
            <a class="button is-success" @click="draw">
                <span class="icon is-small">
                    <i class="fa fa-play-circle"></i>
                </span>
                <span>Start drawing teams and groups</span>
            </a>

            <section class="section" v-if="drawError.length">
                <div class="notification is-danger">
                    {{ drawError }}
                </div>
            </section>

            <section class="section">
                <div class="box" v-if="drawn">
                    <teamr-stats
                            :competitorCount="payload.competitors.length"
                            :groupCount="payload.groups"
                            :teamPoolSize="results.teamPoolSize"
                            :teamPoolRemaining="teamPoolRemaining.length"
                    ></teamr-stats>
                    <teamr-group :data="group" v-for="(group, index) in results.groups" :name="index"></teamr-group>
                </div>

                <div v-if="drawn" :class="{'message': true, 'is-danger': teamPoolRemaining.length === 0}">
                    <div class="message-header">
                        <p>Remaining teams</p>
                    </div>
                    <div class="message-body">
                        <span class="tag"
                              v-for="team in teamPoolRemaining"
                        >{{team.team}}</span>

                        <span v-if="teamPoolRemaining.length === 0" class="tag is-dark">Team pool is empty!</span>
                    </div>
                </div>
            </section>

            <button class="button" @click="prevStep">Back to options</button>
        </div>
    </div>
</template>
<script type="javascript">
    import teamrGroup from './Teamr-group.vue'
    import teamrStats from './Teamr-stats.vue'
    export default {
        props: ['step'],
        components: {'teamr-group': teamrGroup, 'teamr-stats': teamrStats},
        data(){
            return {
                results: {},
                drawn: false,
                drawError: '',
                payload: {},
                teamPoolRemaining: [],
                showContent: false
            }
        },
        methods: {
            draw(){
                this.drawn = this.drawn;

                this.$http.post('http://localhost:8081/scrape', this.payload)
                    .then(
                        response => {
                            this.results = response.data;
                            this.payload['drawnTeams'] = [];
                            for (let group in response.data.groups) {
                                for (let item in response.data.groups[group]) {
                                    this.payload['drawnTeams'].push(response.data.groups[group][item].team);
                                }
                            }

                            localStorage.setItem('payload', JSON.stringify(this.payload));
                            this.drawTeamPool();
                            this.drawn = true;
                        }
                    )
                    .catch(error => {
                        this.drawError = error.body;
                        console.log(error);
                    });
            },
            reset(){
                this.drawError = '';
                this.drawn = false;
                this.results = {};
            },
            prevStep(){
                this.showContent = false;
                this.reset();
                this.$root.$emit('showPreviousStep', {lastStep: this.step});
            },
            showContentData(step){
                if (localStorage.getItem('options') && localStorage.getItem('competitors') && localStorage.getItem('competitors').length > 0) {
                    this.competitors = {competitors: localStorage.getItem('competitors').split(',')};
                    this.payload = Object.assign({}, JSON.parse(localStorage.getItem('options')), this.competitors);
                }

                if (step != null && parseInt(step.lastStep, 10) + 1 == this.step) {
                    this.showContent = true;
                }
            },
            drawTeamPool(team = ''){
                if (team.length > 0) {
                    this.teamPoolRemaining = this.teamPoolRemaining.filter(item => {return item.team !== team});
                } else {
                    this.teamPoolRemaining = this.results.teamPool.filter(team => {
                        return this.payload.drawnTeams.indexOf(team.team) === -1;
                    });
                }
            }
        },
        created() {
            this.$root.$on('showNextStep', this.showContentData);
            this.$root.$on('draw', this.drawTeamPool);
        }
    }
</script>