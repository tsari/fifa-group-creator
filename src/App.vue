<template>
    <div id="app">
        <section class="section hero is-dark">
            <div class="container">
                <h1 class="title has-text-centered">FIFA tournament group creator</h1>

            </div>
        </section>

        <section class="section">

                <teamr-players step="1"></teamr-players>
                <teamr-options step="2"></teamr-options>
                <teamr-draw step="3"></teamr-draw>

        </section>

    </div>
</template>

<script>
    // main component that registers all other components
    import teamrPlayers from './components/Teamr-players.vue'
    import teamrOptions from './components/Teamr-options.vue'
    import teamrDraw from './components/Teamr-draw.vue'
    export default {
        name: 'app',
        components: { teamrPlayers, teamrOptions, teamrDraw },
        data () {
            return {}
        },
        methods: {
            logContent(data){
                console.log(data);
            }
        }
    }
</script>
