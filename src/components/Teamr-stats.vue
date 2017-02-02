<template>
    <nav class="level">
        <div class="level-item has-text-centered">
            <div>
                <p class="heading">Competitors</p>
                <p class="title">{{competitorCount}}</p>
            </div>
        </div>
        <div class="level-item has-text-centered">
            <div>
                <p class="heading">Groups</p>
                <p class="title">{{groupCount}}</p>
            </div>
        </div>
        <div class="level-item has-text-centered">
            <div>
                <p class="heading">Team Pool Size</p>
                <p class="title">{{teamPoolSize}}</p>
            </div>
        </div>
        <div class="level-item has-text-centered">
            <div>
                <p class="heading">Remaining Teams</p>
                <p class="title">{{teamPoolRemaining}}</p>
            </div>
        </div>
    </nav>
</template>
<script>
    export default {
        props: ['competitorCount', 'groupCount', 'teamPoolSize', 'teamPoolRemaining']
    }
</script>