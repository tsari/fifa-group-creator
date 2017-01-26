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

            <section class="section">
                <div class="box" v-if="drawn">
                    <teamr-stats
                            :competitorCount="payload.competitors.length"
                            :groupCount="payload.groups"
                            :teamPoolSize="results.teamPoolSize"
                    ></teamr-stats>
                    <teamr-group :data="group" v-for="(group, index) in results.groups" :name="index"></teamr-group>
                </div>
            </section>

            <button class="button" @click="prevStep">Back to options</button>
        </div>
    </div>
</template>
<script>
    import teamrGroup from './Teamr-group.vue'
    import teamrStats from './Teamr-stats.vue'
    export default {
        props: ['step'],
        components: {'teamr-group': teamrGroup, 'teamr-stats': teamrStats},
        data(){
            return {
                results: {},
                drawn: false,
                payload: {},
                showContent: false
            }
        },
        methods: {
            draw(){
                this.drawn = false;

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
                            this.drawn = true;
                        }
                    )
                    .catch(error => {
                        console.log(error);
                    });
            },
            prevStep(){
                this.showContent = false;
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
            }
        },
        created() {
            this.$root.$on('showNextStep', this.showContentData);
        }
    }
</script>