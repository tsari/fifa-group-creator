<template>
    <table class="table is-striped capitalize is-narrow">
        <thead>
        <tr>
            <th colspan="9">Group {{name}}</th>
        </tr>
        <tr>
            <th>Competitor</th>
            <th>Team</th>
            <th>League</th>
            <th>Attack</th>
            <th>Midfield</th>
            <th>defense</th>
            <th>Overall</th>
            <th colspan="2">Stars</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(team, competitor) in data">
            <th class="competitor">{{competitor}}</th>
            <td class="team">{{team.team}}</td>
            <td class="league">{{team.league}}</td>
            <td class="rating">{{team.attack}}</td>
            <td class="rating">{{team.midfield}}</td>
            <td class="rating">{{team.defense}}</td>
            <td class="rating">{{team.overall}}</td>
            <td class="stars">
                <teamr-stars :stars="team.stars"></teamr-stars>
            </td>
            <td class="actions"><span class="icon is-small pointer" @click="reDraw(competitor)"><li class="fa fa-repeat"></li></span>
            </td>
        </tr>
        </tbody>
    </table>
</template>
<script type="javascript">
    import teamrStars from './Teamr-stars.vue'
    export default {
        props: ['data', 'name'],
        components: {teamrStars},
        data(){
            return {
                payload: {}
            }
        },
        methods: {
            reDraw(competitor){
                this.payload = JSON.parse(localStorage.getItem('payload'));

                this.$http.post('http://localhost:8081/reDraw', this.payload)
                    .then(
                        response => {
                            this.data[competitor] = response.data;
                            this.payload['drawnTeams'].push(response.data.team);

                            localStorage.setItem('payload', JSON.stringify(this.payload));
                            this.$root.$emit('draw');
                        }
                    )
                    .catch(error => {
                        console.log(error);
                    });
            }
        }
    }
</script>
<style type="text/css">
    .capitalize {
        text-transform: capitalize
    }

    .pointer {
        cursor: pointer
    }

    table th.competitor, td.competitor {width: 10%}
    table th.team, td.team {width: 16%}
    table th.league, td.league {width: 16%}
    table th.rating, td.rating {width: 1%}
    table th.stars, td.stars {width: 13%}
    table th.actions, td.actions {width: 1%}

</style>