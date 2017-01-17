<template>
    <table class="table is-striped capitalize">
        <thead>
        <tr>
            <th colspan="8">Group {{name}}</th>
        </tr>
        <tr>
            <th>Competitor</th>
            <th>Team</th>
            <th>League</th>
            <th>Attack</th>
            <th>Midfield</th>
            <th>defense</th>
            <th>Overall</th>
            <th>Stars</th>
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
            <td><teamr-stars :stars="team.stars"></teamr-stars></td>
        </tr>
        </tbody>
    </table>
</template>
<script>
    import teamrStars from './Teamr-stars.vue'
    export default {
        props: ['data', 'name'],
        components: {teamrStars},
        methods: {}
    }
</script>
<style type="text/css">
    .capitalize{text-transform: capitalize}
</style>