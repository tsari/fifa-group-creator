<template>
    <table class="table is-striped capitalize">
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
            <th>{{competitor}}</th>
            <td>{{team.team}}</td>
            <td>{{team.league}}</td>
            <td>{{team.attack}}</td>
            <td>{{team.midfield}}</td>
            <td>{{team.defense}}</td>
            <td>{{team.overall}}</td>
            <td>
                <teamr-stars :stars="team.stars"></teamr-stars>
            </td>
            <td><span class="icon is-small pointer" @click="reDraw(competitor)"><li class="fa fa-repeat"></li></span>
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
</style>