<template>
    <span>
        <span v-for="star in drawnStars" class="icon is-small"><i :class="star"></i></span>
    </span>
</template>
<script>
    export default {
        props: ['stars'],
        computed: {
            drawnStars(){
                let icons = [];
                for (let i = this.stars; i > 0; i--) {
                    if (i >= 1) {
                        icons.push('fa fa-star');
                    } else {
                        icons.push('fa fa-star-half-o');
                    }
                }

                return icons;
            }
        }
    }
</script>